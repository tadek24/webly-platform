export type SiteKind = "BUSINESS" | "LANDING" | "STORE";
export type SiteStatus = "DRAFT" | "PUBLISHED" | "SUSPENDED";
export type PlatformRole = "ADMIN" | "CUSTOMER";
export type SubscriptionPlan = "START" | "PRO" | "COMMERCE" | "OMNICHANNEL";

export type SiteBlockType =
  | "hero"
  | "text"
  | "features"
  | "image"
  | "gallery"
  | "quote"
  | "stats"
  | "products"
  | "contact"
  | "cta"
  | "divider"
  | "spacer";

export type ImageAsset = {
  id?: number;
  url: string;
  alt: string;
  name?: string;
};

export type BlockStyle = {
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
  overlay?: number;
  padding?: "compact" | "normal" | "airy";
  width?: "contained" | "wide";
};

export type SiteBlock = {
  id: string;
  type: SiteBlockType;
  kicker?: string;
  title?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  items?: string[];
  imageUrl?: string;
  imageAlt?: string;
  images?: ImageAsset[];
  align?: "left" | "center";
  style?: BlockStyle;
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
  role: PlatformRole;
  access?: "ACTIVE" | "SUSPENDED";
};

export type CustomerSubscription = {
  plan: SubscriptionPlan;
  status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  renewsAt: string;
};

export type PackageDefinition = {
  id: SubscriptionPlan;
  name: string;
  price: number;
  setup: number;
  description: string;
  audience: string;
  siteLimit: number;
  features: string[];
};

export type StoreProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "DRAFT";
  imageUrl?: string;
};

export type StoreOrder = {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: "NEW" | "PAID" | "PACKING" | "SHIPPED" | "CANCELED";
  channel: string;
  createdAt: string;
};

export type StoreIntegration = {
  id: string;
  name: string;
  category: "PAYMENTS" | "DELIVERY" | "ERP" | "MARKETPLACE";
  description: string;
  selected: boolean;
  availability: "READY" | "PLANNED";
};

export type StoreData = {
  mode: "PREVIEW" | "WOOCOMMERCE";
  products: StoreProduct[];
  orders: StoreOrder[];
  integrations: StoreIntegration[];
  updatedAt: string;
};

export type AdminCustomer = CustomerProfile & {
  subscription: CustomerSubscription;
  sites: CustomerSite[];
};

export type AdminOverview = {
  customers: AdminCustomer[];
  packages: PackageDefinition[];
  totals: {
    customers: number;
    sites: number;
    stores: number;
    monthlyRevenue: number;
  };
};
