import React, { useState } from 'react';
import { Event } from '../types';
import { Calendar, MapPin, Euro, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTickets } from '../hooks/useTickets';

interface EventCardProps {
  event: Event;
  onAuthRequired: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onAuthRequired }) => {
  const { user } = useAuth();
  const { purchaseTicket } = useTickets();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsLoading(true);
    try {
      await purchaseTicket(event.id, {
        amount: event.price,
        currency: 'EUR',
        event_id: event.id,
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      alert('Erreur lors de l\'achat du ticket. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (showSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Ticket acheté avec succès !</h3>
        <p className="text-green-600">{event.title}</p>
        <p className="text-sm text-green-500 mt-2">Consultez vos tickets dans votre dashboard</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <div className="flex items-center space-x-1 text-sm font-medium text-gray-700">
            <Euro className="h-4 w-4" />
            <span>{event.price}€</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-green-500" />
            <span>{event.available_tickets} places disponibles</span>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isLoading || event.available_tickets === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            event.available_tickets === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isLoading
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Traitement...</span>
            </div>
          ) : event.available_tickets === 0 ? (
            'Complet'
          ) : (
            `Acheter - ${event.price}€`
          )}
        </button>
      </div>
    </div>
  );
};

export default EventCard;