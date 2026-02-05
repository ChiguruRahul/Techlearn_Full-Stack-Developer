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

  // ✅ NEW: sidebar collapse (like reference)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ NEW: hover state for topic pills
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    if (!canNext) return;
    const next = topics[activeIndex + 1];
    setActiveTopicId(next.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectTopic(id) {
    setActiveTopicId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const SIDEBAR_OPEN = 340;
  const SIDEBAR_CLOSED = 78;

  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_OPEN);

  useEffect(() => {
    setSidebarWidth(sidebarCollapsed ? SIDEBAR_CLOSED : SIDEBAR_OPEN);
  }, [sidebarCollapsed]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>Learn / Courses / Topics</div>
          <h1 style={styles.h1}>{courseTitle}</h1>
        </div>
      </header>

      <div
        style={{
          ...styles.layout,
          gridTemplateColumns: `${sidebarWidth}px 1fr`,
          transition: "grid-template-columns 260ms ease",
        }}
      >
        {/* ✅ Sidebar (NO outer box) */}
        <aside style={{ ...styles.sidebar, width: sidebarWidth }}>
          <div style={styles.sidebarHeaderRow}>
            {!sidebarCollapsed && <div style={styles.sidebarTitle}>Course Topics</div>}

            {/* ✅ FIXED: proper collapse button (no t/active refs) + centered icon */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((s) => !s)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={styles.collapseBtn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  ...styles.collapseIcon,
                  transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </div>

          {/* ✅ Smooth collapse: fade + slide list content while width collapses */}
          <div style={styles.sidebarBody}>
            <div
              style={{
                ...styles.sidebarInner,
                ...(sidebarCollapsed ? styles.sidebarInnerCollapsed : {}),
                marginTop: sidebarCollapsed ? 10 : 12,
              }}
            >
              {topics.map((t) => {
                const active = t.id === activeTopicId;

                // Collapsed: show only number pills
                if (sidebarCollapsed) {
                  return (
                    <button
                      key={t.id}
                      onClick={() => selectTopic(t.id)}
                      title={`${t.order}. ${t.title}`}
                      style={{
                        ...styles.topicMiniBtn,
                        ...(active ? styles.topicMiniBtnActive : {}),
                      }}
                    >
                      {t.order}
                    </button>
                  );
                }

                // Expanded: show topic pills with number (NO boxed number chip)
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
          </div>
        </aside>

        {/* Main */}
        <main style={styles.main}>
          {loading && <div>Loading...</div>}

          {!loading && activeTopic && (
            <>
              <div style={styles.topicHeader}>
                <div>
                  <div style={styles.topicKicker}>{activeTopic.title}</div>
                </div>

                <div style={styles.navBtns}>
                  <button onClick={goPrev} disabled={!canPrev} style={styles.navBtn}>
                    ← Previous
                  </button>
                  <button onClick={goNext} disabled={!canNext} style={styles.navBtn}>
                    Next →
                  </button>
                </div>
              </div>

              <div style={styles.note}>
                <ReactMarkdown
                  components={{
                    h1: (props) => <h1 style={styles.noteH1} {...props} />,
                    h2: (props) => <h2 style={styles.noteH2} {...props} />,
                    h3: (props) => <h3 style={styles.noteH3} {...props} />,
                    p: (props) => <p style={styles.noteP} {...props} />,
                    li: (props) => <li style={styles.noteLi} {...props} />,
                  }}
                >
                  {activeTopic.note?.content || "No notes found."}
                </ReactMarkdown>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "system-ui, Arial",
    color: "#111",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #dff2ff 0%, #cfeeff 60%, #cfeeff 100%)",
  },

  header: {
    background: "transparent",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    padding: "18px 22px",
  },
  breadcrumb: { fontSize: 13, color: "rgba(0,0,0,0.55)" },
  h1: { margin: "6px 0 0", fontSize: 28, fontWeight: 800 },

  layout: {
    display: "grid",
    gap: 26, // ✅ gives the “more to the right” spacing
    padding: "18px 22px 32px",
    alignItems: "start",
    width: "100%",
  },

  // ✅ Sidebar has NO outer box/card now
  sidebar: {
    paddingTop: 8,
  },

  sidebarHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingLeft: 2,
  },

  sidebarTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1e3a8a",
    letterSpacing: "-0.02em",
  },

  // ✅ collapse button (centered icon + smooth icon rotate)
  collapseBtn: {
    width: 44,
    height: 34,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    lineHeight: 1,
    transition: "transform 160ms ease, background 160ms ease",
  },
  collapseIcon: {
    width: 20,
    height: 20,
    color: "#0a2a66",
    transition: "transform 220ms ease",
  },

  // ✅ Smooth collapse wrapper
  sidebarBody: {
    overflow: "hidden",
  },
  sidebarInner: {
    transition: "opacity 220ms ease, transform 260ms ease",
    opacity: 1,
    transform: "translateX(0px)",
  },
  sidebarInnerCollapsed: {
    opacity: 0,
    transform: "translateX(-10px)",
    pointerEvents: "none",
  },

  topicBtnHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 24px rgba(2,6,23,0.10)",
    background: "rgba(255,255,255,0.55)",
  },

  // Expanded topic button (keep “pills”)
  topicBtn: {
    width: "100%",
    textAlign: "left",
    padding: "14px 14px",
    borderRadius: 12,
    border: "1px solid transparent",
    background: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    marginBottom: 12,
    color: "#0f172a",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    gap: 12,
    transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
  },
  topicBtnActive: {
    background: "rgba(59,130,246,0.18)",
    border: "1px solid rgba(59,130,246,0.35)",
  },

  // ✅ number is plain (no little box)
  topicOrderPlain: {
    minWidth: 22,
    fontWeight: 800,
    color: "#111827",
  },
  topicTitleText: {
    fontWeight: 600,
  },

  // Collapsed mini number rail buttons
  topicMiniBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 800,
    color: "#111827",
    display: "grid",
    placeItems: "center",
  },
  topicMiniBtnActive: {
    background: "rgba(59,130,246,0.18)",
    border: "1px solid rgba(59,130,246,0.35)",
  },

  // Main content card (keep as-is style vibe)
  main: {
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(255,255,255,0.45)",
    borderRadius: 18,
    padding: 22,
    minHeight: 320,
    width: "100%",
    boxShadow: "0 14px 40px rgba(2, 6, 23, 0.08)",
    backdropFilter: "blur(12px)",
  },

  topicHeader: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "start",
    gap: 12,
    marginBottom: 14,
  },

  topicKicker: {
    fontSize: 14,
    fontWeight: 700,
    color: "rgba(2,6,23,0.60)",
    marginBottom: 6,
  },

  h2: {
    margin: 0,
    fontSize: 40,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    fontWeight: 900,
    color: "#0b1b4a",
  },

  navBtns: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    whiteSpace: "nowrap",
  },

  navBtn: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.65)",
    cursor: "pointer",
    fontWeight: 700,
  },

  note: {
    lineHeight: 1.7,
    color: "rgba(2,6,23,0.78)",
  },

  noteH1: { margin: "16px 0 10px", fontSize: 28 },
  noteH2: { margin: "16px 0 10px", fontSize: 22, color: "#1e3a8a" },
  noteH3: { margin: "14px 0 8px", fontSize: 18, color: "#1e3a8a" },
  noteP: { margin: "8px 0" },
  noteLi: { margin: "6px 0" },
};

