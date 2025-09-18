import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

function AdminDashboard() {
  const [adminName, setAdminName] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [uptime, setUptime] = useState("Checking...");
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [systemStatus, setSystemStatus] = useState("Operational");
  const [recentActivities, setRecentActivities] = useState([
    { 
      action: "User Registration", 
      details: "New user account created", 
      user: "john.doe@email.com", 
      time: "14:35", 
      severity: "info" 
    },
    { 
      action: "Content Management", 
      details: "Question bank updated", 
      subject: "Anatomy", 
      time: "13:28", 
      severity: "success" 
    },
    { 
      action: "Subscription Update", 
      details: "Premium subscription activated", 
      user: "jane.smith@email.com", 
      time: "12:15", 
      severity: "success" 
    },
    { 
      action: "System Maintenance", 
      details: "Database optimization completed", 
      subject: "System", 
      time: "11:45", 
      severity: "info" 
    }
  ]);

  useEffect(() => {
    const storedAdminName = "Administrator"; // Removed localStorage usage
    setAdminName(storedAdminName);
    fetchUsersCount();
    fetchQuestionsCount();
    fetchSubjectsCount();
    checkSystemStatus();
    
    const interval = setInterval(checkSystemStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsersCount = async () => {
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching users count:", error.message);
      } else {
        setTotalUsers(count || 0);
      }
    } catch (err) {
      console.error("Error fetching users count:", err);
    }
  };

  const fetchQuestionsCount = async () => {
    try {
      const { count, error } = await supabase
        .from("flashcards")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching questions count:", error.message);
      } else {
        setTotalQuestions(count || 0);
      }
    } catch (err) {
      console.error("Error fetching questions count:", err);
    }
  };

  const fetchSubjectsCount = async () => {
    try {
      const { count, error } = await supabase
        .from("subjects")
        .select("*", { count: "exact", head: true });

      console.log("Subjects count:", count, "Error:", error);

      if (error) {
        console.error("Error fetching subjects count:", error.message);
      } else {
        setTotalSubjects(count || 0);
      }
    } catch (err) {
      console.error("Error fetching subjects count:", err);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const { error } = await supabase
        .from("subjects")
        .select("id")
        .limit(1);

      if (error) {
        console.error("System down:", error.message);
        setUptime("Down");
        setSystemStatus("Service Disruption");
      } else {
        setUptime("Up");
        setSystemStatus("Operational");
      }
    } catch (err) {
      console.error("System error:", err.message);
      setUptime("Down");
      setSystemStatus("Service Disruption");
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': 
        return '#48bb78';
      case 'warning': 
        return '#ed8936';
      case 'error': 
        return '#f56565';
      default: 
        return '#4299e1';
    }
  };

  const handleNavHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.background = '#f7fafc';
      e.target.style.borderColor = '#cbd5e0';
      e.target.style.transform = 'translateY(-1px)';
      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
      e.target.style.background = 'white';
      e.target.style.borderColor = '#e2e8f0';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
  };

  const handleLogButtonHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.background = 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)';
      e.target.style.transform = 'translateY(-1px)';
      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
    } else {
      e.target.style.background = 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboardGrid}>
        {/* Header Card */}
        <div style={styles.headerCard}>
          <div>
            <h1 style={styles.title}>
              Administrative Control Panel
            </h1>
            <p style={styles.subtitle}>
              MBBS Learning Management System
            </p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.adminBadge}>
              SYSTEM ADMINISTRATOR
            </div>
            <div style={styles.systemStatus}>
              <div 
                style={{
                  ...styles.statusIndicator,
                  background: systemStatus === "Operational" ? '#48bb78' : '#f56565'
                }}
              ></div>
              System Status: {systemStatus}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {totalUsers.toLocaleString()}
          </div>
          <div style={styles.statLabel}>
            Registered Users
          </div>
          <div style={styles.statDetail}>
            Active student accounts
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {totalQuestions.toLocaleString()}
          </div>
          <div style={styles.statLabel}>
            Question Database
          </div>
          <div style={styles.statDetail}>
            Total flashcards available
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {totalSubjects}
          </div>
          <div style={styles.statLabel}>
            Total Subjects
          </div>
          <div style={styles.statDetail}>
            Available study categories
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {uptime}
          </div>
          <div style={styles.statLabel}>
            System Status
          </div>
          <div style={styles.statDetail}>
            {uptime === "Up" ? "All services running smoothly" : "Service disruption detected"}
          </div>
        </div>

        {/* Management Tools */}
        <div style={styles.managementCard}>
          <h3 style={styles.sectionTitle}>
            Content & User Management
          </h3>
          <div style={styles.navGrid}>
            <Link
              to="/admin/subjects"
              style={styles.navLink}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              <span style={styles.navIcon}>📚</span> 
              Subject Management
            </Link>
            <Link
              to="/admin/users"
              style={styles.navLink}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              <span style={styles.navIcon}>👥</span> 
              User Administration
            </Link>
          </div>
        </div>

        {/* Analytics & Reports */}
        <div style={styles.analyticsCard}>
          <h3 style={styles.sectionTitle}>
            Analytics & Reporting
          </h3>
          <div style={styles.navGrid}>
            
            <Link
              to="/admin/activeusers"
              style={styles.navLink}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              <span style={styles.navIcon}>📋</span> 
              Active Users
            </Link>
            
            <Link
              to="/admin/adminsettings"
              style={styles.navLink}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              <span style={styles.navIcon}>⚙️</span> 
                Admin Settings
            </Link>
          </div>
        </div>

        {/* System Activity Log */}
        <div style={styles.activityCard}>
          <h3 style={styles.sectionTitle}>
            System Activity Log
          </h3>
          {recentActivities.map((activity, index) => (
            <div key={index} style={styles.activityItem}>
              <div style={styles.activityContent}>
                <div style={styles.activityHeader}>
                  <div 
                    style={{
                      ...styles.activityIndicator,
                      background: getSeverityColor(activity.severity)
                    }}
                  ></div>
                  <span style={styles.activityAction}>
                    {activity.action}
                  </span>
                </div>
                <div style={styles.activityDetails}>
                  {activity.details}
                </div>
                <div style={styles.activityUser}>
                  {activity.user || activity.subject}
                </div>
              </div>
              <div style={styles.activityTime}>
                {activity.time}
              </div>
            </div>
          ))}

          <div style={styles.activityFooter}>
            <Link
              to="/admin/logs"
              style={styles.logButton}
              onMouseEnter={(e) => handleLogButtonHover(e, true)}
              onMouseLeave={(e) => handleLogButtonHover(e, false)}
            >
              View Complete Activity Log
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
// Consolidated CSS Styles - No Corner Padding, Fully Responsive
const styles = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: '0',
    margin: '0',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    boxSizing: 'border-box',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: window.innerWidth <= 480 ? '1rem' : window.innerWidth <= 768 ? '1.5rem' : '2rem',
    maxWidth: '1600px',
    margin: '0 auto',
    padding: window.innerWidth <= 480 ? '1rem' : window.innerWidth <= 768 ? '1.5rem' : '2rem',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },

  headerCard: {
    background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.97) 0%, rgba(45, 55, 72, 0.97) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: window.innerWidth <= 480 ? '8px' : '12px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '1.8rem' : '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    gridColumn: '1 / -1',
    minHeight: window.innerWidth <= 480 ? '120px' : '140px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
    gap: window.innerWidth <= 768 ? '1rem' : '0',
    textAlign: window.innerWidth <= 768 ? 'center' : 'left'
  },

  title: {
    fontSize: window.innerWidth <= 480 ? '1.8rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem',
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.1',
    letterSpacing: '-0.025em',
    marginBottom: '0.5rem'
  },

  subtitle: {
    fontSize: window.innerWidth <= 480 ? '0.9rem' : window.innerWidth <= 768 ? '1rem' : '1.1rem',
    fontWeight: '400',
    opacity: 0.85,
    lineHeight: '1.4'
  },

  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: window.innerWidth <= 768 ? 'center' : 'flex-end',
    gap: '0.75rem'
  },

  adminBadge: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    padding: window.innerWidth <= 480 ? '0.5rem 1rem' : '0.6rem 1.2rem',
    borderRadius: '8px',
    fontSize: window.innerWidth <= 480 ? '0.7rem' : '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    whiteSpace: 'nowrap'
  },

  systemStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
    color: 'white',
    opacity: 0.9,
    fontWeight: '500'
  },

  statusIndicator: {
    width: window.innerWidth <= 480 ? '8px' : '10px',
    height: window.innerWidth <= 480 ? '8px' : '10px',
    borderRadius: '50%',
    backgroundColor: '#48bb78',
    boxShadow: '0 0 8px rgba(72, 187, 120, 0.6)'
  },

  statCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: window.innerWidth <= 480 ? '8px' : '12px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '1.8rem' : '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(203, 213, 224, 0.3)',
    textAlign: 'center',
    gridColumn: window.innerWidth <= 768 ? '1' : 'span 3',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  },

  statNumber: {
    fontSize: window.innerWidth <= 480 ? '2rem' : window.innerWidth <= 768 ? '2.5rem' : '3rem',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '0.5rem',
    lineHeight: '1',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },

  statLabel: {
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
    color: '#4a5568',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem'
  },

  statDetail: {
    fontSize: window.innerWidth <= 480 ? '0.7rem' : '0.8rem',
    color: '#718096',
    fontWeight: '400',
    fontStyle: 'italic'
  },

  managementCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: window.innerWidth <= 480 ? '8px' : '12px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '1.8rem' : '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(203, 213, 224, 0.3)',
    gridColumn: window.innerWidth <= 768 ? '1' : 'span 6'
  },

  analyticsCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: window.innerWidth <= 480 ? '8px' : '12px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '1.8rem' : '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(203, 213, 224, 0.3)',
    gridColumn: window.innerWidth <= 768 ? '1' : 'span 6'
  },

  activityCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: window.innerWidth <= 480 ? '8px' : '12px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '1.8rem' : '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(203, 213, 224, 0.3)',
    gridColumn: '1 / -1'
  },

  sectionTitle: {
    fontSize: window.innerWidth <= 480 ? '1.1rem' : window.innerWidth <= 768 ? '1.2rem' : '1.4rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: window.innerWidth <= 480 ? '1rem' : '1.5rem',
    letterSpacing: '-0.025em',
    borderBottom: '3px solid #e2e8f0',
    paddingBottom: '0.75rem',
    position: 'relative'
  },

  navGrid: {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : 
                        window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 
                        'repeat(auto-fit, minmax(250px, 1fr))',
    gap: window.innerWidth <= 480 ? '0.8rem' : '1rem'
  },

  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: window.innerWidth <= 480 ? '1rem 1.2rem' : '1.25rem 1.5rem',
    background: 'white',
    color: '#2d3748',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.95rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e2e8f0',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  },

  navIcon: {
    fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
    minWidth: '20px'
  },

  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: window.innerWidth <= 480 ? '1rem' : '1.25rem',
    background: '#f8fafc',
    borderRadius: '8px',
    marginBottom: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
    gap: window.innerWidth <= 480 ? '0.8rem' : '0'
  },

  activityContent: {
    flex: 1,
    minWidth: 0
  },

  activityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
    flexWrap: 'wrap'
  },

  activityIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
    backgroundColor: '#48bb78'
  },

  activityAction: {
    fontWeight: '700',
    color: '#1a202c',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.95rem'
  },

  activityDetails: {
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.85rem',
    color: '#4a5568',
    marginBottom: '0.5rem',
    lineHeight: '1.4'
  },

  activityUser: {
    fontSize: window.innerWidth <= 480 ? '0.75rem' : '0.8rem',
    color: '#718096',
    fontFamily: 'monospace',
    fontWeight: '500'
  },

  activityTime: {
    fontSize: window.innerWidth <= 480 ? '0.75rem' : '0.8rem',
    color: '#718096',
    fontWeight: '600',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    marginLeft: window.innerWidth <= 480 ? '0' : '1rem',
    alignSelf: window.innerWidth <= 480 ? 'flex-start' : 'auto'
  },

  activityFooter: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: window.innerWidth <= 480 ? '1.5rem' : '2rem',
    paddingTop: '1.5rem',
    borderTop: '2px solid #e2e8f0'
  },

  logButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: window.innerWidth <= 480 ? '0.9rem 1.5rem' : '1rem 2rem',
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.95rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    minWidth: window.innerWidth <= 480 ? '200px' : '250px',
    cursor: 'pointer'
  },

  // Hover effects for interactive elements
  statCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
  },

  navLinkHover: {
    background: '#f7fafc',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)'
  },

  activityItemHover: {
    background: '#f1f5f9',
    transform: window.innerWidth > 480 ? 'translateX(4px)' : 'none'
  },

  logButtonHover: {
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
  }
};

export default AdminDashboard;