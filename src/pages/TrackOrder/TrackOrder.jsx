import React, { useState } from "react";

export default function TrackOrder() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOrders = async () => {
    if (!email) return;
    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/orders/${email}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine status color and icon
  const getStatusVisuals = (status) => {
    switch (status) {
      case 'Shipped': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: '🚚' };
      case 'Delivered': return { color: 'text-green-600', bg: 'bg-green-50', icon: '✅' };
      default: return { color: 'text-orange-600', bg: 'bg-orange-50', icon: '⏳' };
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF9] p-8">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-black text-[#4D3A2A] mb-2 text-center">Track Your Snuggles 📦</h2>
        <p className="text-center text-[#7A6B5C] mb-8 text-sm">Enter the email used during checkout to see your order status.</p>
        
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-[#6D442C]/10">
          <input 
            type="email" 
            placeholder="e.g., hello@example.com" 
            className="flex-1 p-3 bg-transparent outline-none text-sm font-medium"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
          />
          <button 
            onClick={fetchOrders} 
            className="bg-[#6D442C] text-white px-6 py-3 rounded-xl font-black hover:bg-[#4D3A2A] transition-all"
          >
            Track
          </button>
        </div>

        {loading && <p className="text-center text-[#7A6B5C]">Looking for your orders... 🧸</p>}
        
        {!loading && searched && orders.length === 0 && (
          <p className="text-center text-[#7A6B5C]">No orders found for this email. Check the address and try again!</p>
        )}
        
        <div className="space-y-4">
          {orders.map((order) => {
            const visuals = getStatusVisuals(order.status);
            return (
              <div key={order.order_id} className="bg-white p-6 rounded-3xl border border-[#6D442C]/10 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#7A6B5C] tracking-widest">Order ID</p>
                    <p className="font-mono font-black text-[#4D3A2A] text-lg">{order.order_id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${visuals.bg} ${visuals.color}`}>
                    {visuals.icon} {order.status || 'Processing'}
                  </div>
                </div>

                <div className="border-t border-[#6D442C]/5 pt-4">
                  <div className="flex justify-between text-sm text-[#4D3A2A] font-bold">
                    <span>Total Amount</span>
                    <span>₹{order.total}</span>
                  </div>
                  <p className="text-[10px] text-[#7A6B5C] mt-1 italic">Items in package: {order.items?.length || 0}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}