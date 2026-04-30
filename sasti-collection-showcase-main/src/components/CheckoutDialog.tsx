import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Product } from "@/components/ProductCard";

const DELIVERY_CHARGES = 350;

const parsePkrPrice = (value: string) => {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatPkr = (amount: number) => `PKR ${amount.toLocaleString("en-PK")}`;

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  whatsapp: z
    .string()
    .trim()
    .min(7, "Enter a valid number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Digits only"),
  address: z.string().trim().min(5, "Address is too short").max(300),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product?: Product | null;
  summary?: string;
}

export const CheckoutDialog = ({ open, onOpenChange, product, summary }: Props) => {
  const [form, setForm] = useState({ name: "", whatsapp: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const productPrice = product ? parsePkrPrice(product.price) : 0;
  const grandTotal = productPrice + DELIVERY_CHARGES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const templateParams = {
      name: form.name,
      whatsapp: form.whatsapp,
      address: form.address,
      product: product ? product.name : "N/A",
      total: formatPkr(grandTotal),
    };

    try {
      // Sasti Collection Final URL
      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbyfpGRUnKkRlDU7n59KExf6I1mMdw35ekZ-PSiMZP-qIxJvQZfbuo2AhJ1O-GTE-93i/exec";

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(templateParams),
      });

      // EmailJS integration
      await emailjs.send(
        "service_dasru7o",
        "template_gc7thpj",
        templateParams,
        { publicKey: "1JDsQvS9J-MAcl7Kr" }
      );

      toast.success("Order placed", {
        description: `Thank you, ${result.data.name}. We'll confirm on WhatsApp shortly.`,
      });
      setForm({ name: "", whatsapp: "", address: "" });
      onOpenChange(false);
    } catch (error) {
      toast.error("Order error", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete your order</DialogTitle>
          <DialogDescription>
            {product ? `${product.name} • ${product.price}` : summary || "Confirm your details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {product && (
            <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
              <h4 className="font-semibold text-sm">Price Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Product Price</span>
                <span>{formatPkr(productPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Charges (350 PKR)</span>
                <span>{formatPkr(DELIVERY_CHARGES)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Grand Total</span>
                <span>{formatPkr(grandTotal)}</span>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="+92 300 1234567"
            />
            {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street, city, postal code"
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          <Button type="submit" className="w-full">
            Place Order
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

