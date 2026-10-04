"use client";

/* ============================================================
 * FC APG 1921 — Contact form (brief §9.5)
 *
 * Client-validated (react-hook-form + zod), honeypot-protected,
 * ZERO backend storage: a valid submit composes a WhatsApp
 * message (name / email / subject / body) and opens wa.me in a
 * new tab. Success state: a small ball-into-the-net SVG moment
 * (≤ 800 ms, disabled under reduced motion) + whatsapp.text.
 * Bots filling the honeypot get a silent fake success.
 * ============================================================ */

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_SUBJECTS } from "@/data/mock";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/components/analytics/analytics";

/* ------------------------------------------------------------
 * Success animation — ball hits the net (white circle + mesh
 * lines), ≤ 800 ms total, static under reduced motion.
 * ------------------------------------------------------------ */
function GoalNetAnimation({ reduced }: { reduced: boolean }) {
  const NET_DELAY = 0.42;
  const netLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let x = 30; x <= 130; x += 20) {
    netLines.push({ x1: x, y1: 20, x2: x, y2: 90 });
  }
  for (let y = 30; y <= 80; y += 20) {
    netLines.push({ x1: 18, y1: y, x2: 142, y2: y });
  }

  return (
    <svg
      viewBox="0 0 160 110"
      className="h-24 w-auto"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {/* Goal frame */}
      <g stroke="#002b5c" strokeWidth={5} strokeLinecap="square">
        <line x1={18} y1={20} x2={18} y2={90} />
        <line x1={142} y1={20} x2={142} y2={90} />
        <line x1={16} y1={20} x2={144} y2={20} />
      </g>

      {/* Net mesh — fades in as the ball arrives */}
      <motion.g
        stroke="#0052a8"
        strokeWidth={1.5}
        opacity={0.35}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: reduced ? 0 : NET_DELAY, duration: 0.28 }}
      >
        {netLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </motion.g>

      {/* The ball */}
      <motion.circle
        cx={80}
        r={10}
        fill="#ffffff"
        stroke="#002b5c"
        strokeWidth={2.5}
        initial={reduced ? false : { cy: -12, opacity: 0 }}
        animate={{ cy: 52, opacity: 1 }}
        transition={{
          duration: reduced ? 0 : 0.45,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------
 * Form
 * ------------------------------------------------------------ */
export function ContactForm({ number }: { number: string }) {
  const t = useTranslations("contact");
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);

  const schema = z.object({
    name: z.string().min(2, t("form.errors.name")),
    email: z.email(t("form.errors.email")),
    subject: z.enum(CONTACT_SUBJECTS),
    message: z.string().min(10, t("form.errors.message")),
    // Honeypot — humans never see it; filled ⇒ bot.
    website: z.string().optional(),
  });
  type ContactValues = z.infer<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: "info",
      message: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    // Honeypot filled → silent fake success, nothing is opened.
    if (values.website) {
      setSent(true);
      return;
    }
    const message = [
      values.name,
      values.email,
      t(`form.subjects.${values.subject}`),
      values.message,
    ].join("\n");
    window.open(buildWhatsAppUrl(number, message), "_blank", "noopener");
    trackEvent("contact_form_submit", { subject: values.subject });
    setSent(true);
  });

  const fieldLabel =
    "font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ink/70";
  const fieldInput =
    "h-11 border-ink/20 bg-white text-ink placeholder:text-ink/35";

  return (
    <div className="border border-ink/10 bg-paper p-5 shadow-[0_2px_18px_rgba(0,43,92,0.05)] sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div
              key="success"
              role="status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-6 py-8 text-center"
            >
              <GoalNetAnimation reduced={!!reduced} />
              <p className="max-w-sm text-sm leading-relaxed text-ink/70">
                {t("whatsapp.text")}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              noValidate
              onSubmit={onSubmit}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid gap-5"
            >
              {/* Honeypot — hidden from humans (§9.5), mirrors newsletter pattern */}
              <label className="sr-only" aria-hidden>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="contact-name" className={fieldLabel}>
                    {t("form.name")}
                  </Label>
                  <Input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder={t("form.namePlaceholder")}
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                    className={fieldInput}
                    {...register("name")}
                  />
                  {errors.name ? (
                    <p id="contact-name-error" role="alert" className="text-sm text-apg-red">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="contact-email" className={fieldLabel}>
                    {t("form.email")}
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    className={fieldInput}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p id="contact-email-error" role="alert" className="text-sm text-apg-red">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="contact-subject" className={fieldLabel}>
                  {t("form.subject")}
                </Label>
                <Controller
                  control={control}
                  name="subject"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="contact-subject"
                        aria-invalid={!!errors.subject}
                        className={`w-full data-[size=default]:h-11 ${fieldInput}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-ink/15">
                        {CONTACT_SUBJECTS.map((subject) => (
                          <SelectItem
                            key={subject}
                            value={subject}
                            className="rounded-none"
                          >
                            {t(`form.subjects.${subject}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="contact-message" className={fieldLabel}>
                  {t("form.message")}
                </Label>
                <Textarea
                  id="contact-message"
                  rows={6}
                  placeholder={t("form.messagePlaceholder")}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  className="min-h-32 border-ink/20 bg-white text-ink placeholder:text-ink/35"
                  {...register("message")}
                />
                {errors.message ? (
                  <p id="contact-message-error" role="alert" className="text-sm text-apg-red">
                    {errors.message.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                className="apg-focus inline-flex min-h-12 w-full items-center justify-center gap-2 bg-apg-yellow px-6 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white sm:w-auto sm:justify-self-start"
              >
                <Send className="size-4" aria-hidden />
                {t("form.send")}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
    </div>
  );
}
