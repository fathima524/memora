import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

const ActiveUsers = () => {
  const width = useWindowWidth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, last_seen")
        .gte("last_seen", cutoff);

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const isActive = (lastSeen) => {
    const cutoff = Date.now() - 5 * 60 * 1000; // last 5 minutes = online
    return new Date(lastSeen).getTime() > cutoff;
  };

  const onlineUsers = users.filter((u) => isActive(u.last_seen));


  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#060912', // Dark background
      color: 'white',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    },
    authMesh: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: `
        radial-gradient(circle at 10% 10%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
        radial-gradient(circle at 90% 90%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.02) 0%, transparent 60%)
      `,
      zIndex: 0,
      pointerEvents: 'none'
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '896px',
      margin: '0 auto'
    },
    card: {
      // Beige glass effect
      background: 'linear-gradient(145deg, rgba(245, 235, 215, 0.18) 0%, rgba(245, 235, 215, 0.08) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(245, 235, 215, 0.25)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderBottom: '1px solid rgba(245, 235, 215, 0.15)',
      padding: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#fdfaf6', // Off-white text
      margin: '0 0 8px 0',
      letterSpacing: '-1px'
    },
    subtitle: {
      color: '#94a3b8',
      margin: '0 0 24px 0',
      fontSize: '16px'
    },
    statsContainer: {
      display: 'flex',
      gap: '12px'
    },
    totalBadge: {
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      color: '#38bdf8',
      border: '1px solid rgba(56, 189, 248, 0.2)',
      padding: '6px 16px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '600'
    },
    onlineBadge: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      color: '#4ade80',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      padding: '6px 16px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '600'
    },
    userList: {
      padding: '32px'
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
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '16px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    userName: {
      fontWeight: '600',
      color: 'white',
      fontSize: '18px',
      margin: 0
    },
    lastSeen: {
      color: '#94a3b8',
      fontSize: '14px',
      margin: 0
    },
    statusContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      boxShadow: '0 0 10px currentColor'
    },
    onlineDot: {
      backgroundColor: '#4ade80',
      color: '#4ade80'
    },
    offlineDot: {
      backgroundColor: '#f87171',
      color: '#f87171'
    },
    onlineStatus: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      color: '#4ade80',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      border: '1px solid rgba(34, 197, 94, 0.2)'
    },
    offlineStatus: {
      backgroundColor: 'rgba(248, 113, 113, 0.1)',
      color: '#f87171',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      border: '1px solid rgba(248, 113, 113, 0.2)'
    },
    footer: {
      padding: '24px 32px',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderTop: '1px solid rgba(245, 235, 215, 0.15)',
      display: 'flex',
      justifyContent: 'center'
    },
    backButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#94a3b8',
      padding: '12px 24px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '600',
      textDecoration: 'none',
      fontSize: '0.9rem',
      cursor: 'pointer'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 16px',
      color: '#94a3b8',
      fontStyle: 'italic'
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Mesh */}
      <div style={styles.authMesh}></div>

      <div style={styles.contentWrapper}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Active Users</h2>
            <p style={styles.subtitle}>Currently active members in the system</p>

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
                {users.map((user) => {
                  const status = isActive(user.last_seen) ? "online" : "offline";

                  return (
                    <div
                      key={user.id}
                      style={styles.userItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = styles.userItem.backgroundColor;
                        e.currentTarget.style.borderColor = styles.userItem.border.split(' ')[2];
                      }}
                    >
                      <div style={styles.userInfo}>
                        <div style={styles.userDetails}>
                          <h3 style={styles.userName}>{user.full_name || 'Unknown User'}</h3>
                          <p style={styles.lastSeen}>Last seen: {new Date(user.last_seen).toLocaleString()}</p>
                        </div>
                      </div>

                      <div style={styles.statusContainer}>
                        <div
                          style={{
                            ...styles.statusDot,
                            ...(status === "online" ? styles.onlineDot : styles.offlineDot)
                          }}
                        />
                        <span
                          style={status === "online" ? styles.onlineStatus : styles.offlineStatus}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}

              </div>
            ) : (
              <div style={styles.emptyState}>
                No active users found in the last 6 hours.
              </div>
            )}
          </div>

          {/* Back Button */}
          <div style={styles.footer}>
            <a
              href="/admin"
              style={styles.backButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateX(-4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.backButton.backgroundColor;
                e.target.style.color = styles.backButton.color;
                e.target.style.transform = 'none';
              }}
            >
              ← Back to Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;