import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const categories = [
  { label: "Swiss Lawn", href: "#swiss-lawn" },
  { label: "Pure Lawn", href: "#pure-lawn" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="border-b border-border/60 bg-background/95 px-6 py-1.5 text-center text-xs text-muted-foreground">
        WhatsApp for orders: <span className="font-medium text-foreground">03049116786</span>
      </div>
      <nav className="container mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-10">
          <a href="/" className="font-serif text-xl md:text-2xl font-bold tracking-tight text-brand">
            Sasti <span className="text-foreground">Collection</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm">
            {categories.map((c) => (
              <a key={c.label} href={c.href} className="text-muted-foreground hover:text-brand transition-colors">
                {c.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="text-foreground/80 hover:text-brand transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
            className="relative text-foreground/80 hover:text-brand transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-brand text-[10px] text-brand-foreground grid place-items-center font-medium">
              {count}
            </span>
          </button>
          <button aria-label="Menu" className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-3 bg-background">
          {categories.map((c) => (
            <a key={c.label} href={c.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-brand">
              {c.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
