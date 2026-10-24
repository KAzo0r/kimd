import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  checkBotConnection,
  sendTestTextMessage,
  sendTestPhotoMessage,
  notifyNewProduct,
  notifyProductUpdate,
  notifyNewOrder,
  notifyLowStock,
  notifyCustomerRegister
} from '../utils/telegramService';

export const useTelegramStore = create(
  persist(
    (set, get) => ({
      // Optional frontend override; if empty, backend uses TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID from .env
      botToken: '',
      chatId: '',

      // Notification Toggles
      notifyNewOrder: true,
      notifyNewProduct: true,
      notifyLowStock: true,
      notifyProductUpdate: true,
      notifyCustomerRegister: true,

      // Live Bot Status
      botInfo: null, // { ok: boolean, username, firstName, id, error, checkedAt }

      // Notification Logs
      notificationsLog: [],

      updateSettings: (newSettings) => {
        set((state) => ({ ...state, ...newSettings }));
      },

      getCredentialsOverride: () => {
        const { botToken, chatId } = get();
        const payload = {};
        if (botToken) payload.token = botToken;
        if (chatId) payload.chatId = chatId;
        return payload;
      },

      checkBotStatus: async () => {
        const creds = get().getCredentialsOverride();
        const res = await checkBotConnection(creds);
        const info = {
          ok: res.ok,
          bot: res.bot || null,
          error: res.error || null,
          checkedAt: new Date().toISOString()
        };
        set({ botInfo: info });
        return res;
      },

      sendTestText: async () => {
        const creds = get().getCredentialsOverride();
        const res = await sendTestTextMessage(creds);
        const log = {
          id: 'log-' + Date.now(),
          type: 'test_text',
          title: 'Test matnli xabarnoma',
          status: res.ok ? 'delivered' : 'failed',
          error: res.error || null,
          timestamp: new Date().toISOString()
        };
        set({ notificationsLog: [log, ...get().notificationsLog.slice(0, 49)] });
        return res;
      },

      sendTestPhoto: async (photoUrl) => {
        const creds = get().getCredentialsOverride();
        const res = await sendTestPhotoMessage(photoUrl, creds);
        const log = {
          id: 'log-' + Date.now(),
          type: 'test_photo',
          title: 'Test rasm xabarnomasi',
          status: res.ok ? 'delivered' : 'failed',
          error: res.error || null,
          timestamp: new Date().toISOString()
        };
        set({ notificationsLog: [log, ...get().notificationsLog.slice(0, 49)] });
        return res;
      },

      dispatchNewProduct: async (product) => {
        if (!get().notifyNewProduct) return;
        const creds = get().getCredentialsOverride();
        const res = await notifyNewProduct(product, creds);
        const log = {
          id: 'log-' + Date.now(),
          type: 'new_product',
          title: `Yangi mahsulot: ${product.name}`,
          status: res.ok ? 'delivered' : 'failed',
          error: res.error || null,
          timestamp: new Date().toISOString()
        };
        set({ notificationsLog: [log, ...get().notificationsLog.slice(0, 49)] });
        return res;
      },

      dispatchProductUpdate: async (product) => {
        if (!get().notifyProductUpdate) return;
        const creds = get().getCredentialsOverride();
        const res = await notifyProductUpdate(product, creds);
        const log = {
          id: 'log-' + Date.now(),
          type: 'product_update',
          title: `Mahsulot yangilandi: ${product.name}`,
          status: res.ok ? 'delivered' : 'failed',
          error: res.error || null,
          timestamp: new Date().toISOString()
        };
        set({ notificationsLog: [log, ...get().notificationsLog.slice(0, 49)] });
        return res;
      },

      dispatchNewOrder: async (order) => {
        if (!get().notifyNewOrder) return;
        const creds = get().getCredentialsOverride();
        const res = await notifyNewOrder(order, creds);
        const log = {
          id: 'log-' + Date.now(),
          type: 'new_order',
          title: `Yangi buyurtma #${order.id} — ${order.customerName}`,
          status: res.ok ? 'delivered' : 'failed',
          error: res.error || null,
          timestamp: new Date().toISOString()
        };
        set({ notificationsLog: [log, ...get().notificationsLog.slice(0, 49)] });
        return res;
      },

      dispatchLowStock: async (product) => {
        if (!get().notifyLowStock) return;
        const creds = get().getCredentialsOverride();
        const res = await notifyLowStock(product, creds);
        const log = {
          id: 'log-' + Date.now(),
          type: 'low_stock',
          title: `Kam qoldiq ogohlantirishi: ${product.name} (${product.stock} ta)`,
          status: res.ok ? 'delivered' : 'failed',
          error: res.error || null,
          timestamp: new Date().toISOString()
        };
        set({ notificationsLog: [log, ...get().notificationsLog.slice(0, 49)] });
        return res;
      },

      dispatchCustomerRegister: async (customer) => {
        if (!get().notifyCustomerRegister) return;
        const creds = get().getCredentialsOverride();
        const res = await notifyCustomerRegister(customer, creds);
        const log = {
          id: 'log-' + Date.now(),
          type: 'customer_register',
          title: `Yangi mijoz ro'yxatdan o'tdi: ${customer.name}`,
          status: res.ok ? 'delivered' : 'failed',
          error: res.error || null,
          timestamp: new Date().toISOString()
        };
        set({ notificationsLog: [log, ...get().notificationsLog.slice(0, 49)] });
        return res;
      },

      notifyOrder: async (order) => {
        return get().dispatchNewOrder(order);
      },

      notifyLowStock: async (product) => {
        return get().dispatchLowStock(product);
      },

      clearLogs: () => {
        set({ notificationsLog: [] });
      }
    }),
    {
      name: 'apexstore-telegram-storage'
    }
  )
);
