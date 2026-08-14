export type SiteKind = "BUSINESS" | "LANDING" | "STORE";
export type SiteStatus = "DRAFT" | "PUBLISHED" | "SUSPENDED";
export type SiteBlockType = "hero" | "text" | "features" | "cta" | "spacer";

export type SiteBlock = {
  id: string;
  type: SiteBlockType;
  kicker?: string;
  title?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  items?: string[];
  align?: "left" | "center";
};

export type CustomerSite = {
  id: string;
  customerId: number;
  name: string;
  slug: string;
  kind: SiteKind;
  status: SiteStatus;
  templateId: string;
  theme: string;
  blocks: SiteBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type CustomerProfile = {
  id: number;
  email: string;
  name: string;
};

export type CustomerSubscription = {
  plan: "START" | "PRO" | "COMMERCE";
  status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  renewsAt: string;
};

