const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parse } = require('csv-parse');
const fs = require('fs');
const auth = require('../middleware/auth');
const Agent = require('../models/Agent');
const ListItem = require('../models/ListItem');
const Assignment = require('../models/Assignment');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

function allowed(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return ['csv', 'xlsx', 'xls'].includes(ext);
}

// Upload and process CSV
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File required' });
    }

    if (!allowed(req.file.originalname)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    const buffer = fs.readFileSync(req.file.path);

    parse(buffer, {
      // ✅ Normalize headers: remove BOM + trim
      columns: header =>
        header.map(h => h.replace(/^\uFEFF/, '').trim()),
      trim: true
    }, async (err, records) => {
      fs.unlinkSync(req.file.path);

      if (err) {
        return res.status(400).json({ message: 'CSV parse error', error: err.message });
      }

      // ✅ Validate columns
      const needed = ['FirstName', 'Phone', 'Notes'];
      const first = records[0] || {};
      const keys = Object.keys(first);
      const hasAll = needed.every(n => keys.includes(n));
      if (!hasAll) {
        return res.status(400).json({ message: `CSV must contain columns: ${needed.join(',')}`, found: keys });
      }

      // Save list items
      const items = await Promise.all(
        records.map(r =>
          new ListItem({
            firstName: r['FirstName'],
            phone: r['Phone'],
            notes: r['Notes']
          }).save()
        )
      );

      // Fetch up to 5 agents
      let agents = await Agent.find();
      if (agents.length === 0) {
        return res.status(400).json({ message: 'No agents found. Create agents first.' });
      }
      agents = agents.slice(0, 5);

      // Distribute items equally
      const total = items.length;
      const base = Math.floor(total / agents.length);
      let remainder = total % agents.length;
      let idx = 0;
      const assignments = [];

      for (let i = 0; i < agents.length; i++) {
        const take = base + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;

        const assigned = items.slice(idx, idx + take).map(x => x._id);
        idx += take;

        const a = new Assignment({ agent: agents[i]._id, items: assigned });
        await a.save();

        assignments.push({ agent: agents[i]._id, assignedCount: assigned.length });
      }

      res.json({ message: 'Uploaded and distributed', totalItems: total, assignments });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get assignments
router.get('/assignments', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('agent', 'name email mobile')
      .populate('items');
    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
