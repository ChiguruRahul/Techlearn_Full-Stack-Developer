import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../api/client";
import "./TopicsPage.css";

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
    <div className="tp-page">
      <div className="tp-topbar">
        <div className="tp-wrap">
          <div className="tp-breadcrumb">Learn / Courses / Topics</div>

          <div className="tp-titleRow">
            <h1 className="tp-title">{courseTitle}</h1>

            <div className="tp-pill" title="Level">
              <span className="tp-pillDot" />
              Beginner
            </div>
          </div>
        </div>
      </div>

      <div className="tp-wrap">
        <div className="tp-layout">
          {/* LEFT SIDEBAR */}
          <aside className="tp-card tp-sidebar">
            <div className="tp-sidebarHead">
              <p className="tp-sidebarTitle">Course Topics</p>
              <span className="tp-countBubble">{topics.length}</span>
            </div>

            {topics.map((t, idx) => {
              const active = t.id === activeTopicId;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTopic(t.id)}
                  className={`tp-topicBtn ${active ? "tp-topicBtnActive" : ""}`}
                >
                  {/* ✅ number with NO box */}
                  <span className="tp-topicNum">{idx + 1}</span>
                  <span className="tp-topicText">{t.title}</span>
                </button>
              );
            })}
          </aside>

          {/* MAIN CONTENT */}
          <main className="tp-card tp-main">
            {loading && <div>Loading...</div>}

            {!loading && activeTopic && (
              <>
                <div className="tp-mainHeader">
                  <div>
                    <h2 className="tp-topicTitle">{activeTopic.title}</h2>
                  </div>

                  <div className="tp-nav">
                    <button onClick={goPrev} disabled={!canPrev} className="tp-navBtn">
                      ← Previous
                    </button>
                    <button onClick={goNext} disabled={!canNext} className="tp-navBtn">
                      Next →
                    </button>
                  </div>
                </div>

                <div className="tp-note">
                  <ReactMarkdown>
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
