import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

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

  return (
    <div style={styles.container}>

      {/* Header Card */}
      <div style={styles.headerCard}>
        <h2 style={styles.heading}>User Management</h2>
        <p style={styles.subtitle}>
          Manage all registered users in the system
        </p>
        <div style={styles.statsContainer}>
          <div style={styles.statBadge}>
            Total Users: {users.length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading users...</p>
        </div>
      ) : (
        <div style={styles.tableCard}>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Role</th>
                  <th style={styles.tableHeader}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user.id} 
                    style={{
                      ...styles.tableRow,
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e2e8f0';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = index % 2 === 0 ? '#f8fafc' : 'white';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <td style={styles.tableCell}>{user.id}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.emailText}>{user.email}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.nameText}>{user.full_name || 'N/A'}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: user.role === 'admin' ? '#2d3748' : '#4299e1',
                        color: 'white'
                      }}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.dateText}>
                        {new Date(user.created_at).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Back Button at Bottom */}
      {/* Back Button at Bottom Left */}
<button 
  style={styles.backButtonBottomLeft} 
  onClick={() => navigate(-1)}
>
  ← Back
</button>

    </div>
  );
}

// Styles (unchanged, only backButton style used)
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: window.innerWidth <= 768 ? '1rem' : '2rem',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
    boxSizing: 'border-box'
  },

  headerCard: {
    background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.97) 0%, rgba(45, 55, 72, 0.97) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    padding: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.3)',
    marginBottom: '2rem',
    color: 'white'
  },

  heading: {
    fontSize: window.innerWidth <= 768 ? '1.75rem' : '2.25rem',
    fontWeight: '600',
    color: 'white',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
    margin: '0 0 0.5rem 0'
  },

  subtitle: {
    fontSize: window.innerWidth <= 768 ? '0.875rem' : '1rem',
    fontWeight: '400',
    opacity: 0.8,
    marginBottom: '1.5rem',
    lineHeight: '1.4'
  },

  statsContainer: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },

  statBadge: {
    background: 'linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },

  loadingCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    padding: '3rem 2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },

  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #2d3748',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  loadingText: {
    fontSize: '1rem',
    color: '#4a5568',
    fontWeight: '500',
    margin: 0
  },

  tableCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)',
    overflow: 'hidden'
  },

  tableContainer: {
    overflowX: 'auto'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem'
  },

  tableHeaderRow: {
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
  },

  tableHeader: {
    padding: '1rem 1.25rem',
    textAlign: 'left',
    fontWeight: '600',
    color: 'white',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '2px solid #1a202c'
  },

  tableRow: {
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },

  tableCell: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #e2e8f0',
    verticalAlign: 'middle'
  },

  emailText: {
    color: '#2d3748',
    fontWeight: '500'
  },

  nameText: {
    color: '#1a202c',
    fontWeight: '600'
  },

  roleBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },

  dateText: {
    color: '#718096',
    fontSize: '0.8125rem',
    fontFamily: 'monospace'
  },

backButtonBottomLeft: {
  position: 'fixed',
  bottom: '20px',
  left: '20px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '6px',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  border: 'none',
  cursor: 'pointer',
  zIndex: 1000
}

};
