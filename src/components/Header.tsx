import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Ticket, Calendar } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentPage('events');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ticket className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TicketHub</h1>
          </div>

          <nav className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentPage('events')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 'events'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Événements</span>
            </button>

            {user && (
              <>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Mes Tickets</span>
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Bonjour, {user.name}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </>
            )}

            {!user && (
              <button
                onClick={() => setCurrentPage('auth')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Connexion
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;