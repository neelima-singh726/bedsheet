"use client";
const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917300736401";
export default function WhatsappFab() {
  const href = `https://wa.me/${phone}?text=Hi%20Blue%20Dahlia%2C%20I%27d%20like%20help.`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 grid place-items-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-6 h-6"
        fill="currentColor"
      >
        <path d="M16 3a13 13 0 00-11.2 19.5L3 29l6.7-1.7A13 13 0 1016 3zm7.5 18.7c-.3.8-1.5 1.4-2.1 1.5-.6.1-1.3.1-2.1-.1-.5-.1-1.1-.3-1.8-.6a13.3 13.3 0 01-4.9-3.6c-.7-.8-1.2-1.7-1.6-2.3-.3-.6-.3-1.1-.3-1.4 0-.3.1-.8.4-1.1.1-.3.3-.5.5-.7.2-.2.3-.3.5-.3h.4c.1 0 .3 0 .4.3l.6 1.4c.1.3.2.5.1.7 0 .2-.2.4-.3.5l-.3.4-.1.2c-.1.1 0 .3.1.4l.4.6c.5.8 1.1 1.4 1.9 2 .8.6 1.6 1 2.5 1.3.3.1.6.1.7 0 .2-.1.4-.4.6-.7.2-.3.3-.5.5-.6.2-.2.4-.1.7 0l1.4.6c.3.1.4.2.5.4.1.2.1.4 0 .6z" />
      </svg>
    </a>
  );
}
