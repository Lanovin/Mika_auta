import { MessageCircle, Phone } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/42077433774";

export default function WhatsAppFloatingButton() {
  return (
    <>
      <a
        href={WHATSAPP_URL}
        aria-label="Otevrit WhatsApp chat"
        title="WhatsApp"
        className="whatsapp-floating-button"
      >
        <span className="whatsapp-floating-button__icon" aria-hidden="true">
          <MessageCircle className="whatsapp-floating-button__bubble" strokeWidth={2.2} />
          <Phone className="whatsapp-floating-button__phone" strokeWidth={2.4} />
        </span>
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
          width: 64px;
          height: 64px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: linear-gradient(180deg, #27d467 0%, #1faa52 100%);
          color: #ffffff;
          text-decoration: none;
          box-shadow: 0 18px 36px rgba(7, 23, 12, 0.32);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .whatsapp-floating-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 22px 40px rgba(7, 23, 12, 0.38);
        }
        .whatsapp-floating-button__icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
        }
        .whatsapp-floating-button__bubble {
          width: 30px;
          height: 30px;
        }
        .whatsapp-floating-button__phone {
          position: absolute;
          width: 13px;
          height: 13px;
          transform: translate(-1px, 1px) rotate(-6deg);
        }
        @media (max-width: 768px) {
          .whatsapp-floating-button {
            right: 16px;
            bottom: calc(16px + env(safe-area-inset-bottom));
            width: 58px;
            height: 58px;
          }
          .whatsapp-floating-button__icon,
          .whatsapp-floating-button__bubble {
            width: 28px;
            height: 28px;
          }
          .whatsapp-floating-button__phone {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </>
  );
}