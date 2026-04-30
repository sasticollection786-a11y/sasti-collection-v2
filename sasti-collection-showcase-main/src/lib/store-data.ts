import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/components/ProductCard";
import { products as defaultProducts } from "@/data/products";

const STORAGE_KEY = "sasti-store-data";

export interface StoreData {
  categories: string[];
  products: Product[];
}

const deriveCategories = (items: Product[]) =>
  Array.from(new Set(items.map((item) => item.category).filter(Boolean)));

const defaultStoreData = (): StoreData => ({
  categories: deriveCategories(defaultProducts),
  products: defaultProducts,
});

const hasWindow = typeof window !== "undefined";

export const readStoreData = (): StoreData => {
  if (!hasWindow) return defaultStoreData();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStoreData();

  try {
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    const products = Array.isArray(parsed.products) ? parsed.products : defaultStoreData().products;
    const categories = Array.isArray(parsed.categories)
      ? parsed.categories
      : deriveCategories(products);
    return { categories, products };
  } catch {
    return defaultStoreData();
  }
};

export const writeStoreData = (data: StoreData) => {
  if (!hasWindow) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("store-data-updated"));
};

export const useStoreData = () => {
  const [storeData, setStoreData] = useState<StoreData>(() => readStoreData());

  useEffect(() => {
    const sync = () => setStoreData(readStoreData());
    window.addEventListener("storage", sync);
    window.addEventListener("store-data-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("store-data-updated", sync);
    };
  }, []);

  const updateStoreData = useCallback((updater: (current: StoreData) => StoreData) => {
    const next = updater(readStoreData());
    writeStoreData(next);
    setStoreData(next);
  }, []);

  return { storeData, updateStoreData };
};
