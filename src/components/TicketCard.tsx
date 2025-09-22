import React from 'react';
import { Ticket } from '../types';
import { Calendar, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
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

  if (!ticket.events) {
    return null;
  }

  const event = Array.isArray(ticket.events) ? ticket.events[0] : ticket.events;

  return (
    <div className={`rounded-xl border-2 p-6 transition-all hover:shadow-lg ${getStatusColor(ticket.payment_status)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-gray-600 line-clamp-2">{event.description}</p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {getStatusIcon(ticket.payment_status)}
          <span className={`text-sm font-medium ${
            ticket.payment_status === 'completed' ? 'text-green-700' :
            ticket.payment_status === 'pending' ? 'text-yellow-700' :
            'text-red-700'
          }`}>
            {getStatusText(ticket.payment_status)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span>{formatDate(event.date)}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Acheté le {formatDate(ticket.purchase_date)}
          </div>
          <div className="text-lg font-bold text-gray-900">
            {event.price}€
          </div>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          ID: {ticket.payment_id}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;