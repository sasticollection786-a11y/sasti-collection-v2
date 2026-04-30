import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { useStoreData } from "@/lib/store-data";

const Index = () => {
  const { storeData } = useStoreData();
  const filters = useMemo(() => ["All", ...storeData.categories], [storeData.categories]);
  const [active, setActive] = useState("All");

  const safeActive = filters.includes(active) ? active : "All";
  const visible = useMemo(
    () =>
      safeActive === "All"
        ? storeData.products
        : storeData.products.filter((p) => p.category === safeActive),
    [safeActive, storeData.products]
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-6 py-10 md:py-14">
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Spring / Summer Edit</p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight max-w-xl">
              Fabric, woven with quiet luxury.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  safeActive === f
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-8">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>

        <footer className="mt-20 border-t border-border pt-8 pb-4 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Sasti Collection. Crafted in Pakistan.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-brand">Shipping</a>
            <a href="#" className="hover:text-brand">Returns</a>
            <a href="#" className="hover:text-brand">Contact</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
