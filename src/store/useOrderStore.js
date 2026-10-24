import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialOrders = [
  {
    id: "APX-9142",
    createdAt: "2026-10-24T14:32:00.000Z",
    customerName: "Sardor Rahimov",
    customerPhone: "+998 90 945-11-22",
    deliveryRegion: "Toshkent shahri",
    deliveryAddress: "Yunusobod 14-mavze, 24-uy, 15-xonadon",
    deliveryType: "courier",
    paymentMethod: "payme",
    items: [
      { id: "prod-1", name: "Apple iPhone 16 Pro Max 256GB Desert Titanium", quantity: 1, price: 16800000 }
    ],
    subtotal: 16800000,
    discountAmount: 1680000,
    deliveryFee: 0,
    total: 15120000,
    status: "processing",
    notes: "Iltimos soat 18:00 dan keyin yetkazing."
  },
  {
    id: "APX-8821",
    createdAt: "2026-10-23T11:15:00.000Z",
    customerName: "Gulnora Karimova",
    customerPhone: "+998 97 733-44-55",
    deliveryRegion: "Samarqand viloyati",
    deliveryAddress: "Samarqand sh., Registon ko'chasi 18",
    deliveryType: "courier",
    paymentMethod: "click",
    items: [
      { id: "prod-4", name: "Sony WH-1000XM5 Wireless ANC Headphones", quantity: 1, price: 4350000 },
      { id: "prod-10", name: "Anker 737 PowerBank 24000mAh 140W GaN", quantity: 1, price: 1650000 }
    ],
    subtotal: 6000000,
    discountAmount: 0,
    deliveryFee: 0,
    total: 6000000,
    status: "shipped",
    notes: ""
  },
  {
    id: "APX-8109",
    createdAt: "2026-10-22T09:40:00.000Z",
    customerName: "Bobur Mirzayev",
    customerPhone: "+998 93 501-77-88",
    deliveryRegion: "Toshkent shahri",
    deliveryAddress: "Chilonzor 9-mavze, 5-uy",
    deliveryType: "pickup",
    paymentMethod: "cash",
    items: [
      { id: "prod-7", name: "Apple AirPods Pro 2nd Gen USB-C MagSafe", quantity: 2, price: 3100000 }
    ],
    subtotal: 6200000,
    discountAmount: 620000,
    deliveryFee: 0,
    total: 5580000,
    status: "delivered",
    notes: "Do'kondan soat 14:00 da olib ketaman"
  },
  {
    id: "APX-7650",
    createdAt: "2026-10-20T16:20:00.000Z",
    customerName: "Nilufar Azimova",
    customerPhone: "+998 91 123-99-00",
    deliveryRegion: "Farg'ona viloyati",
    deliveryAddress: "Qo'qon sh., Turkiston ko'chasi 55",
    deliveryType: "courier",
    paymentMethod: "uzum",
    items: [
      { id: "prod-5", name: "Apple Watch Ultra 2 Titanium 49mm", quantity: 1, price: 10500000 }
    ],
    subtotal: 10500000,
    discountAmount: 1050000,
    deliveryFee: 0,
    total: 9450000,
    status: "delivered",
    notes: ""
  }
];

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: initialOrders,

      createOrder: (orderPayload) => {
        const orderId = 'APX-' + Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
          ...orderPayload,
          id: orderId,
          createdAt: new Date().toISOString(),
          status: 'pending' // 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
        };

        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        });
      },

      deleteOrder: (orderId) => {
        set({
          orders: get().orders.filter((o) => o.id !== orderId)
        });
      },

      getStats: () => {
        const orders = get().orders;
        const totalOrders = orders.length;
        const totalRevenue = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingCount = orders.filter((o) => o.status === 'pending').length;
        const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

        return {
          totalOrders,
          totalRevenue,
          pendingCount,
          deliveredCount
        };
      }
    }),
    {
      name: 'apexstore-orders-storage'
    }
  )
);
