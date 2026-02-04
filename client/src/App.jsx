import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopicsPage from "./pages/TopicsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/learn/courses/:courseId/topics" element={<TopicsPage />} />
        <Route path="/" element={<Navigate to="/learn/courses/demo/topics" replace />} />
        <Route path="*" element={<div style={{ padding: 16 }}>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
