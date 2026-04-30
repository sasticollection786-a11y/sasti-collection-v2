import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { Trash2 } from "lucide-react";

const DELIVERY_CHARGES = 350;

const parsePkrPrice = (value: string) => {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatPkr = (amount: number) => `PKR ${amount.toLocaleString("en-PK")}`;

export const CartSheet = () => {
  const { items, isOpen, setOpen, remove, count, clear } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + parsePkrPrice(item.price) * item.qty, 0);
  const grandTotal = subtotal + DELIVERY_CHARGES;

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
              <div className="rounded-md border border-border bg-muted/30 p-3 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPkr(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery Charges (350)</span>
                  <span className="font-medium">{formatPkr(DELIVERY_CHARGES)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-1.5">
                  <span className="font-semibold">Grand Total</span>
                  <span className="font-semibold text-brand">{formatPkr(grandTotal)}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-red-600">
                Sirf wahi log order karein jo delivery charges advance de sakte hain
              </p>
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