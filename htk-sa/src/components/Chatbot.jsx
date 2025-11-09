// src/components/Chatbot.jsx
import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [log, setLog] = useState([]);

  const ask = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    // fake answer; wire to real API later
    const a = `Helper: I’m here! You asked: “${q}”`;
    setLog((prev) => [...prev, { role: "user", text: q }, { role: "bot", text: a }]);
    setQ("");
  };

  return (
    <div className="chatbot">
      <button onClick={() => setOpen(!open)}>{open ? "Close" : "AI Help"}</button>
      {open && (
        <div className="panel">
          <div className="log">
            {log.map((m, i) => (
              <div key={i} className={m.role}>{m.text}</div>
            ))}
          </div>
          <form onSubmit={ask}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about products, orders…" />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
