export interface SocialLink {
  name: string;
  label: string;
  href: string;
  displayHandle: string;
}

export const OFFICIAL_SOCIAL_LINKS: SocialLink[] = [
  {
    name: "YouTube",
    label: "YOUTUBE",
    href: "https://www.youtube.com/@%ED%94%84%EB%A1%9C%EB%8D%95%EC%85%98_P",
    displayHandle: "@프로덕션_P",
  },
  {
    name: "Instagram",
    label: "INSTAGRAM",
    href: "https://www.instagram.com/production.p.official/",
    displayHandle: "@production.p.official",
  },
  {
    name: "TikTok",
    label: "TIKTOK",
    href: "https://www.tiktok.com/@production.p.official",
    displayHandle: "@production.p.official",
  },
];
