"use client";
import { useState } from "react";
export function ContactForm({ deliveryEnabled }: { deliveryEnabled: boolean }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = String(fields.get("name") || "");
    const email = String(fields.get("email") || "");
    const message = String(fields.get("message") || "");
    if (!deliveryEnabled) {
      window.location.href = `mailto:bharath_v@nid.edu?subject=${encodeURIComponent(`Portfolio enquiry from ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`;
      setStatus(
        "Your email draft is ready. Send it from your email app to complete your message.",
      );
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fields)),
      });
      if (!response.ok) throw new Error();
      setStatus("Thank you! Your message has been sent.");
      form.reset();
    } catch {
      setStatus(
        "Your message could not be sent. Please email bharath_v@nid.edu directly.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Name *
        <input
          name="name"
          autoComplete="name"
          placeholder="Your Name..."
          required
          maxLength={120}
        />
      </label>
      <label>
        Email Address *
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your Email Address..."
          required
          maxLength={254}
        />
      </label>
      <label>
        Message *
        <textarea
          name="message"
          placeholder="Your Message..."
          required
          maxLength={5000}
        />
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" disabled={busy}>
        {busy ? "Sending…" : deliveryEnabled ? "Submit" : "Compose email"}
      </button>
      {!deliveryEnabled && (
        <p className="form-note">
          Opens a draft in your email app. You can also write directly to{" "}
          <a href="mailto:bharath_v@nid.edu">bharath_v@nid.edu</a>.
        </p>
      )}
      <p className="form-note" role="status">
        {status}
      </p>
    </form>
  );
}
