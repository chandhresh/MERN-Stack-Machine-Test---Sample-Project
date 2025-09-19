import React, { useState } from 'react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  const submit = async (e) => {
    e.preventDefault();

    if (!file) return setMsg('Select a file first');

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await axios.post(
        (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/upload',
        fd,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload response:', res.data);
      setMsg(res.data.message);
      // optional: reload after some delay if needed
      // setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error('Upload error:', err.response || err);
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="card" style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
      <h3>Upload CSV</h3>
      <form onSubmit={submit}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" style={{ marginTop: '10px' }}>
          Upload & Distribute
        </button>
      </form>
      {msg && <p style={{ marginTop: '10px', color: 'green' }}>{msg}</p>}
      <p style={{ fontSize: 12, marginTop: '5px' }}>
        CSV must have columns: FirstName, Phone, Notes
      </p>
    </div>
  );
}
