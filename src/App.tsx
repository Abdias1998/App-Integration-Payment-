import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import EventList from './components/EventList';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import AuthForm from './components/AuthForm';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('events');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentPage === 'auth') {
    return <AuthForm onSuccess={() => setCurrentPage('events')} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return user ? <Dashboard /> : <EventList onAuthRequired={() => setCurrentPage('auth')} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <EventList onAuthRequired={() => setCurrentPage('auth')} />;
      default:
        return <EventList onAuthRequired={() => setCurrentPage('auth')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;