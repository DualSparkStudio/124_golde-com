"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { wishlistStore, cartStore, type CartItem } from "@/lib/clientStore";

interface StoreContextType {
  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
  // Cart
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setWishlistIds(wishlistStore.get());
    setCartItems(cartStore.get());
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    if (wishlistStore.has(productId)) {
      setWishlistIds(wishlistStore.remove(productId));
    } else {
      setWishlistIds(wishlistStore.add(productId));
    }
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlistIds.includes(productId), [wishlistIds]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(cartStore.add(item));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(cartStore.remove(productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    setCartItems(cartStore.updateQty(productId, qty));
  }, []);

  const clearCart = useCallback(() => {
    cartStore.clear();
    setCartItems([]);
  }, []);

  return (
    <StoreContext.Provider value={{
      wishlistIds,
      toggleWishlist,
      isWishlisted,
      wishlistCount: wishlistIds.length,
      cartItems,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      cartCount: cartItems.reduce((s, i) => s + i.quantity, 0),
      cartTotal: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
