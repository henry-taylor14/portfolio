// app/contact/page.tsx
"use client";
import { useState } from "react";
import SidePattern from "../components/SidePattern";

const TOPICS = ["Hiring", "Project inquiry", "Just saying hi"] as const;

const field =
  "mt-2 block w-full rounded-lg border border-purple-300 bg-white px-4 py-3 text-base text-black placeholder:text-purple-600 transition-colors focus-visible:border-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800 dark:border-purple-700 dark:bg-purple-950 dark:text-white dark:placeholder:text-gold-200 dark:focus-visible:border-gold-300 dark:focus-visible:outline-gold-300";
const label = "block font-mono text-sm text-gray-800 dark:text-gray-100";

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
      topic: fd.get("topic"),
      message: fd.get("message"),
      hp: fd.get("hp"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        form.reset();
      } else {
        // 4xx errors are written for visitors; 5xx are internal, so give a recovery path instead.
        setErrorMsg(
          res.status < 500 && data.error
            ? data.error
            : "Your message didn't send on our end. Please try again in a minute, or reach Henry on LinkedIn.",
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Couldn't reach the server. Check your connection and try again; your message is still here.");
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      <SidePattern side="left" />
      <SidePattern side="right" />
      <section className="relative max-w-xl mx-auto px-6 pt-12 pb-16 lg:pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-balance text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-7xl">
          Contact
        </h1>
        <p className="mt-4 mb-10 text-lg text-gray-700 dark:text-gray-200">
          Hiring, a project, or just a hello. Henry reads every message.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset>
            <legend className={label}>What&apos;s this about?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TOPICS.map((topic, i) => (
                <label key={topic} className="cursor-pointer">
                  <input type="radio" name="topic" value={topic} defaultChecked={i === 0} className="peer sr-only" />
                  <span className="inline-block rounded-full border border-purple-300 bg-white px-4 py-2 font-mono text-sm text-purple-900 transition-colors hover:border-purple-800 peer-checked:border-purple-800 peer-checked:bg-purple-800 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple-800 dark:border-purple-700 dark:bg-purple-950 dark:text-gold-100 dark:peer-checked:border-gold-200 dark:peer-checked:bg-gold-200 dark:peer-checked:text-purple-950 dark:peer-focus-visible:outline-gold-300">
                    {topic}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="contact-name" className={label}>Name</label>
            <input id="contact-name" name="name" autoComplete="name" className={field} required />
          </div>
          <div>
            <label htmlFor="contact-email" className={label}>Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" className={field} required />
          </div>
          <div>
            <label htmlFor="contact-message" className={label}>Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="A few lines about the role or project is plenty."
              rows={6}
              minLength={5}
              className={field}
              required
            />
          </div>

          {/* Honeypot */}
          <div style={{ display: "none" }} aria-hidden>
            <label>Do not fill</label>
            <input name="hp" tabIndex={-1} autoComplete="off" />
          </div>

          <button
            type="submit"
            className="rounded-full bg-black px-6 py-3 font-mono text-white transition-opacity hover:opacity-85 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-800 dark:focus-visible:outline-gold-300"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          <div role="status" aria-live="polite">
            {status === "success" && (
              <p className="rounded-lg border border-purple-300 bg-white px-4 py-3 text-purple-950 dark:border-purple-700 dark:bg-purple-950 dark:text-gold-50">
                Message sent. Thanks! Henry will get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-lg border border-rust bg-white px-4 py-3 text-rust dark:border-gold-300 dark:bg-purple-950 dark:text-gold-200">
                {errorMsg}
              </p>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
