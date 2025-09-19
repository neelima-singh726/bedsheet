import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  handle: string;
  title: string;
  price: number;
  qty: number;
  image: string;
};

type State = {
  items: CartItem[];
  opened: boolean;
  isBuyNow: boolean;
  add: (item: CartItem) => void;
  remove: (handle: string) => void;
  setOpened: (o: boolean) => void;
  setIsBuyNow: (b: boolean) => void;
  total: () => number;
  clear: () => void;
};

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      opened: false,
      isBuyNow: false, // << INITIALIZE THE STATE
      add: (item) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.handle === item.handle);

        if (i > -1) {
          items[i] = item;
        } else {
          items.push(item);
        }

        // Only open the cart if it's NOT a "Buy Now" click
        if (!get().isBuyNow) {
          set({ items, opened: true });
        } else {
          set({ items });
        }
      },
      remove: (h) => set({ items: get().items.filter((x) => x.handle !== h) }),
      setOpened: (o) => set({ opened: o }),
      setIsBuyNow: (b) => set({ isBuyNow: b }), // << DEFINE THE FUNCTION
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      clear: () => set({ items: [] }),
    }),
    {
      name: "cart",
      partialize: (state) => ({ items: state.items, isBuyNow: state.isBuyNow }),
      onRehydrateStorage: () => (state) => {
        state?.setOpened(false);
        state?.setIsBuyNow(false);
      },
    }
  )
);
