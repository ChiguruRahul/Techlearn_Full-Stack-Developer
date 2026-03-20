import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../api/client";

export default function TopicsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [resolvedCourseId, setResolvedCourseId] = useState(null);
  const [courseTitle, setCourseTitle] = useState("Loading...");
  const [topics, setTopics] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ hover effects
  const [hoverTopicId, setHoverTopicId] = useState(null);

  const topicFromQuery = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("topic");
  }, [location.search]);

  // Resolve courseId (demo -> fetch first course)
  useEffect(() => {
    async function loadCourseId() {
      if (courseId !== "demo") {
        setResolvedCourseId(courseId);
        return;
      }

      const res = await api.get("/api/courses");
      const first = res.data?.courses?.[0];
      if (!first) throw new Error("No courses found");

      setResolvedCourseId(first.id);
      setCourseTitle(first.title);

      navigate(`/learn/courses/${first.id}/topics`, { replace: true });
    }

    loadCourseId().catch((e) => {
      console.error(e);
      setLoading(false);
    });
  }, [courseId, navigate]);

  // Load topics list
  useEffect(() => {
    if (!resolvedCourseId) return;

    async function loadTopics() {
      setLoading(true);

      const coursesRes = await api.get("/api/courses");
      const course = coursesRes.data?.courses?.find((c) => c.id === resolvedCourseId);
      if (course) setCourseTitle(course.title);

      const res = await api.get(`/api/courses/${resolvedCourseId}/topics`);
      const t = res.data?.topics || [];
      setTopics(t);

      const initialTopicId = topicFromQuery || t[0]?.id || null;
      setActiveTopicId(initialTopicId);

      setLoading(false);
    }

    loadTopics().catch((e) => {
      console.error(e);
      setLoading(false);
    });
  }, [resolvedCourseId, topicFromQuery]);

  // Load active topic note
  useEffect(() => {
    if (!activeTopicId) return;

    async function loadTopic() {
      const res = await api.get(`/api/topics/${activeTopicId}`);
      setActiveTopic(res.data.topic);
    }

    loadTopic().catch(console.error);
  }, [activeTopicId]);

  const activeIndex = useMemo(() => {
    return topics.findIndex((t) => t.id === activeTopicId);
  }, [topics, activeTopicId]);

  const canPrev = activeIndex > 0;
  const canNext = activeIndex >= 0 && activeIndex < topics.length - 1;

  function goPrev() {
    if (!canPrev) return;
    const prev = topics[activeIndex - 1];
    setActiveTopicId(prev.id);
    // only scroll content box
    const el = document.getElementById("topicScrollArea");
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    if (!canNext) return;
    const next = topics[activeIndex + 1];
    setActiveTopicId(next.id);
    const el = document.getElementById("topicScrollArea");
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectTopic(id) {
    setActiveTopicId(id);
    const el = document.getElementById("topicScrollArea");
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  }

  const SIDEBAR_OPEN = 340;
  const SIDEBAR_CLOSED = 78;
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_CLOSED : SIDEBAR_OPEN;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoContainer}>
            <div style={styles.logoCircle}>tls</div>
          </div>
          <div style={styles.xpPill}>
            <span style={{opacity: 0.7}}>🏆</span> 0 XP <span style={{opacity: 0.6}}>Beginner</span> ⌄
          </div>
        </div>
        <div style={styles.headerRight}>
          <a href="#" style={{...styles.navLink, ...styles.navLinkActive}}>Learn</a>
          <a href="#" style={styles.navLink}>Build</a>
          <a href="#" style={styles.navLink}>Dashboard</a>
          <a href="#" style={styles.navLink}>Hi, Chiguru</a>
          <button style={styles.darkModeToggle}>☾</button>
        </div>
      </header>

      {/* body container matching reference with horizontal margin */}
      <div style={styles.body}>
        <div
          style={{
            ...styles.layout,
            gridTemplateColumns: `${sidebarWidth}px 1fr`,
          }}
        >
          {/* Sidebar */}
          <aside
            style={{
              ...styles.sidebar,
              width: sidebarWidth,
            }}
          >
            <div style={styles.sidebarHeaderRow}>
              {!sidebarCollapsed && <div style={styles.sidebarTitle}>Course Topics</div>}

              {/* collapse button (chevron matching reference) */}
              <button
                type="button"
                aria-label="Collapse sidebar"
                onClick={() => setSidebarCollapsed((v) => !v)}
                style={styles.collapseBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#1e3a8a" /* Dark blue stroke for contrast */
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 260ms ease",
                  }}
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            </div>

            {/* sidebar list */}
            <div style={styles.sidebarList}>
              {topics.map((t) => {
                const active = t.id === activeTopicId;

                if (sidebarCollapsed) {
                  return (
                    <button
                      key={t.id}
                      onClick={() => selectTopic(t.id)}
                      title={`${t.order}. ${t.title}`}
                      onMouseEnter={() => setHoverTopicId(t.id)}
                      onMouseLeave={() => setHoverTopicId(null)}
                      style={{
                        ...styles.topicMiniBtn,
                        ...(active ? styles.topicMiniBtnActive : {}),
                        ...(hoverTopicId === t.id ? styles.topicMiniBtnHover : {}),
                      }}
                    >
                      {t.order}
                    </button>
                  );
                }

                return (
                  <button
                    key={t.id}
                    onClick={() => selectTopic(t.id)}
                    onMouseEnter={() => setHoverTopicId(t.id)}
                    onMouseLeave={() => setHoverTopicId(null)}
                    style={{
                      ...styles.topicBtn,
                      ...(active ? styles.topicBtnActive : {}),
                      ...(hoverTopicId === t.id ? styles.topicBtnHover : {}),
                    }}
                  >
                    <span style={styles.topicOrderPlain}>{t.order}</span>
                    <span style={styles.topicTitleText}>{t.title}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Area */}
          <main style={styles.main}>
            {loading && <div style={{padding: 40}}>Loading...</div>}

            {!loading && activeTopic && (
              <div id="topicScrollArea" style={styles.noteScroll}>
                <div style={styles.topicHeader}>
                  <h2 style={styles.h2}>{activeTopic.title}</h2>
                  
                  <div style={styles.navBtns}>
                    <button onClick={goPrev} disabled={!canPrev} style={styles.navBtn}>
                      ←
                    </button>
                    <button onClick={goNext} disabled={!canNext} style={styles.navBtn}>
                      →
                    </button>
                  </div>
                </div>

                <div style={styles.markdownContent}>
                  <ReactMarkdown
                    components={{
                      h1: (props) => <h1 style={styles.noteH1} {...props} />,
                      h2: (props) => <h2 style={styles.noteH2} {...props} />,
                      h3: (props) => <h3 style={styles.noteH3} {...props} />,
                      p: (props) => <p style={styles.noteP} {...props} />,
                      li: (props) => <li style={styles.noteLi} {...props} />,
                      pre: (props) => <pre style={styles.pre} {...props} />,
                      code: ({ inline, ...props }) =>
                        inline ? (
                          <code style={styles.inlineCode} {...props} />
                        ) : (
                          <code style={styles.codeBlock} {...props} />
                        ),
                    }}
                  >
                    {activeTopic.note?.content || "No notes found."}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: '"Inter", "-apple-system", sans-serif',
    color: "#111",
    height: "100vh",
    overflow: "hidden",
    background: "#e0f2fe", // Very light blue from reference
  },

  header: {
    background: "transparent",
    padding: "16px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: "0 0 auto",
  },
  
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  
  logoCircle: {
    width: 44,
    height: 44,
    background: "none",
    border: "2px dashed #0b1b4a",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    color: "#0b1b4a",
    fontSize: 16,
    letterSpacing: "1px",
  },

  xpPill: {
    background: "#f3e8ff", // Light purple
    color: "#9333ea",
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  
  navLink: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    borderBottom: "2px solid transparent",
    paddingBottom: 4,
  },
  
  navLinkActive: {
    borderBottomColor: "#0f172a",
  },
  
  darkModeToggle: {
    background: "#0f172a",
    color: "white",
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 16,
    marginLeft: 10,
  },

  body: {
    height: "calc(100vh - 80px)", // Header height approx
    overflow: "hidden",
  },

  layout: {
    display: "grid",
    gap: 32,
    padding: "0px 40px 32px 40px",
    alignItems: "stretch",
    width: "100%",
    height: "100%",
    transition: "grid-template-columns 400ms ease",
  },

  sidebar: {
    paddingTop: 8,
    height: "100%",
    transition: "width 400ms ease",
  },

  sidebarHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingLeft: 2,
    marginBottom: 20,
  },

  sidebarTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e3a8a",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },

  collapseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    padding: 0,
    color: "#1e3a8a",
  },

  sidebarList: {
    height: "calc(100% - 60px)",
    overflowY: "auto",
    paddingRight: 6,
  },

  topicBtn: {
    width: "100%",
    textAlign: "left",
    padding: "16px",
    borderRadius: 12,
    border: "1px solid transparent",
    background: "rgba(255,255,255,0.6)", // Mostly white
    cursor: "pointer",
    marginBottom: 10,
    color: "#1e3a8a", // Blue text for all
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    gap: 12,
    transition: "all 200ms ease",
  },
  topicBtnActive: {
    background: "#bae6fd", // Deep sky blue matching reference active state
    border: "1px solid #7dd3fc", // Stronger blue border
    boxShadow: "0 4px 12px rgba(186, 230, 253, 0.4)",
  },
  topicBtnHover: {
    transform: "translateX(2px)",
    background: "rgba(255,255,255,0.9)",
  },

  topicOrderPlain: {
    minWidth: 20,
    fontWeight: 700,
    color: "#0f172a",
    fontSize: 13,
  },
  topicTitleText: {
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  topicMiniBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    border: "1px solid transparent",
    background: "rgba(255,255,255,0.6)",
    cursor: "pointer",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    display: "grid",
    placeItems: "center",
    transition: "all 200ms ease",
  },
  topicMiniBtnActive: {
    background: "#bae6fd",
    border: "1px solid #7dd3fc",
  },
  topicMiniBtnHover: {
    transform: "translateX(2px)",
    background: "rgba(255,255,255,0.9)",
  },

  main: {
    background: "#ffffff", // Pure white for the content card
    borderRadius: 20,
    padding: 0,
    height: "100%",
    width: "100%",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)", // Very soft shadow
    overflow: "hidden",
  },

  noteScroll: {
    padding: "50px 60px",
    height: "100%",
    overflowY: "auto",
  },

  topicHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },

  h2: {
    margin: 0,
    fontSize: 64, // Very large blue text from reference
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    fontWeight: 800,
    color: "#1d4ed8", // Bright strong blue (#1d4ed8)
  },

  navBtns: {
    display: "flex",
    gap: 8,
  },

  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },

  markdownContent: {
    color: "#475569", // Dark slate grey for content
    fontSize: 17,
    lineHeight: 1.8,
  },

  noteH1: { margin: "32px 0 16px", fontSize: 32, color: "#1e3a8a" },
  noteH2: { margin: "28px 0 14px", fontSize: 24, color: "#3b82f6", fontWeight: 700 }, // Light blue subheads
  noteH3: { margin: "24px 0 12px", fontSize: 20, color: "#3b82f6", fontWeight: 600 },
  noteP: { margin: "16px 0" },
  noteLi: { margin: "10px 0" },

  pre: {
    margin: "20px 0",
    padding: "20px",
    overflowX: "auto",
    borderRadius: 12,
    background: "#0f172a", // Dark background for code
  },
  codeBlock: {
    display: "block",
    color: "#f8fafc",
    fontFamily: '"Fira Code", "Menlo", monospace',
    fontSize: 15,
    lineHeight: 1.6,
  },
  inlineCode: {
    fontFamily: '"Fira Code", "Menlo", monospace',
    fontSize: "0.9em",
    padding: "3px 6px",
    borderRadius: 6,
    background: "#f1f5f9",
    color: "#ef4444",
  },
};


