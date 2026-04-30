import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStoreData } from "@/lib/store-data";
import type { Product } from "@/components/ProductCard";

const ADMIN_AUTH_KEY = "sasti-admin-auth";
const ADMIN_PASSWORD = "admin123";

const nextId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const AdminRoute = () => {
  const [password, setPassword] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productColors, setProductColors] = useState("#e8a5b8, #d4756e");
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem(ADMIN_AUTH_KEY) === "true");
  const { storeData, updateStoreData } = useStoreData();

  const availableCategories = useMemo(
    () => storeData.categories.filter(Boolean),
    [storeData.categories]
  );

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-background grid place-items-center px-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Use password `admin123` to test the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (password === ADMIN_PASSWORD) {
                  localStorage.setItem(ADMIN_AUTH_KEY, "true");
                  setIsAuthed(true);
                } else {
                  alert("Incorrect password");
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full">Sign in</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const addCategory = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = categoryInput.trim();
    if (!trimmed) return;
    updateStoreData((current) => {
      if (current.categories.includes(trimmed)) return current;
      return { ...current, categories: [...current.categories, trimmed] };
    });
    setCategoryInput("");
  };

  const removeCategory = (category: string) => {
    updateStoreData((current) => ({
      categories: current.categories.filter((item) => item !== category),
      products: current.products.map((product) =>
        product.category === category ? { ...product, category: "Uncategorized" } : product
      ),
    }));
  };

  const addProduct = (event: FormEvent) => {
    event.preventDefault();
    if (!productName.trim() || !productCategory.trim() || !productPrice.trim()) return;

    const product: Product = {
      id: nextId(),
      name: productName.trim(),
      category: productCategory.trim(),
      price: productPrice.trim(),
      image: productImage.trim() || "https://images.unsplash.com/photo-1615368144592-355f7f2f53d5?auto=format&fit=crop&w=800&q=80",
      colors: productColors
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean),
    };

    updateStoreData((current) => {
      const categories = current.categories.includes(product.category)
        ? current.categories
        : [...current.categories, product.category];
      return { categories, products: [product, ...current.products] };
    });

    setProductName("");
    setProductCategory("");
    setProductPrice("");
    setProductImage("");
    setProductColors("#e8a5b8, #d4756e");
  };

  const updateProductPrice = (id: string, newPrice: string) => {
    updateStoreData((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === id ? { ...product, price: newPrice } : product
      ),
    }));
  };

  const deleteProduct = (id: string) => {
    updateStoreData((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-serif font-bold">Store Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage categories, products, and pricing in real-time.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <a href="/">Back to Store</a>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.removeItem(ADMIN_AUTH_KEY);
                setIsAuthed(false);
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>Add or remove shopping categories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={addCategory} className="flex gap-2">
                <Input
                  value={categoryInput}
                  onChange={(event) => setCategoryInput(event.target.value)}
                  placeholder="e.g. Swiss Lawn"
                />
                <Button type="submit">Add</Button>
              </form>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center justify-between rounded-md border px-3 py-2 bg-background">
                    <span>{category}</span>
                    <Button variant="ghost" onClick={() => removeCategory(category)}>Remove</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Product</CardTitle>
              <CardDescription>Create a new suit/product entry quickly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addProduct} className="grid gap-3">
                <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name" />
                <Input value={productCategory} onChange={(e) => setProductCategory(e.target.value)} placeholder="Category" />
                <Input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="PKR 4,250" />
                <Input value={productImage} onChange={(e) => setProductImage(e.target.value)} placeholder="Image URL (optional)" />
                <Input value={productColors} onChange={(e) => setProductColors(e.target.value)} placeholder="#e8a5b8, #d4756e" />
                <Button type="submit">Add Product</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Products</CardTitle>
            <CardDescription>Update prices instantly or delete products.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {storeData.products.map((product) => {
              const draft = priceDrafts[product.id] ?? product.price;
              return (
                <div key={product.id} className="grid gap-3 rounded-lg border bg-background p-3 md:grid-cols-[1fr_200px_130px] md:items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <Input
                    value={draft}
                    onChange={(event) =>
                      setPriceDrafts((current) => ({
                        ...current,
                        [product.id]: event.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => updateProductPrice(product.id, draft)}>Save</Button>
                    <Button variant="destructive" onClick={() => deleteProduct(product.id)}>Delete</Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminRoute;
