import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/context/toast-context";
import Index from "@/pages/Index";
import ClubMenu from "@/pages/ClubMenu";
import Cart from "@/pages/Cart";
import Admin from "@/pages/Admin";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/club/:clubId" element={<ClubMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/panier" element={<Navigate to="/cart" replace />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </CartProvider>
  </StrictMode>
);
