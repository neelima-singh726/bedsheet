// Frontend Product shape your components use (keep in sync with "@/data/catalog")
export type UiProduct = {
  handle: string;
  title: string;
  price: number;
  images: string[];
  badges?: string[]; // optional; components read it safely
  stock?: number;
};
