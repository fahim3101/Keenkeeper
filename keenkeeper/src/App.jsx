import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FriendsProvider } from './context/FriendsContext';
import { TimelineProvider } from './context/TimelineContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import FriendDetails from './pages/FriendDetails';
import Timeline from './pages/Timeline';
import Stats from './pages/Stats';
import NotFound from './pages/NotFound';

function App() {
  return (
    <FriendsProvider>
      <TimelineProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/friend/:id" element={<FriendDetails />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: '16px',
                background: '#101f18',
                color: '#fbfaf6',
                fontSize: '14px',
                padding: '12px 16px',
                boxShadow: '0 24px 48px -24px rgba(16, 31, 24, 0.55)',
              },
              success: { iconTheme: { primary: '#7aa38b', secondary: '#101f18' } },
              error: { iconTheme: { primary: '#b8463f', secondary: '#fbfaf6' } },
            }}
          />
        </BrowserRouter>
      </TimelineProvider>
    </FriendsProvider>
  );
}

export default App;
