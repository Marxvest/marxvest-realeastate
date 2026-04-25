import { createWhatsAppHref } from "@/lib/utils";

const defaultMessage =
  "Hello Marxvest Spec Limited, I would like to make an inquiry about your land listings.";

export function WhatsAppWidget() {
  return (
    <a
      href={createWhatsAppHref(defaultMessage)}
      target="_blank"
      rel="noreferrer"
      aria-label="Open WhatsApp chat with Marxvest"
      className="fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-[#1fa855] text-white shadow-[0_24px_60px_rgba(10,21,52,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(10,21,52,0.35)] sm:bottom-[6.9rem] sm:right-7 sm:h-12 sm:w-12"
    >
      <span className="whatsapp-ping absolute inset-0 rounded-full border border-white/50" />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="relative h-5.5 w-5.5 fill-current sm:h-6 sm:w-6"
      >
        <path d="M20.52 3.48A11.8 11.8 0 0 0 12.1 0C5.62 0 .35 5.26.35 11.74c0 2.07.54 4.08 1.56 5.84L0 24l6.59-1.88a11.7 11.7 0 0 0 5.5 1.4h.01c6.48 0 11.75-5.27 11.75-11.75 0-3.14-1.22-6.09-3.33-8.29Zm-8.42 18.06h-.01a9.76 9.76 0 0 1-4.98-1.37l-.36-.21-3.91 1.12 1.15-3.81-.24-.39a9.76 9.76 0 0 1-1.5-5.14c0-5.39 4.38-9.77 9.78-9.77 2.61 0 5.06 1.02 6.9 2.88a9.7 9.7 0 0 1 2.86 6.89c0 5.39-4.39 9.8-9.69 9.8Zm5.36-7.35c-.29-.14-1.74-.86-2.01-.95-.27-.1-.47-.14-.66.14-.2.29-.77.95-.95 1.15-.17.19-.35.22-.64.07-.29-.14-1.24-.46-2.36-1.47a8.82 8.82 0 0 1-1.64-2.05c-.17-.29-.02-.45.13-.6.13-.13.29-.35.43-.52.15-.17.2-.29.29-.48.1-.19.05-.36-.02-.51-.08-.14-.66-1.6-.91-2.18-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.36s-1.02 1-.96 2.43c.07 1.42 1.02 2.79 1.17 2.98.14.2 2.03 3.11 5 4.23.7.31 1.25.49 1.68.63.71.23 1.35.2 1.86.12.57-.09 1.74-.71 1.98-1.38.24-.68.24-1.27.17-1.39-.07-.12-.26-.19-.55-.33Z" />
      </svg>
    </a>
  );
}
