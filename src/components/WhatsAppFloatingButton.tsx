import Image from "next/image";
import whatsappLogo from "@/whatsapp-clean.png";

const WHATSAPP_URL = "https://wa.me/420774333774";

export default function WhatsAppFloatingButton() {
  return (
    <>
      <a
        href={WHATSAPP_URL}
        aria-label="Otevrit WhatsApp chat"
        title="WhatsApp"
        className="whatsapp-floating-button"
      >
        <Image
          src={whatsappLogo}
          alt="WhatsApp"
          className="whatsapp-floating-button__image"
          sizes="(max-width: 768px) 58px, 68px"
          priority
        />
      </a>

      <style>{`
        .whatsapp-floating-button {
          position: fixed;
          right: 24px;
          bottom: calc(24px + env(safe-area-inset-bottom));
          z-index: 35;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .whatsapp-floating-button:hover {
          transform: translateY(-2px) scale(1.03);
          filter: brightness(1.04);
        }
        .whatsapp-floating-button__image {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 18px 30px rgba(7, 23, 12, 0.34));
        }
        @media (max-width: 768px) {
          .whatsapp-floating-button {
            right: 16px;
            bottom: calc(16px + env(safe-area-inset-bottom));
            width: 58px;
            height: 58px;
          }
          .whatsapp-floating-button__image {
            filter: drop-shadow(0 14px 24px rgba(7, 23, 12, 0.32));
          }
        }
      `}</style>
    </>
  );
}