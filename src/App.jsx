import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SemesterGpaPage from './pages/SemesterGpaPage';
import OverallCgpaPage from './pages/OverallCgpaPage';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('semester');

  // Ensure document title always strictly reflects branding
  React.useEffect(() => {
    document.title = 'University CGPA Calculator';
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      {/* Top Navbar */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'semester' ? (
          <SemesterGpaPage />
        ) : (
          <OverallCgpaPage />
        )}
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
