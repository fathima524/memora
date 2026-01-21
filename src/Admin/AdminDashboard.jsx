import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import {
  Users,
  BookOpen,
  Activity,
  Database,
  Settings,
  BarChart3,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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
    const storedAdminName = "Administrator";
    setAdminName(storedAdminName);
    fetchUsersCount();
    fetchQuestionsCount();
    fetchSubjectsCount();
    fetchActivities();
    checkSystemStatus();

    const interval = setInterval(() => {
      checkSystemStatus();
      fetchActivities();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select(`
          action,
          details,
          subject,
          severity,
          created_at,
          user_id
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching activities:", error.message);
      } else {
        const formatted = data.map(act => ({
          ...act,
          time: new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: act.user_id ? act.user_id.substring(0, 8) + '...' : null
        }));
        setRecentActivities(formatted);
      }
    } catch (err) {
      console.error("Error in fetchActivities:", err);
    }
  };

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
        return '#22c55e';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#38bdf8';
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="auth-mesh"></div>

      <main className="admin-main">
        {/* Hero Section */}
        <section className="admin-hero">
          <div className="hero-mesh-overlay"></div>
          <div className="hero-left">
            <div className="admin-badge-top">
              <Shield size={16} />
              <span>SYSTEM ADMINISTRATOR</span>
            </div>
            <h1>Administrative <span className="text-gradient">Control Panel</span></h1>
            <p className="hero-p">MBBS Learning Management System</p>

            <div className="hero-stats-row">
              <div className="mini-stat-glass">
                <div className="stat-icon-wrap green">
                  {systemStatus === "Operational" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                </div>
                <div className="stat-info">
                  <span className="stat-value">{systemStatus}</span>
                  <span className="stat-label">System Status</span>
                </div>
              </div>
              <div className="mini-stat-glass">
                <div className="stat-icon-wrap blue">
                  <Activity size={18} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{uptime}</span>
                  <span className="stat-label">Uptime</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hologram-visual">
              <div className="radar-sweep"></div>
              <div className="hologram-rings">
                <div className="h-ring r-1"></div>
                <div className="h-ring r-2"></div>
                <div className="h-ring r-3"></div>
              </div>
              <div className="hologram-core">
                <Shield size={90} strokeWidth={1} className="shield-pulse-icon" />
                <div className="core-shine"></div>
              </div>
              <div className="data-tag tag-1">USERS // {totalUsers}</div>
              <div className="data-tag tag-2">DB // ACTIVE</div>
              <div className="data-tag tag-3">SECURE // ✓</div>
              <div className="data-tag tag-4">SYS // {systemStatus.toUpperCase()}</div>
            </div>
          </div>
        </section>

        <div className="admin-grid-system">
          {/* Statistics Cards */}
          <div className="stat-card-modern">
            <div className="stat-icon-circle blue">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalUsers.toLocaleString()}</div>
              <div className="stat-label">Registered Users</div>
              <div className="stat-detail">Active student accounts</div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-icon-circle purple">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalQuestions.toLocaleString()}</div>
              <div className="stat-label">Question Database</div>
              <div className="stat-detail">Total flashcards available</div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-icon-circle orange">
              <Database size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalSubjects}</div>
              <div className="stat-label">Total Subjects</div>
              <div className="stat-detail">Available study categories</div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-icon-circle green">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{uptime}</div>
              <div className="stat-label">System Status</div>
              <div className="stat-detail">{uptime === "Up" ? "All services running" : "Service disruption"}</div>
            </div>
          </div>

          {/* Management Panel */}
          <div className="management-panel">
            <div className="panel-header">
              <Activity size={20} className="text-blue" />
              <h2>Content & User Management</h2>
            </div>
            <div className="management-grid">
              <Link to="/admin/subjects" className="management-card">
                <div className="card-icon-hex">
                  <BookOpen size={24} />
                </div>
                <div className="card-info">
                  <h3>Subject Management</h3>
                  <p>Manage subjects and categories</p>
                </div>
                <div className="card-arrow">→</div>
              </Link>

              <Link to="/admin/users" className="management-card">
                <div className="card-icon-hex">
                  <Users size={24} />
                </div>
                <div className="card-info">
                  <h3>User Administration</h3>
                  <p>View and manage user accounts</p>
                </div>
                <div className="card-arrow">→</div>
              </Link>
            </div>
          </div>

          {/* Analytics Panel */}
          <div className="analytics-panel">
            <div className="panel-header">
              <BarChart3 size={20} className="text-blue" />
              <h2>Analytics & Reporting</h2>
            </div>
            <div className="management-grid">
              <Link to="/admin/activeusers" className="management-card">
                <div className="card-icon-hex">
                  <Zap size={24} />
                </div>
                <div className="card-info">
                  <h3>Active Users</h3>
                  <p>Monitor user activity</p>
                </div>
                <div className="card-arrow">→</div>
              </Link>


            </div>
          </div>

          {/* Activity Log */}
          <div className="activity-log-panel">
            <div className="panel-header">
              <Clock size={20} className="text-blue" />
              <h2>System Activity Log</h2>
            </div>
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item-modern">
                  <div className="activity-indicator" style={{ background: getSeverityColor(activity.severity) }}></div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                    <div className="activity-details">{activity.details}</div>
                    {(activity.user || activity.subject) && (
                      <div className="activity-meta">{activity.user || activity.subject}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="activity-footer">
              <Link to="/admin/logs" className="view-all-btn">
                View Complete Activity Log
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .admin-dashboard-page {
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

        .admin-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 2.5rem 6rem;
          position: relative;
          z-index: 1;
        }

        /* Hero Section */
        .admin-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3.5rem 4.5rem;
          margin-bottom: 3.5rem;
          color: white;
          position: relative;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(255, 255, 255, 0.25) 45%, rgba(56, 189, 248, 0.15) 100%);
          border-radius: 56px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(32px);
          box-shadow: 
            0 50px 140px -30px rgba(0, 0, 0, 0.6),
            inset 0 1px 4px rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }

        .hero-mesh-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.3;
          z-index: 0;
        }

        .hero-left { 
          position: relative; 
          z-index: 2; 
          flex: 1; 
        }

        .admin-badge-top {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(37, 99, 235, 0.2);
          border: 1px solid rgba(37, 99, 235, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 99px;
          color: #60a5fa;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
        }

        .admin-hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -3px;
          margin-bottom: 0.5rem;
          line-height: 1;
          color: white;
          text-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .hero-p {
          color: #94a3b8;
          font-size: 1.1rem;
          max-width: 500px;
          margin-bottom: 1.5rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .hero-stats-row {
          display: flex;
          gap: 1.5rem;
        }

        .mini-stat-glass {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(10, 15, 28, 0.4);
          padding: 0.75rem 1.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          transition: 0.3s;
        }

        .mini-stat-glass:hover {
          background: rgba(10, 15, 28, 0.6);
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-icon-wrap {
          width: 40px; 
          height: 40px;
          border-radius: 12px;
          display: flex; 
          align-items: center; 
          justify-content: center;
        }
        .stat-icon-wrap.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .stat-icon-wrap.blue { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }

        .stat-info { 
          display: flex; 
          flex-direction: column; 
        }
        .stat-value { 
          font-size: 1.1rem; 
          font-weight: 800; 
          color: white; 
          line-height: 1; 
        }
        .stat-label { 
          font-size: 0.7rem; 
          color: #64748b; 
          font-weight: 700; 
          text-transform: uppercase; 
          margin-top: 2px; 
        }

        /* Hero Right Visual */
        .hero-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          perspective: 1000px;
        }

        .hologram-visual {
          position: relative;
          width: 260px;
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotateX(10deg) rotateY(-10deg);
        }

        .radar-sweep {
          position: absolute;
          inset: 0;
          background: conic-gradient(from 0deg, rgba(56, 189, 248, 0.2) 0deg, transparent 90deg);
          border-radius: 50%;
          border: 1px solid rgba(56, 189, 248, 0.05);
          animation: sweep 4s linear infinite;
        }

        @keyframes sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .h-ring {
          position: absolute;
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 50%;
        }
        .r-1 { width: 120px; height: 120px; border-style: dashed; }
        .r-2 { width: 180px; height: 180px; border-width: 2px; opacity: 0.4; }
        .r-3 { width: 240px; height: 240px; border-style: dotted; opacity: 0.2; }

        .hologram-core {
          position: relative;
          z-index: 10;
          color: #38bdf8;
          filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.4));
        }

        .shield-pulse-icon {
          animation: shield-pulse 2s ease-in-out infinite;
        }

        @keyframes shield-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.6)); }
        }

        .core-shine {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 80%);
          filter: blur(35px);
          z-index: -1;
        }

        .data-tag {
          position: absolute;
          padding: 0.4rem 0.8rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.7rem;
          color: #38bdf8;
          backdrop-filter: blur(5px);
          white-space: nowrap;
          animation: float-tag 4s infinite ease-in-out;
        }

        .tag-1 { top: 10%; right: 10%; animation-delay: 0s; }
        .tag-2 { bottom: 20%; left: 0%; animation-delay: 1s; }
        .tag-3 { top: 30%; left: -10%; animation-delay: 2s; }
        .tag-4 { bottom: 5%; right: -5%; animation-delay: 3s; color: #22c55e; border-color: rgba(34, 197, 94, 0.3); }

        @keyframes float-tag {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }

        .text-gradient {
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .text-blue { color: #38bdf8; }

        /* Grid System */
        .admin-grid-system {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
        }

        /* Stat Cards */
        .stat-card-modern {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .stat-card-modern:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .stat-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-circle.blue { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
        .stat-icon-circle.purple { background: rgba(129, 140, 248, 0.1); color: #818cf8; }
        .stat-icon-circle.orange { background: rgba(251, 146, 60, 0.1); color: #fb923c; }
        .stat-icon-circle.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .stat-detail {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 400;
        }

        /* Management & Analytics Panels */
        .management-panel,
        .analytics-panel {
          grid-column: span 2;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.5rem;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .panel-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .management-grid {
          display: grid;
          gap: 1.5rem;
        }

        .management-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          text-decoration: none;
          color: white;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .management-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(8px);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .card-icon-hex {
          width: 48px;
          height: 48px;
          background: rgba(56, 189, 248, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          flex-shrink: 0;
        }

        .card-info {
          flex: 1;
        }

        .card-info h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: white;
        }

        .card-info p {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0;
        }

        .card-arrow {
          font-size: 1.5rem;
          color: #38bdf8;
          opacity: 0.5;
          transition: all 0.3s;
        }

        .management-card:hover .card-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        /* Activity Log */
        .activity-log-panel {
          grid-column: 1 / -1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.5rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .activity-item-modern {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.25rem;
          transition: all 0.3s;
        }

        .activity-item-modern:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .activity-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .activity-action {
          font-weight: 700;
          color: white;
          font-size: 0.95rem;
        }

        .activity-time {
          font-size: 0.8rem;
          color: #64748b;
          font-family: monospace;
          font-weight: 600;
        }

        .activity-details {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .activity-meta {
          font-size: 0.75rem;
          color: #64748b;
          font-family: monospace;
        }

        .activity-footer {
          display: flex;
          justify-content: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2rem;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          text-decoration: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .view-all-btn:hover {
          background: rgba(56, 189, 248, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .admin-hero {
            flex-direction: column;
            text-align: center;
            padding: 2.5rem;
          }
          
          .hero-left {
            align-items: center;
            display: flex;
            flex-direction: column;
          }

          .admin-grid-system {
            grid-template-columns: repeat(2, 1fr);
          }

          .management-panel,
          .analytics-panel,
          .activity-log-panel {
            grid-column: span 2;
          }
        }

        @media (max-width: 640px) {
          .admin-main {
            padding: 1.5rem;
          }

          .admin-hero {
            padding: 2rem 1.5rem;
            border-radius: 32px;
          }

          .admin-hero h1 {
            font-size: 2.5rem;
          }

          .hero-stats-row {
            flex-direction: column;
            width: 100%;
          }

          .admin-grid-system {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .stat-card-modern,
          .management-panel,
          .analytics-panel,
          .activity-log-panel {
            grid-column: span 1;
          }

          .hologram-visual {
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;