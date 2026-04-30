import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { Trash2 } from "lucide-react";

export const CartSheet = () => {
  const { items, isOpen, setOpen, remove, count, clear } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl">
              Your Cart {count > 0 && <span className="text-brand">({count})</span>}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-6 -mx-6 px-6">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-12">
                Your cart is empty.
              </p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 pb-4 border-b border-border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.category}
                      </p>
                      <h4 className="font-serif text-sm font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-brand font-semibold mt-1">{item.price}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                    </div>
                    <button
                      aria-label="Remove"
                      onClick={() => remove(item.id)}
                      className="text-muted-foreground hover:text-destructive self-start"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border pt-4 space-y-3">
              <Button
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={() => setCheckoutOpen(true)}
              >
                Checkout
              </Button>
              <button
                onClick={clear}
                className="w-full text-xs text-muted-foreground hover:text-destructive"
              >
                Clear cart
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={(v) => {
          setCheckoutOpen(v);
          if (!v) {
            // close cart after successful order if cart was emptied externally — keep simple
          }
        }}
        summary={`${count} item${count === 1 ? "" : "s"} in your cart`}
      />
    </>
  );
};