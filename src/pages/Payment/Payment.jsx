import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    if (!orderData) {
      alert("Error: No order data found!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, paymentMethod })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Yay! Payment Successful via ${paymentMethod}! Order ID: ${result.order_id}`);
        navigate('/');
      } else {
        alert("Server error: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error("Critical Fetch Error:", err);
      alert("Check your Flask terminal for errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF9] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-[#6D442C]/10"
      >
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-black text-[#4D3A2A]">Secure Checkout 🧸</h2>
          <p className="text-xs text-[#7A6B5C] mt-2">Choose your cozy payment method</p>
        </div>

        <div className="space-y-4">
          {/* UPI Option */}
          <button 
            onClick={() => setPaymentMethod("UPI")}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
              paymentMethod === "UPI" ? "border-[#FF8580] bg-[#FFF0F0]" : "border-[#6D442C]/10 bg-white"
            }`}
          >
            <span className="font-bold text-[#4D3A2A]">UPI / QR Pay</span>
            <span className="text-xl">✨</span>
          </button>

          {/* COD Option */}
          <button 
            onClick={() => setPaymentMethod("COD")}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
              paymentMethod === "COD" ? "border-[#FF8580] bg-[#FFF0F0]" : "border-[#6D442C]/10 bg-white"
            }`}
          >
            <span className="font-bold text-[#4D3A2A]">Cash on Delivery</span>
            <span className="text-xl">📦</span>
          </button>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleConfirmPayment}
            disabled={loading}
            className="w-full bg-[#6D442C] text-white py-4 rounded-2xl font-black hover:bg-[#4D3A2A] transition-all active:scale-[0.98] shadow-lg shadow-[#6D442C]/20"
          >
            {loading ? "Processing..." : `Pay ${paymentMethod === "COD" ? "at Door" : "Now"} 🎀`}
          </button>
        </div>

        <p className="text-center text-[10px] text-[#7A6B5C]/60 mt-6">
          Your payment is secured with extra layers of cozy love.
        </p>
      </motion.div>
    </div>
  );
}