import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Dashboard({ token, setToken }) {
  const [agents, setAgents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [newAgent, setNewAgent] = useState({ name: "", email: "", mobile: "", password: "" });
  const [lastFetched, setLastFetched] = useState(null); // track latest assignment timestamp

  if (!token) return <p>Please login to see the dashboard.</p>;

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Fetch agents
  const fetchAgents = async () => {
    try {
      const res = await axios.get(`${API}/api/agents`, { headers: { Authorization: `Bearer ${token}` } });
      setAgents(res.data.agents || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to fetch agents");
    }
  };

  // Fetch only new assignments
  const fetchAssignments = async () => {
    try {
      let url = `${API}/api/upload/assignments`;
      if (lastFetched) url += `?after=${lastFetched}`; // optional: backend filter by createdAt
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.assignments && res.data.assignments.length > 0) {
        setAssignments((prev) => [...prev, ...res.data.assignments]);
        // Update lastFetched to latest assignment
        const latest = res.data.assignments.reduce((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b
        );
        setLastFetched(latest.createdAt);
      }
    } catch (err) {
      console.error(err);
      setMsg("");
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchAssignments();
  }, []);

  // Add new agent
  const addAgent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/agents`, newAgent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(res.data.message);
      setNewAgent({ name: "", email: "", mobile: "", password: "" });
      fetchAgents();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add agent");
    }
  };

  // Upload CSV
  const uploadCSV = async (e) => {
    e.preventDefault();
    if (!file) return setMsg("Select a file first");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(`${API}/api/upload`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setMsg(res.data.message);
      fetchAssignments(); // fetch new assignments after upload
    } catch (err) {
      setMsg(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>
      <button onClick={logout} style={{ marginBottom: "15px" }}>
        Logout
      </button>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {/* Add Agent Form */}
      <div style={{ padding: "15px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Add Agent</h3>
        <form onSubmit={addAgent}>
          <input type="text" placeholder="Name" value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} required />
          <input type="text" placeholder="Mobile" value={newAgent.mobile} onChange={(e) => setNewAgent({ ...newAgent, mobile: e.target.value })} required />
          <input type="password" placeholder="Password" value={newAgent.password} onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })} required />
          <button type="submit" style={{ marginTop: "10px" }}>Create Agent</button>
        </form>
      </div>

      {/* Agents List */}
      <div style={{ padding: "15px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Agents</h3>
        <ul>
          {agents.map((agent) => (
            <li key={agent._id}>
              {agent.name} — {agent.email} — {agent.mobile}
            </li>
          ))}
        </ul>
      </div>

      {/* Upload CSV */}
      <div style={{ padding: "15px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Upload CSV</h3>
        <form onSubmit={uploadCSV}>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" style={{ marginTop: "10px" }}>Upload & Distribute</button>
        </form>
        <p style={{ fontSize: 12, marginTop: 5 }}>CSV must have columns: FirstName, Phone, Notes</p>
      </div>

      {/* Assignments */}
      <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Assignments (New Only)</h3>
        {assignments.length === 0 ? (
          <p>No new assignments.</p>
        ) : (
          assignments.map((a) => (
            <div key={a._id} style={{ marginBottom: "10px" }}>
              <strong>
                {a.agent?.name || "Unknown Agent"} — {a.agent?.email || "No Email"} — {a.agent?.mobile || ""}
              </strong>
              <p>Items: {a.items?.length || 0}</p>
              <ul>
                {Array.isArray(a.items) &&
                  a.items.map((it) => (
                    <li key={it._id}>
                      {it.firstName || "No Name"} — {it.phone || "No Phone"} — {it.notes || "No Notes"}
                    </li>
                  ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
