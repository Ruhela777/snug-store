import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx"; // 🛒 1. IMPORT YOUR NEW CART CONTEXT PROVIDER

// Layout and Main Wrapper
import Navbar from "./components/Navbar/Navbar.jsx"; 

// Pages
import LandingPage from "./pages/Landing/Landing.jsx";
import Home from "./pages/Home/Home.jsx";
import Collections from "./pages/Collections/Collections.jsx";
import Community from "./pages/Community/Community.jsx";
import About from "./pages/About/About.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Payment from "./pages/Payment/Payment.jsx";
import TrackOrder from "./pages/TrackOrder/TrackOrder.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

function App() {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // 1. Show the isolated landing page for the first 5 seconds
  if (showLanding) {
    return <LandingPage />;
  }

  // 2. Once the landing page finishes, render the core application routing with the Navbar
  // 🌟 FIX: Wrap everything inside <CartProvider> so context hooks like useCart() can execute safely!
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;