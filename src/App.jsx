import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import WalletModal from './components/WalletModal';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';

import HomePage from './pages/HomePage';
import GigsPage from './pages/GigsPage';
import GigDetailPage from './pages/GigDetailPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import MyGigsPage from './pages/MyGigsPage';
import AddGigPage from './pages/AddGigPage';

function MainApp() {
  const [route, setRoute] = useState('home');
  const [routeParams, setRouteParams] = useState({});
  const { activeCategory, setActiveCategory } = useApp();

  // Navigation helper
  const navigate = (newRoute, params = {}) => {
    setRoute(newRoute);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash for clean history and direct linkability
    let hash = `#/${newRoute}`;
    if (params.id) hash += `?id=${params.id}`;
    if (params.user) hash += `?user=${params.user}`;
    if (params.cat) hash += `?cat=${encodeURIComponent(params.cat)}`;
    if (params.search) hash += `?search=${encodeURIComponent(params.search)}`;
    window.history.pushState(null, '', hash);
  };

  // Sync with browser back/forward and initial URL hash
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(2); // remove #/
      if (!hash) {
        setRoute('home');
        setRouteParams({});
        return;
      }

      const [path, queryStr] = hash.split('?');
      const params = {};
      if (queryStr) {
        const searchParams = new URLSearchParams(queryStr);
        for (const [k, v] of searchParams.entries()) {
          params[k] = v;
        }
      }

      setRoute(path || 'home');
      setRouteParams(params);
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // initial on mount

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderCurrentPage = () => {
    switch (route) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'gigs':
        return <GigsPage routeParams={routeParams} navigate={navigate} />;
      case 'gig-detail':
        return <GigDetailPage routeParams={routeParams} navigate={navigate} />;
      case 'profile':
        return <ProfilePage routeParams={routeParams} navigate={navigate} />;
      case 'orders':
        return <OrdersPage navigate={navigate} />;
      case 'my-gigs':
        return <MyGigsPage navigate={navigate} />;
      case 'add-gig':
        return <AddGigPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar with hero transparency only on home top */}
      <Navbar currentRoute={route} navigate={navigate} isHero={route === 'home'} />

      {/* Category Bar shown on non-home pages or home sub-sections */}
      {route !== 'home' && (
        <CategoryBar
          activeCategory={routeParams?.cat || activeCategory}
          onSelectCategory={(cat) => navigate('gigs', { cat })}
        />
      )}

      {/* Main Page Body */}
      <main style={{ flex: 1 }}>{renderCurrentPage()}</main>

      {/* Footer */}
      <Footer navigate={navigate} />

      {/* Global Modals & Notifications */}
      <WalletModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
