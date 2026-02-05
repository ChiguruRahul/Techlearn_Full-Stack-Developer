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
      <header style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>Learn / Courses / Topics</div>
          <h1 style={styles.h1}>{courseTitle}</h1>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Topics</div>

          {topics.map((t) => {
            const active = t.id === activeTopicId;
            return (
              <button
                key={t.id}
                onClick={() => selectTopic(t.id)}
                style={{
                  ...styles.topicBtn,
                  ...(active ? styles.topicBtnActive : {}),
                }}
              >
                <span style={styles.topicOrder}>{t.order}.</span> {t.title}
              </button>
            );
          })}
        </aside>

        <main style={styles.main}>
          {loading && <div>Loading...</div>}

          {!loading && activeTopic && (
            <>
              <div style={styles.topicHeader}>
                <h2 style={styles.h2}>{activeTopic.title}</h2>
                <div style={styles.navBtns}>
                  <button onClick={goPrev} disabled={!canPrev} style={styles.navBtn}>
                    ← Previous
                  </button>
                  <button onClick={goNext} disabled={!canNext} style={styles.navBtn}>
                    Next →
                  </button>
                </div>
              </div>

              {/* ✅ No nested scrolling container */}
              <div style={styles.note}>
                <ReactMarkdown  
                 components={{
                    h1: (props) => <h1 style={styles.noteH1} {...props} />,
                    h2: (props) => <h2 style={styles.noteH2} {...props} />,
                    h3: (props) => <h3 style={styles.noteH3} {...props} />,
                }}>{activeTopic.note?.content || "No notes found."}
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
    background: "white",
    minHeight: "100vh",
  },

  header: {
    background: "white",
    borderBottom: "1px solid #e5e5e5",
    padding: "16px 20px",
  },
  breadcrumb: { fontSize: 12, color: "#666" },
  h1: { margin: "6px 0 0", fontSize: 20 },

  layout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 16,
    padding: 16,
    alignItems: "start",
    width: "100%",
  },

  sidebar: {
    background: "white",
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    padding: 12,
    position: "sticky",
    top: 12,
    height: "fit-content",
  },
  sidebarTitle: { fontWeight: 700, marginBottom: 10 },
  topicBtn: {
    width: "100%",
    textAlign: "left",
    padding: "10px 10px",
    borderRadius: 8,
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    marginBottom: 6,
    color: "#111",
    fontSize: 14,
  },

  topicBtnActive: {
    background: "#eef5ff",
    border: "1px solid #cfe4ff",
    color: "#111",
  },

  topicOrder: { color: "#666", marginRight: 6,fontWeight:600 },

  main: {
    background: "white",
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    padding: 16,
    minHeight: 300,
    width: "100%",
  },
  topicHeader: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "start",
    gap: 12,
    marginBottom: 12,
  },

  h2: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.3,
  },

  navBtns: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    alignItems: "center",
    whiteSpace: "nowrap",
  },

  navBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
  note: {
  lineHeight: 1.6,
  },

  noteH1: { margin: "10px 0", fontSize: 26 },
  noteH2: { margin: "10px 0", fontSize: 20 },
  noteH3: { margin: "10px 0", fontSize: 16 },
};
