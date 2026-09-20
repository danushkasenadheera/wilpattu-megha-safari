export type PackagePrice = {
  id: string;
  package_id: string;
  label: string;
  price: number;
  price_to: number | null;
  unit: string;
  sort_order: number;
};

export type SafariPackage = {
  id: string;
  name: string;
  duration: string;
  schedule: string;
  description: string;
  inclusions: string[];
  sort_order: number;
  is_active: boolean;
  package_prices: PackagePrice[];
};
