import React, {useState} from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL||'http://localhost:5000';
export default function Agents({agents}){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [mobile,setMobile]=useState(''); const [password,setPassword]=useState('');
  const token = localStorage.getItem('token');
  const add = async (e)=>{
    e.preventDefault();
    await axios.post(API+'/api/agents',{name,email,mobile,password},{headers:{Authorization:'Bearer '+token}});
    window.location.reload();
  }
  return (<div className="card">
    <h3>Add Agent</h3>
    <form onSubmit={add}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Mobile with country code" value={mobile} onChange={e=>setMobile(e.target.value)}/>
      <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button type="submit">Create Agent</button>
    </form>
    <h4>Agents</h4>
    <ul>
      {agents.map(a=> <li key={a._id}>{a.name} — {a.email} — {a.mobile}</li>)}
    </ul>
  </div>);
}
