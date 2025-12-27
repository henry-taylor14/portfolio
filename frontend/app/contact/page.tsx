// app/contact/page.tsx
"use client";
import { useState } from "react";
import SidePattern from "../components/SidePattern";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
      hp: fd.get("hp")
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Match your API response structure
      if (res.ok && data.ok) {
        setStatus("success");
        form.reset();
      } else {
        setErrorMsg(data.error || "Failed to send");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error");
      setStatus("error");
    }
  }

  return (
    <>
    <SidePattern side='left'/>
    <SidePattern side='right'/>
      <section className="max-w-xl mx-auto p-6 ">
        <h1 className="text-2xl font-semibold mb-4">Contact</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="name" 
            placeholder="Your name" 
            className="w-full p-3 border rounded text-black bg-gray-300" 
            required 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Your email" 
            className="w-full p-3 border rounded text-black bg-gray-300" 
            required 
          />
          <textarea 
            name="message" 
            placeholder="Tell me about your project..." 
            rows={6} 
            className="w-full p-3 border rounded text-black bg-gray-300" 
            required 
          />
          
          {/* Honeypot */}
          <div style={{ display: "none" }}>
            <label>Do not fill</label>
            <input name="hp" tabIndex={-1} autoComplete="off" />
          </div>

          <button
            type="submit"
            className="px-5 py-3 bg-[#513952] text-white rounded disabled:opacity-50 hover:bg-[#6b4b6d] transition-colors border-black border-1"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-green-600">Message sent — thank you!</p>
          )}
          {status === "error" && (
            <p className="text-red-600">{errorMsg || "Something went wrong"}</p>
          )}
        </form>
      </section>
    </>
  );
}