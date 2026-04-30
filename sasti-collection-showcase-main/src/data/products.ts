import f1 from "@/assets/fabric-1.jpg";
import f2 from "@/assets/fabric-2.jpg";
import f3 from "@/assets/fabric-3.jpg";
import f4 from "@/assets/fabric-4.jpg";
import f5 from "@/assets/fabric-5.jpg";
import f6 from "@/assets/fabric-6.jpg";
import type { Product } from "@/components/ProductCard";

export const products: Product[] = [
  { id: "1", name: "Moonlit Bloom", category: "Swiss Lawn", price: "PKR 4,250", image: f1, colors: ["#e8a5b8", "#d4756e", "#c9a36b"] },
  { id: "2", name: "Azure Paisley", category: "Swiss Lawn", price: "PKR 4,500", image: f2, colors: ["#6b9ed4", "#a8b8c9", "#3d5a80"] },
  { id: "3", name: "Rose Embroidered", category: "Pure Lawn", price: "PKR 3,950", image: f3, colors: ["#e8a5b8", "#d4756e", "#a85a4f"] },
  { id: "4", name: "Emerald Heritage", category: "Swiss Lawn", price: "PKR 5,100", image: f4, colors: ["#5a8a5e", "#c9a36b", "#3d5a3f"] },
  { id: "5", name: "Lilac Whisper", category: "Pure Lawn", price: "PKR 3,750", image: f5, colors: ["#d4b8d9", "#e8d5e3", "#a890b8"] },
  { id: "6", name: "Saffron Border", category: "Swiss Lawn", price: "PKR 4,800", image: f6, colors: ["#d4756e", "#e8c9a3", "#c9a36b"] },
];
