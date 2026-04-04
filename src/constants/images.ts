export const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1200&q=80";
export const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80";
export const DEFAULT_CERT_IMAGE = "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=1200&q=85";

export const DEFAULT_PRODUCT_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80",
  "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1200&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
  "https://images.unsplash.com/photo-1520975693411-1f7a2b0b2f8b?w=1200&q=80",
  "https://images.unsplash.com/photo-1503863937795-62954a3c0f05?w=1200&q=80",
];

export const DEFAULT_CERT_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=1200&q=85",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=85",
  "https://images.unsplash.com/photo-1614028674026-a65e31c2d1a5?w=1200&q=85",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85",
  "https://images.unsplash.com/photo-1610725661618-1b3fd76aa87c?w=1200&q=85",
  "https://images.unsplash.com/photo-1520975693411-1f7a2b0b2f8b?w=1200&q=85",
];

// Per-item overrides for known problematic entries
export const PRODUCT_IMAGE_OVERRIDES: Record<string, string> = {
  "22k gold bridal necklace set": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=85",
};

export const CERT_IMAGE_OVERRIDES: Record<string, string> = {
  "purity verification": "https://images.unsplash.com/photo-1614028674026-a65e31c2d1a5?w=1200&q=85",
};

export function pickFrom<T>(arr: T[], key: string): T {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum = (sum + key.charCodeAt(i)) % 2147483647;
  const idx = sum % arr.length;
  return arr[idx];
}
