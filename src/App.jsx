import React from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
  useParams
} from 'react-router-dom';
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

// Adapter wrappers to read params/query for components
function GigsWrapper({ navigate }) {
  const [searchParams] = useSearchParams();
  const routeParams = {
    cat: searchParams.get('cat') || '',
    search: searchParams.get('search') || '',
    favOnly: searchParams.get('favOnly') === 'true'
  };
  return <GigsPage routeParams={routeParams} navigate={navigate} />;
}

function GigDetailWrapper({ navigate }) {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const routeParams = {
    id: id || searchParams.get('id')
  };
  return <GigDetailPage routeParams={routeParams} navigate={navigate} />;
}

function ProfileWrapper({ navigate }) {
  const [searchParams] = useSearchParams();
  const { user } = useParams();
  const routeParams = {
    user: user || searchParams.get('user')
  };
  return <ProfilePage routeParams={routeParams} navigate={navigate} />;
}

function MainApp() {
  const rrdNavigate = useNavigate();
  const location = useLocation();
  const { activeCategory } = useApp();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  // Unified navigate helper ensuring backwards compatibility with existing signature:
  // navigate(route, params) or direct path
  const navigate = (to, params = {}) => {
    if (typeof to !== 'string') return;

    // Handle relative or slash routes
    let path = to.startsWith('/') ? to : `/${to === 'home' ? '' : to}`;

    const query = new URLSearchParams();
    if (params.id) query.set('id', params.id);
    if (params.user) query.set('user', params.user);
    if (params.cat) query.set('cat', params.cat);
    if (params.search) query.set('search', params.search);
    if (params.favOnly) query.set('favOnly', 'true');

    const queryString = query.toString();
    const targetUrl = queryString ? `${path}?${queryString}` : path;
    rrdNavigate(targetUrl);
  };

  // Determine current active route identifier for Navbar styling
  const currentRoute =
    location.pathname === '/'
      ? 'home'
      : location.pathname.replace(/^\//, '');

  const isHero = location.pathname === '/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar with hero transparency on home page */}
      <Navbar currentRoute={currentRoute} navigate={navigate} isHero={isHero} />

      {/* Category Bar shown on non-home pages */}
      {!isHero && (
        <CategoryBar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => navigate('gigs', { cat })}
        />
      )}

      {/* Main Page Routes */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage navigate={navigate} />} />
          <Route path="/home" element={<HomePage navigate={navigate} />} />
          <Route path="/gigs" element={<GigsWrapper navigate={navigate} />} />
          <Route path="/gig-detail" element={<GigDetailWrapper navigate={navigate} />} />
          <Route path="/gig-detail/:id" element={<GigDetailWrapper navigate={navigate} />} />
          <Route path="/profile" element={<ProfileWrapper navigate={navigate} />} />
          <Route path="/profile/:user" element={<ProfileWrapper navigate={navigate} />} />
          <Route path="/orders" element={<OrdersPage navigate={navigate} />} />
          <Route path="/my-gigs" element={<MyGigsPage navigate={navigate} />} />
          <Route path="/add-gig" element={<AddGigPage navigate={navigate} />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage navigate={navigate} />} />
        </Routes>
      </main>

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
