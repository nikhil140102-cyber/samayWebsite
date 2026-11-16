"use client";

import { FormStatus, Honeypot, Success, useJsonForm } from "./FanSubmissionForm";

export default function ContactForm() {
  const { state, submit } = useJsonForm("/api/contact");
  if (state.status === "done") return <Success message={state.message} />;
  return (
    <form onSubmit={(e) => submit(e)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Name</label>
          <input id="c-name" name="name" className="input" required maxLength={80} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">Email</label>
          <input id="c-email" name="email" type="email" className="input" required autoComplete="email" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-subject">Subject</label>
        <select id="c-subject" name="subject" className="input">
          <option>General feedback</option>
          <option>Correction to site content</option>
          <option>Copyright / takedown request</option>
          <option>Merchandise order</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" className="input min-h-40" required minLength={10} maxLength={3000} />
      </div>
      <Honeypot />
      <p className="text-xs text-muted">We use your details only to reply. See the Privacy Policy.</p>
      <FormStatus state={state} idle="Send message" />
    </form>
  );
}
