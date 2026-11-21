"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljrzevr";

const fieldClasses =
  "w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink/65 transition-colors focus:border-teal-deep";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Formspree's own honeypot check, in addition to our hidden field.
    if (formData.get("website")) {
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        setStatus("error");
        setErrorMessage(
          data?.errors?.[0]?.message ??
            "Something went wrong. Please email us directly."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="animate-pop-in rounded-2xl border border-teal/30 bg-teal/[0.06] p-8">
        <p className="font-display text-xl text-ink">Message sent.</p>
        <p className="mt-2 text-body text-ink/70">
          Thanks for reaching out — we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  // action + method let the form still send (to Formspree directly) when
  // JavaScript is off; with JavaScript, handleSubmit takes over.
  return (
    <form
      action={FORMSPREE_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {/* Honeypot — hidden from real visitors, catches simple bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input type="hidden" name="_subject" value="New message from farmilytechnologies.com" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-small font-medium text-ink/70">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-small font-medium text-ink/70">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-small font-medium text-ink/70">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-small font-medium text-ink/70">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${fieldClasses} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="animate-fade-in text-small text-red-700">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2.5 rounded-full bg-teal-deep px-6 py-3.5 text-body font-medium tracking-wide text-paper transition-all duration-200 hover:bg-ink active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
