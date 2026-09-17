import { OFFICIAL_SOCIAL_LINKS } from "@/lib/social";

function SocialIcon({ name }: { name: string }) {
  if (name === "YouTube") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4.3" />
        <line x1="17.6" y1="6.4" x2="17.61" y2="6.4" strokeWidth="2.8" />
      </svg>
    );
  }

  if (name === "TikTok") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.11V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.1 15.68 6.34 6.34 0 0 0 9.44 22a6.33 6.33 0 0 0 6.33-6.33V9.22a8.16 8.16 0 0 0 4.82 1.57V7.35c-.34 0-.68-.22-1-.66z" />
      </svg>
    );
  }

  return null;
}

export default function SocialLinks({
  className = "",
  showIcons = true,
  showLabels = true,
  showArrow = true,
}: {
  className?: string;
  showIcons?: boolean;
  showLabels?: boolean;
  showArrow?: boolean;
}) {
  return (
    <div className={`productionSocialLinks ${className}`.trim()}>
      {OFFICIAL_SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="socialItemLink"
          aria-label={`Production P ${social.name} 공식 채널 (새 창에서 열림)`}
        >
          {showIcons && (
            <span className="socialItemIcon">
              <SocialIcon name={social.name} />
            </span>
          )}
          {showLabels && <span className="socialItemLabel">{social.label}</span>}
          {showArrow && <i className="socialItemArrow" aria-hidden="true">↗</i>}
        </a>
      ))}
    </div>
  );
}
