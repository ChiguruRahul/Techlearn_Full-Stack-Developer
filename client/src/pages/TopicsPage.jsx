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
        <div>
          <div style={styles.breadcrumb}>Learn / Courses / Topics</div>
          <h1 style={styles.h1}>{courseTitle}</h1>
        </div>
      </header>

      {/* ✅ page stays fixed, only inner content scrolls */}
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

              {/* ✅ collapse button (centered chevron) */}
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
                  stroke="currentColor"
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

            {/* ✅ sidebar list can scroll if topics are many */}
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

          {/* Main */}
          <main style={styles.main}>
            {loading && <div>Loading...</div>}

            {!loading && activeTopic && (
              <>
                {/* optional: keep header visible while scrolling */}
                <div style={styles.topicHeaderSticky}>
                  <div style={styles.topicHeader}>
                    <div>
                      {/* ✅ match reference: small grey kicker */}
                      <div style={styles.topicKicker}>Welcome &amp; Course Overview</div>
                      <h2 style={styles.h2}>{activeTopic.title}</h2>
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
                </div>

                {/* ✅ ONLY this scrolls */}
                <div id="topicScrollArea" style={styles.noteScroll}>
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
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "system-ui, Arial",
    color: "#111",
    height: "100vh",
    overflow: "hidden",
    background: "linear-gradient(180deg, #dff2ff 0%, #cfeeff 60%, #cfeeff 100%)",
  },

  header: {
    background: "transparent",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    padding: "18px 22px",
    flex: "0 0 auto",
  },
  breadcrumb: { fontSize: 13, color: "rgba(0,0,0,0.55)" },
  h1: { margin: "6px 0 0", fontSize: 28, fontWeight: 800 },

  body: {
    height: "calc(100vh - 76px)", // header height approx
    overflow: "hidden",
  },

  layout: {
    display: "grid",
    gap: 26,
    padding: "18px 22px 32px",
    alignItems: "stretch",
    width: "100%",
    height: "100%",
    transition: "grid-template-columns 520ms cubic-bezier(0.22, 1, 0.36, 1)",
  },

  sidebar: {
    paddingTop: 8,
    height: "100%",
    transition: "width 520ms cubic-bezier(0.22, 1, 0.36, 1)",
  },

  sidebarHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingLeft: 2,
    marginBottom: 12,
  },

  sidebarTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1e3a8a",
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  collapseBtn: {
    width: 44,
    height: 34,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    padding: 0,
    transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
  },

  sidebarList: {
    height: "calc(100% - 56px)",
    overflowY: "auto",
    paddingRight: 6,
  },

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
    transition: "transform 180ms ease, box-shadow 180ms ease, background 180ms ease",
  },
  topicBtnActive: {
    background: "rgba(59,130,246,0.18)",
    border: "1px solid rgba(59,130,246,0.35)",
  },
  topicBtnHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 24px rgba(2,6,23,0.10)",
    background: "rgba(255,255,255,0.55)",
  },

  topicOrderPlain: {
    minWidth: 22,
    fontWeight: 800,
    color: "#111827",
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
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 800,
    color: "#111827",
    display: "grid",
    placeItems: "center",
    transition: "transform 180ms ease, box-shadow 180ms ease, background 180ms ease",
  },
  topicMiniBtnActive: {
    background: "rgba(59,130,246,0.18)",
    border: "1px solid rgba(59,130,246,0.35)",
  },
  topicMiniBtnHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 24px rgba(2,6,23,0.10)",
    background: "rgba(255,255,255,0.55)",
  },

  main: {
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(255,255,255,0.45)",
    borderRadius: 18,
    padding: 0,
    height: "100%",
    width: "100%",
    boxShadow: "0 14px 40px rgba(2, 6, 23, 0.08)",
    backdropFilter: "blur(12px)",
    overflow: "hidden",
  },

  topicHeaderSticky: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    padding: 22,
  },

  topicHeader: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "start",
    gap: 12,
  },

  topicKicker: {
    fontSize: 14,
    fontWeight: 700,
    color: "rgba(2,6,23,0.55)",
    marginBottom: 6,
  },

  h2: {
    margin: 0,
    fontSize: 56, // closer to reference
    lineHeight: 1.05,
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

  noteScroll: {
    padding: "18px 22px 26px",
    height: "calc(100% - 130px)", // subtract sticky header space
    overflowY: "auto",
    lineHeight: 1.7,
    color: "rgba(2,6,23,0.78)",
  },

  noteH1: { margin: "16px 0 10px", fontSize: 28 },
  noteH2: { margin: "18px 0 10px", fontSize: 22, color: "#1e3a8a" },
  noteH3: { margin: "16px 0 8px", fontSize: 18, color: "#1e3a8a" },
  noteP: { margin: "10px 0" },
  noteLi: { margin: "8px 0" },

  pre: {
    margin: "14px 0",
    padding: 0,
    overflowX: "auto",
    borderRadius: 12,
  },
  codeBlock: {
    display: "block",
    padding: "16px 18px",
    borderRadius: 12,
    background: "#0b1220",
    color: "rgba(255,255,255,0.92)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 14,
    lineHeight: 1.6,
    boxShadow: "0 10px 24px rgba(2,6,23,0.18)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  inlineCode: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "0.95em",
    padding: "2px 6px",
    borderRadius: 8,
    background: "rgba(15,23,42,0.08)",
    border: "1px solid rgba(15,23,42,0.10)",
  },
};


