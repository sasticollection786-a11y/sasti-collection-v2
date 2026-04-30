import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { CheckoutDialog } from "@/components/CheckoutDialog";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  colors: string[];
}

export const ProductCard = ({ product }: { product: Product }) => {
  const { add } = useCart();
  const [buyOpen, setBuyOpen] = useState(false);

  const handleAdd = () => {
    add(product);
    toast.success("Added to cart", { description: product.name });
  };

  return (
    <article className="group">
    <div className="relative aspect-square overflow-hidden rounded-xl bg-muted shadow-[var(--shadow-card)]">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        width={800}
        height={800}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {product.category}
      </span>
    </div>
    <div className="pt-4 px-1">
      <h3 className="font-serif text-base md:text-lg font-medium text-foreground mb-1.5 group-hover:text-brand transition-colors">
        {product.name}
      </h3>
      <div className="flex items-center justify-between mb-3">
        <p className="text-base font-semibold text-brand">{product.price}</p>
        <div className="flex gap-1.5">
          {product.colors.map((c, i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-full border border-border"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="flex-1 border-border hover:border-brand hover:text-brand"
        >
          Add to Cart
        </Button>
        <Button
          size="sm"
          onClick={() => setBuyOpen(true)}
          className="flex-1 bg-brand text-brand-foreground hover:bg-brand/90"
        >
          Buy Now
        </Button>
      </div>
    </div>
    <CheckoutDialog open={buyOpen} onOpenChange={setBuyOpen} product={product} />
  </article>
  );
};
