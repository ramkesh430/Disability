import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./UsersPage.css";

function UsersPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role: "operator"
  });

  const load = () => api.get("/api/users/").then((res) => setRows(res.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/users/", form);
    setForm({ full_name: "", username: "", email: "", password: "", role: "operator" });
    load();
  };

  return (
    <Layout>
      <div className="users-grid">
        <div className="page-card">
          <h2>Create User</h2>
          <form className="user-form" onSubmit={submit}>
            <input className="form-control" placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <input className="form-control" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input className="form-control" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="form-control" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select className="form-control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="operator">Operator</option>
              <option value="ward_user">Ward User</option>
              <option value="committee_user">Committee User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <button className="primary-btn" type="submit">Save User</button>
          </form>
        </div>

        <div className="page-card">
          <h2>User List</h2>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.full_name}</td>
                  <td>{row.username}</td>
                  <td>{row.email}</td>
                  <td>{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default UsersPage;
