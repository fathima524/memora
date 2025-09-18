import React, { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return width;
}

const ActiveUsers = () => {
  const width = useWindowWidth();
  const [users] = useState([
    { id: 1, name: 'John Doe', status: 'online', lastSeen: 'Now' },
    { id: 2, name: 'Jane Smith', status: 'online', lastSeen: '2 min ago' },
    { id: 3, name: 'Ali Khan', status: 'offline', lastSeen: '1 hour ago' },
    { id: 4, name: 'Sarah Wilson', status: 'online', lastSeen: 'Now' },
    { id: 5, name: 'Mike Chen', status: 'offline', lastSeen: '3 hours ago' }
  ]);

  const onlineUsers = users.filter(user => user.status === 'online');

  const styles = {
    container: {
      maxWidth: '896px',
      margin: '0 auto',
      padding: '16px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(90deg, #f9fafb 0%, white 100%)',
      borderBottom: '1px solid #e5e7eb',
      padding: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: '#6b7280',
      margin: '0 0 16px 0',
      fontSize: '14px'
    },
    statsContainer: {
      display: 'flex',
      gap: '12px'
    },
    totalBadge: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '500'
    },
    onlineBadge: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '500'
    },
    userList: {
      padding: '24px'
    },
    userListContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    userItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: '1px solid #f3f4f6'
    },
    userItemHover: {
      backgroundColor: '#f3f4f6',
      borderColor: '#e5e7eb'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    userName: {
      fontWeight: '600',
      color: '#111827',
      fontSize: '18px',
      margin: 0
    },
    lastSeen: {
      color: '#6b7280',
      fontSize: '14px',
      margin: 0
    },
    statusContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    statusDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%'
    },
    onlineDot: {
      backgroundColor: '#10b981'
    },
    offlineDot: {
      backgroundColor: '#ef4444'
    },
    onlineStatus: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '500'
    },
    offlineStatus: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '500'
    },
    footer: {
      padding: '24px',
      backgroundColor: '#f9fafb',
      borderTop: '1px solid #e5e7eb'
    },
    backButton: {
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    backButtonHover: {
      backgroundColor: '#111827',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    emptyState: {
      textAlign: 'center',
      padding: '32px 16px',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Active Users</h2>
          <p style={styles.subtitle}>Currently active members</p>
          
          <div style={styles.statsContainer}>
            <span style={styles.totalBadge}>
              Total: {users.length}
            </span>
            <span style={styles.onlineBadge}>
              Online: {onlineUsers.length}
            </span>
          </div>
        </div>

        {/* User List */}
        <div style={styles.userList}>
          {users.length > 0 ? (
            <div style={styles.userListContainer}>
              {users.map((user) => (
                <div 
                  key={user.id}
                  style={styles.userItem}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, styles.userItemHover);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = styles.userItem.backgroundColor;
                    e.target.style.borderColor = styles.userItem.border.split(' ')[2];
                  }}
                >
                  <div style={styles.userInfo}>
                    {/* User Info */}
                    <div style={styles.userDetails}>
                      <h3 style={styles.userName}>{user.name}</h3>
                      <p style={styles.lastSeen}>Last seen: {user.lastSeen}</p>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div style={styles.statusContainer}>
                    <div 
                      style={{
                        ...styles.statusDot,
                        ...(user.status === 'online' ? styles.onlineDot : styles.offlineDot)
                      }}
                    />
                    <span 
                      style={user.status === 'online' ? styles.onlineStatus : styles.offlineStatus}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              No users available
            </div>
          )}
        </div>

        {/* Back Button */}
        <div style={styles.footer}>
          <a 
            href="/admin"
            style={styles.backButton}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, styles.backButtonHover);
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.backButton.backgroundColor;
              e.target.style.boxShadow = styles.backButton.boxShadow;
            }}
          >
            ← Back to Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;