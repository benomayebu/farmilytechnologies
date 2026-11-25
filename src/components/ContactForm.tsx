"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";
type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

// Lengths a real person needs, with room to spare. Without them a pasted
// document or a bot could send a message of any size.
const MAX = { name: 120, company: 160, email: 254, message: 5000 };

/** Check the three required fields before anything is sent. */
function validate(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  const value = (n: string) =>
    (form.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? "";
  if (!value("name")) errors.name = "Please add your name.";
  const email = value("email");
  if (!email) errors.email = "Please add your email so we can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "That email doesn't look right. Check it for typos.";
  if (!value("message")) errors.message = "Please write a short message.";
  return errors;
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljrzevr";

const fieldClass = (invalid: boolean) =>
  `w-full rounded-xl border bg-paper px-4 py-3 text-body text-ink placeholder:text-ink/65 transition-colors focus:border-teal-deep ${
    invalid ? "border-alert" : "border-ink/20"
  }`;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-small text-alert">
      {message}
    </p>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    // noValidate turns off the browser's bubbles, so check here instead:
    // nothing is sent until every required field is filled in.
    const errors = validate(form);
    setFieldErrors(errors);
    const firstInvalid = (Object.keys(errors) as FieldName[])[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("sending");
    setErrorMessage("");
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
          Thanks for reaching out. We&apos;ll get back to you soon.
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
      onChange={(e) => {
        // Clear a field's message as soon as the visitor starts fixing it.
        const name = (e.target as unknown as HTMLInputElement).name as FieldName;
        if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: undefined });
      }}
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
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            maxLength={MAX.name}
            className={fieldClass(!!fieldErrors.name)}
          />
          <FieldError id="name-error" message={fieldErrors.name} />
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
            maxLength={MAX.company}
            className={fieldClass(false)}
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
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          maxLength={MAX.email}
          className={fieldClass(!!fieldErrors.email)}
        />
        <FieldError id="email-error" message={fieldErrors.email} />
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
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          maxLength={MAX.message}
          className={`${fieldClass(!!fieldErrors.message)} resize-y`}
        />
        <FieldError id="message-error" message={fieldErrors.message} />
      </div>

      {status === "error" && (
        <p role="alert" className="animate-fade-in text-small text-alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2.5 rounded-full bg-teal-deep px-6 py-3.5 text-body font-medium tracking-wide text-paper transition-[background-color,color,border-color,transform] duration-200 ease-out hover:bg-ink active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
