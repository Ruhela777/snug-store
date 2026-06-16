import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    await fetch(`http://127.0.0.1:5000/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchOrders();
  };

  return (
    <div className="p-8 bg-[#FFFBF9] min-h-screen">
      <h1 className="text-3xl font-black text-[#4D3A2A] mb-8">Order Management 🧸</h1>
      
      <div className="bg-white rounded-3xl border border-[#6D442C]/10 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FFF9F6] text-[#6D442C] uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6D442C]/5">
            {orders.map((order) => (
              <React.Fragment key={order.order_id}>
                <tr className="hover:bg-[#FFF9F6] cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.order_id ? null : order.order_id)}>
                  <td className="px-6 py-4 font-mono font-bold text-[#7A6B5C]">{order.order_id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#4D3A2A]">{order.name || "N/A"}</div>
                    <div className="text-[10px] text-[#7A6B5C]">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-[#6D442C]">₹{order.total}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700">
                      {order.status || 'Processing'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select onClick={(e) => e.stopPropagation()} onChange={(e) => updateStatus(order.order_id, e.target.value)} value={order.status || 'Processing'} className="bg-white border p-1 rounded">
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
                {/* Expanded Details Row */}
                {expandedOrderId === order.order_id && (
                  <tr className="bg-[#FFF9F6]">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="font-bold text-[#4D3A2A]">Shipping Address:</p>
                          <p className="text-[#7A6B5C] whitespace-pre-line">{order.address || "No address provided"}</p>
                          <p className="mt-2 font-bold text-[#4D3A2A]">Phone: <span className="font-normal">{order.phone}</span></p>
                        </div>
                        <div>
                          <p className="font-bold text-[#4D3A2A]">Order Items:</p>
                          {order.items?.map((item, idx) => (
                            <p key={idx} className="text-[#7A6B5C]">• {item.name} (x{item.quantity}) - {item.selectedSize}</p>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}