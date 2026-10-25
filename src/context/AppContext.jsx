import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_GIGS, INITIAL_USERS, INITIAL_ORDERS } from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_PREFIX = 'encrow_';

function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function AppProvider({ children }) {
  // Current user state
  const [currentUser, setCurrentUser] = useState(() => getStorage('currentUser', null));

  // Registered users
  const [users, setUsers] = useState(() => {
    const stored = getStorage('users', null);
    if (stored && stored.length > 0) return stored;
    return INITIAL_USERS;
  });

  // Gigs catalog
  const [gigs, setGigs] = useState(() => {
    const stored = getStorage('gigs', null);
    if (stored && stored.length > 0) return stored;
    return INITIAL_GIGS;
  });

  // Escrow Orders
  const [orders, setOrders] = useState(() => {
    const stored = getStorage('orders', null);
    if (stored && stored.length > 0) return stored;
    return INITIAL_ORDERS;
  });

  // Wishlist / Favorites
  const [favorites, setFavorites] = useState(() => getStorage('favorites', []));

  // Global UI states
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Sync to local storage
  useEffect(() => {
    setStorage('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStorage('users', users);
  }, [users]);

  useEffect(() => {
    setStorage('gigs', gigs);
  }, [gigs]);

  useEffect(() => {
    setStorage('orders', orders);
  }, [orders]);

  useEffect(() => {
    setStorage('favorites', favorites);
  }, [favorites]);

  // Toast notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth actions
  const login = (username, password) => {
    const found = users.find(
      (u) =>
        (u.username?.toLowerCase() === username.toLowerCase() ||
          u.email?.toLowerCase() === username.toLowerCase()) &&
        u.password === password
    );

    if (found) {
      setCurrentUser(found);
      setAuthModalOpen(false);
      addToast(`Welcome back, ${found.username}! 👋`);
      return { success: true };
    }

    return { success: false, message: 'Invalid username or password' };
  };

  const quickDemoLogin = (type = 'buyer') => {
    const targetUser = users.find((u) => (type === 'seller' ? u.isSeller : !u.isSeller)) || users[0];
    setCurrentUser(targetUser);
    setAuthModalOpen(false);
    addToast(`Signed in as ${targetUser.username} (${type})`);
  };

  const register = (userData) => {
    const exists = users.find(
      (u) =>
        u.username?.toLowerCase() === userData.username.toLowerCase() ||
        u.email?.toLowerCase() === userData.email.toLowerCase()
    );

    if (exists) {
      return { success: false, message: 'Username or email already in use.' };
    }

    const newUser = {
      _id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      country: userData.country || 'India',
      phone: userData.phone || '',
      desc: userData.desc || 'Passionate professional on Trust+.',
      isSeller: !!userData.isSeller,
      walletBalance: 10000, // Starter credits bonus
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      skills: userData.isSeller ? ['Communication', 'Consulting'] : [],
      rating: 5.0
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    addToast(`Account created! You received ₹10,000 starter wallet credit 🎉`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('You have been signed out.');
  };

  // Wallet operations
  const topUpWallet = (amount) => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) return false;

    if (!currentUser) {
      setAuthModalOpen(true);
      return false;
    }

    const updatedUser = {
      ...currentUser,
      walletBalance: (currentUser.walletBalance || 0) + num
    };

    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id || u.username === updatedUser.username ? updatedUser : u))
    );

    setWalletModalOpen(false);
    addToast(`₹${num.toLocaleString('en-IN')} added to your wallet! 💰`);
    return true;
  };

  // Escrow Orders
  const createOrder = (gig, packageType = 'Basic', packageInfo = null) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      addToast('Please sign in or join to place an order', 'warning');
      return { success: false, reason: 'auth' };
    }

    const price = packageInfo?.price || gig.price;

    if ((currentUser.walletBalance || 0) < price) {
      addToast(
        `Insufficient balance (Needs ₹${price.toLocaleString('en-IN')}). Please top up your wallet.`,
        'error'
      );
      setWalletModalOpen(true);
      return { success: false, reason: 'balance' };
    }

    // Deduct from wallet and secure in Escrow
    const updatedUser = {
      ...currentUser,
      walletBalance: currentUser.walletBalance - price
    };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id || u.username === updatedUser.username ? updatedUser : u))
    );

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      gigId: gig.id,
      gigTitle: gig.title,
      gigCover: gig.img || gig.cover,
      sellerUsername: gig.username,
      buyerUsername: currentUser.username,
      packageType: packageType,
      price: price,
      status: 'Escrow Funded - In Progress',
      orderedAt: new Date().toISOString().split('T')[0],
      deliveryDue: packageInfo?.delivery || '3 days',
      escrowLocked: true
    };

    setOrders((prev) => [newOrder, ...prev]);
    addToast(
      `🎉 Order placed! ₹${price.toLocaleString('en-IN')} locked safely in Trust+ Escrow.`,
      'success'
    );
    return { success: true, order: newOrder };
  };

  const completeOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Completed',
            escrowLocked: false,
            completedAt: new Date().toISOString().split('T')[0]
          };
        }
        return o;
      })
    );
    addToast(`Order ${orderId} marked complete! Escrow funds released to the seller. 🤝`);
  };

  // Gig management
  const addGig = (newGigData) => {
    const newGig = {
      id: Date.now().toString().slice(-4),
      username: currentUser?.username || 'freelancer',
      rate: 'Level 1 Seller',
      starNumber: 1,
      totalStars: 5,
      ...newGigData
    };

    setGigs((prev) => [newGig, ...prev]);
    addToast('Your gig is now published and visible to buyers! 🚀');
    return newGig;
  };

  const deleteGig = (gigId) => {
    setGigs((prev) => prev.filter((g) => g.id !== gigId));
    addToast('Gig removed successfully.');
  };

  // Wishlist toggle
  const toggleFavorite = (gigId) => {
    setFavorites((prev) => {
      const exists = prev.includes(gigId);
      if (exists) {
        addToast('Removed from saved list', 'info');
        return prev.filter((id) => id !== gigId);
      } else {
        addToast('Saved to your favorites! ❤️');
        return [...prev, gigId];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        gigs,
        orders,
        favorites,
        walletModalOpen,
        setWalletModalOpen,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        login,
        quickDemoLogin,
        register,
        logout,
        topUpWallet,
        createOrder,
        completeOrder,
        addGig,
        deleteGig,
        toggleFavorite
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
