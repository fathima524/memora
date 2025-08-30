import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [adminName, setAdminName] = useState("");
  const [totalUsers, setTotalUsers] = useState(1247);
  const [totalQuestions, setTotalQuestions] = useState(3456);
  const [activeSubscriptions, setActiveSubscriptions] = useState(89);
  const [systemStatus, setSystemStatus] = useState("Operational");
  const [recentActivities, setRecentActivities] = useState([
    { action: "User Registration", details: "New user account created", user: "john.doe@email.com", time: "14:35", severity: "info" },
    { action: "Content Management", details: "Question bank updated", subject: "Anatomy", time: "13:28", severity: "success" },
    { action: "Subscription Update", details: "Premium subscription activated", user: "jane.smith@email.com", time: "12:15", severity: "success" },
    { action: "System Maintenance", details: "Database optimization completed", subject: "System", time: "11:45", severity: "info" }
  ]);

  useEffect(() => {
    const storedAdminName = localStorage.getItem("adminName") || "Administrator";
    setAdminName(storedAdminName);
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: window.innerWidth <= 768 ? '1rem' : '2rem',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
    boxSizing: 'border-box'
  };

  const dashboardGridStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(12, 1fr)',
    gap: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '1rem 0'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    padding: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)',
    transition: 'all 0.2s ease',
    position: 'relative'
  };

  const headerCardStyle = {
    ...cardStyle,
    gridColumn: window.innerWidth <= 768 ? '1' : '1 / -1',
    background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.97) 0%, rgba(45, 55, 72, 0.97) 100%)',
    color: 'white',
    minHeight: '120px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
    textAlign: window.innerWidth <= 768 ? 'center' : 'left'
  };

  const titleStyle = {
    fontSize: window.innerWidth <= 768 ? '1.75rem' : '2.25rem',
    fontWeight: '600',
    color: 'white',
    lineHeight: '1.2',
    letterSpacing: '-0.025em'
  };

  const subtitleStyle = {
    fontSize: window.innerWidth <= 768 ? '0.875rem' : '1rem',
    fontWeight: '400',
    opacity: 0.8,
    marginTop: '0.5rem',
    lineHeight: '1.4'
  };

  const sectionTitleStyle = {
    fontSize: window.innerWidth <= 768 ? '1.125rem' : '1.25rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '1.5rem',
    letterSpacing: '-0.025em',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.5rem'
  };

  const navGridStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(2, 1fr)',
    gap: '1rem'
  };

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    background: 'white',
    color: '#2d3748',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.925rem',
    fontWeight: '500',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  };

  const statCardStyle = {
    ...cardStyle,
    textAlign: 'center',
    gridColumn: window.innerWidth <= 768 ? '1' : 'span 3'
  };

  const statNumberStyle = {
    fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '0.5rem',
    lineHeight: '1'
  };

  const statLabelStyle = {
    fontSize: '0.875rem',
    color: '#4a5568',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const activityItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1rem',
    background: '#f7fafc',
    borderRadius: '6px',
    marginBottom: '0.75rem',
    border: '1px solid #e2e8f0'
  };

  const adminBadgeStyle = {
    background: 'linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  };

  const systemStatusStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: 'white',
    opacity: 0.9
  };

  const statusIndicatorStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#48bb78'
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return '#48bb78';
      case 'warning': return '#ed8936';
      case 'error': return '#f56565';
      default: return '#4299e1';
    }
  };

  return (
    <div style={containerStyle}>
      <div style={dashboardGridStyle}>
        {/* Header Card */}
        <div style={headerCardStyle}>
          <div>
            <h1 style={titleStyle}>
              Administrative Control Panel
            </h1>
            <p style={subtitleStyle}>
              Welcome, {adminName} | MBBS Learning Management System
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div style={adminBadgeStyle}>
              SYSTEM ADMINISTRATOR
            </div>
            <div style={systemStatusStyle}>
              <div style={statusIndicatorStyle}></div>
              System Status: {systemStatus}
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{totalUsers.toLocaleString()}</div>
          <div style={statLabelStyle}>Registered Users</div>
          <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
            +23 new registrations this week
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={statNumberStyle}>{totalQuestions.toLocaleString()}</div>
          <div style={statLabelStyle}>Question Database</div>
          <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
            +15 questions added this week
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={statNumberStyle}>{activeSubscriptions}</div>
          <div style={statLabelStyle}>Active Subscriptions</div>
          <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
            +5 new subscriptions this week
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={statNumberStyle}>99.8%</div>
          <div style={statLabelStyle}>System Uptime</div>
          <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
            Last 30 days performance
          </div>
        </div>

        {/* Management Tools */}
        <div style={{...cardStyle, gridColumn: window.innerWidth <= 768 ? '1' : 'span 6'}}>
          <h3 style={sectionTitleStyle}>
            Content & User Management
          </h3>
          <div style={navGridStyle}>
            <Link 
              to="/admin/subjects" 
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.borderColor = '#cbd5e0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{fontSize: '1rem'}}>📚</span> Subject Management
            </Link>
            <Link 
              to="/admin/users" 
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.borderColor = '#cbd5e0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{fontSize: '1rem'}}>👥</span> User Administration
            </Link>
            
          </div>
        </div>

        {/* Analytics & Reports */}
        <div style={{...cardStyle, gridColumn: window.innerWidth <= 768 ? '1' : 'span 6'}}>
          <h3 style={sectionTitleStyle}>
            Analytics & Reporting
          </h3>
          <div style={navGridStyle}>
            <Link 
              to="/admin/analytics" 
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.borderColor = '#cbd5e0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{fontSize: '1rem'}}>📊</span> Performance Analytics
            </Link>
            <Link 
              to="/admin/reports" 
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.borderColor = '#cbd5e0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{fontSize: '1rem'}}>📋</span> System Reports
            </Link>
            <Link 
              to="/admin/audit" 
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.borderColor = '#cbd5e0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{fontSize: '1rem'}}>🔍</span> Audit Logs
            </Link>
            <Link 
              to="/admin/settings" 
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.borderColor = '#cbd5e0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{fontSize: '1rem'}}>⚙️</span> System Configuration
            </Link>
          </div>
        </div>

        {/* System Activity Log */}
        <div style={{...cardStyle, gridColumn: window.innerWidth <= 768 ? '1' : '1 / -1'}}>
          <h3 style={sectionTitleStyle}>
            System Activity Log
          </h3>
          {recentActivities.map((activity, index) => (
            <div key={index} style={activityItemStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: getSeverityColor(activity.severity)
                  }}></div>
                  <span style={{ fontWeight: '600', color: '#1a202c', fontSize: '0.9rem' }}>
                    {activity.action}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.25rem' }}>
                  {activity.details}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                  {activity.user || activity.subject}
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: '500', fontFamily: 'monospace' }}>
                {activity.time}
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <Link 
              to="/admin/logs" 
              style={{
                ...navLinkStyle,
                flex: '1',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              View Complete Activity Log
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
