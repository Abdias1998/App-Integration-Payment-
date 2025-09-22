import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Ticket } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTickets = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events (
            id,
            title,
            description,
            date,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const purchaseTicket = async (eventId: string, paymentData: any) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      // Simulate payment processing
      const paymentResult = await simulatePayment(paymentData);
      
      if (paymentResult.status !== 'success') {
        throw new Error('Paiement échoué');
      }

      // Create ticket record
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          user_id: user.id,
          event_id: eventId,
          payment_status: 'completed',
          payment_id: paymentResult.payment_id,
        }])
        .select(`
          *,
          events (
            id,
            title,
            description,
            date,
            price,
            image_url
          )
        `)
        .single();

      if (error) throw error;

      // Update available tickets count
      await supabase.rpc('decrement_available_tickets', { event_id: eventId });

      setTickets(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de l\'achat du ticket');
    }
  };

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    purchaseTicket,
  };
};

// Simulate payment processing
const simulatePayment = async (paymentData: any): Promise<{ status: string; payment_id: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 90% success rate for simulation
  const isSuccess = Math.random() > 0.1;

  return {
    status: isSuccess ? 'success' : 'failed',
    payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
};