import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  Loader,
  ArrowLeft,
  Shield,
  Mail,
  Calendar
} from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="auth-mesh"></div>
        <div className="full-screen-loader">
          <div className="loader-content">
            <Loader size={48} className="spinner" />
            <h2 className="brand-name">Memora</h2>
          </div>
        </div>
        <style>{`
        .full-screen-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          color: #38bdf8;
          animation: spin 1s linear infinite;
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .loader-content p {
          font-size: 1rem;
          color: #94a3b8;
          margin: 0;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="auth-mesh"></div>

      <main className="users-main">
        {/* Header Section */}
        <section className="page-header">
          <div className="header-content">
            <div className="header-left">
              <Link to="/admin" className="back-link">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
              <div className="title-row">
                <div className="icon-badge">
                  <Users size={24} />
                </div>
                <div>
                  <h1>User Management</h1>
                  <p className="header-subtitle">View and manage registered users</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{users.length}</span>
            </div>
          </div>
        </section>

        {/* Users Table Card */}
        <div className="content-card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <div className="th-content">
                      <Mail size={14} /> Email
                    </div>
                  </th>
                  <th>Name</th>
                  <th>
                    <div className="th-content">
                      <Shield size={14} /> Role
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Calendar size={14} /> Joined
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="id-cell">{user.id.substring(0, 8)}...</td>
                    <td className="email-cell">
                      {user.email || <span className="text-muted">No Email</span>}
                    </td>
                    <td className="name-cell">{user.full_name || 'N/A'}</td>
                    <td>
                      <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .users-page {
          min-height: 100vh;
          background: #060912;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .auth-mesh {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 10% 10%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.02) 0%, transparent 60%);
          z-index: 0;
          pointer-events: none;
        }

        .users-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 6rem;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .page-header {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(255, 255, 255, 0.1) 100%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          transition: 0.2s;
        }

        .back-link:hover {
          color: #38bdf8;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-badge {
          width: 56px;
          height: 56px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: white;
        }

        .header-subtitle {
          color: #94a3b8;
          margin: 0;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          border-radius: 16px;
          text-align: right;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #38bdf8;
        }

        /* Content Card */
        .content-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th {
          padding: 1.25rem 1.5rem;
          background: #f1f5f9;
          color: #475569;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 0.95rem;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover td {
          background: #f8fafc;
        }

        .id-cell {
          font-family: monospace;
          color: #64748b;
        }

        .email-cell {
          font-weight: 500;
        }

        .text-muted {
          color: #94a3b8;
          font-style: italic;
          font-weight: 400;
        }

        .name-cell {
          font-weight: 600;
        }

        .role-badge {
          display: inline-flex;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .role-badge.admin {
          background: #e0e7ff;
          color: #4338ca;
        }

        .role-badge.user {
          background: #dbeafe;
          color: #1e40af;
        }

        .date-cell {
          color: #64748b;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          
          .stat-card {
            width: 100%;
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
}
