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

  return (
    <div style={styles.page}>
      {/* Minimal CSS for hover/active transitions (no Tailwind required) */}
      <style>{css}</style>

      <header style={styles.header} className="glass">
        <div style={styles.headerInner}>
          <div>
            <div style={styles.breadcrumb}>Learn / Courses / Topics</div>
            <h1 style={styles.h1}>{courseTitle}</h1>
          </div>

          <div style={styles.headerRight}>
            <span style={styles.pill}>
              <span style={styles.pillDot} />
              Beginner
            </span>
          </div>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar} className="glass">
          <div style={styles.sidebarTitleRow}>
            <div style={styles.sidebarTitle}>Course Topics</div>
            <div style={styles.sidebarCount}>{topics.length}</div>
          </div>

          <div style={styles.topicList}>
            {topics.map((t) => {
              const active = t.id === activeTopicId;

              return (
                <button
                  key={t.id}
                  onClick={() => selectTopic(t.id)}
                  className={`topicBtn ${active ? "active" : ""}`}
                  style={styles.topicBtn}
                >
                  <span style={styles.topicOrder}>{t.order}</span>
                  <span style={styles.topicTitle}>{t.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <main style={styles.main} className="glass">
          {loading && (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingTitle}>Loading…</div>
              <div style={styles.loadingSub}>Fetching topics and notes</div>
            </div>
          )}

          {!loading && activeTopic && (
            <>
              <div style={styles.topicHeader}>
                <div>
                  <div style={styles.sectionTitle}>Welcome & Course Overview</div>
                  <h2 style={styles.h2}>{activeTopic.title}</h2>
                </div>

                <div style={styles.navBtns}>
                  <button
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="navBtn"
                    style={styles.navBtn}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canNext}
                    className="navBtn"
                    style={styles.navBtn}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* No nested scrolling container (matches reference behavior) */}
              <div style={styles.note}>
                <ReactMarkdown
                  components={{
                    h1: (props) => <h1 style={styles.noteH1} {...props} />,
                    h2: (props) => <h2 style={styles.noteH2} {...props} />,
                    h3: (props) => <h3 style={styles.noteH3} {...props} />,
                    p: (props) => <p style={styles.noteP} {...props} />,
                    li: (props) => <li style={styles.noteLi} {...props} />,
                    code: ({ inline, children, ...props }) =>
                      inline ? (
                        <code style={styles.inlineCode} {...props}>
                          {children}
                        </code>
                      ) : (
                        <pre style={styles.codeBlock}>
                          <code {...props}>{children}</code>
                        </pre>
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
  );
}

const css = `
  .glass{
    background: rgba(255,255,255,0.45);
    border: 1px solid rgba(255,255,255,0.25);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.08);
  }

  .topicBtn{
    transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border 160ms ease;
  }
  .topicBtn:hover{
    transform: translateY(-2px);
    background: rgba(255,255,255,0.65);
    box-shadow: 0 12px 22px rgba(2, 6, 23, 0.10);
    border: 1px solid rgba(30, 58, 138, 0.18);
  }
  .topicBtn.active{
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(30, 58, 138, 0.25);
    box-shadow: 0 12px 22px rgba(2, 6, 23, 0.10);
  }

  .navBtn{
    transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease, border 140ms ease;
  }
  .navBtn:hover:enabled{
    transform: translateY(-1px);
    background: rgba(255,255,255,0.75);
    box-shadow: 0 10px 18px rgba(2, 6, 23, 0.10);
  }
  .navBtn:disabled{
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    color: "#0f172a",
    background: "linear-gradient(135deg, #daf0fa 0%, #bceaff 55%, #bceaff 100%)",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    borderBottom: "1px solid rgba(255,255,255,0.18)",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "18px 22px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  breadcrumb: { fontSize: 12, color: "rgba(15, 23, 42, 0.65)" },
  h1: { margin: "6px 0 0", fontSize: 22, fontWeight: 800 },

  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(255,255,255,0.30)",
    fontWeight: 700,
    fontSize: 12,
    color: "rgba(30,58,138,0.95)",
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(30,58,138,0.95)",
    boxShadow: "0 0 0 4px rgba(30,58,138,0.12)",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: 18,
    padding: 18,
    maxWidth: 1200,
    margin: "0 auto",
    alignItems: "start",
  },

  sidebar: {
    borderRadius: 18,
    padding: 14,
    position: "sticky",
    top: 88,
    height: "fit-content",
  },
  sidebarTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "6px 6px 10px",
  },
  sidebarTitle: { fontWeight: 900, fontSize: 16 },
  sidebarCount: {
    minWidth: 34,
    height: 28,
    padding: "0 10px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.28)",
    fontWeight: 800,
    fontSize: 12,
    color: "rgba(15,23,42,0.7)",
  },

  topicList: { display: "flex", flexDirection: "column", gap: 10 },
  topicBtn: {
    width: "100%",
    textAlign: "left",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  topicOrder: {
    width: 28,
    height: 28,
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 12,
    color: "rgba(30,58,138,0.95)",
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(30,58,138,0.12)",
    flex: "0 0 auto",
  },
  topicTitle: { fontSize: 14, fontWeight: 700, color: "rgba(15,23,42,0.90)" },

  main: {
    borderRadius: 18,
    padding: 18,
    minHeight: 360,
  },

  loadingWrap: { padding: 18 },
  loadingTitle: { fontWeight: 900, fontSize: 16 },
  loadingSub: { marginTop: 6, color: "rgba(15,23,42,0.65)", fontSize: 13 },

  topicHeader: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 12,
    alignItems: "start",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: "rgba(15,23,42,0.65)",
    marginBottom: 6,
  },
  h2: { margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" },

  navBtns: { display: "flex", gap: 10, whiteSpace: "nowrap" },
  navBtn: {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.30)",
    background: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    fontWeight: 800,
    color: "rgba(15,23,42,0.85)",
  },

  note: {
    lineHeight: 1.75,
    paddingTop: 6,
    color: "rgba(15,23,42,0.88)",
  },

  noteH1: { margin: "14px 0 10px", fontSize: 28, fontWeight: 900 },
  noteH2: { margin: "14px 0 10px", fontSize: 20, fontWeight: 900 },
  noteH3: { margin: "14px 0 8px", fontSize: 16, fontWeight: 900 },
  noteP: { margin: "10px 0" },
  noteLi: { margin: "6px 0" },

  inlineCode: {
    padding: "2px 6px",
    borderRadius: 8,
    background: "rgba(15, 23, 42, 0.06)",
    border: "1px solid rgba(15, 23, 42, 0.10)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 13,
  },
  codeBlock: {
    padding: 14,
    borderRadius: 14,
    overflowX: "auto",
    background: "rgba(2, 6, 23, 0.06)",
    border: "1px solid rgba(2, 6, 23, 0.10)",
  },
};
