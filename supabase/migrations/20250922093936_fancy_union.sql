/*
  # Schema initial pour l'application TicketHub

  1. Nouvelles tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text, default 'user')
      - `created_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamp)
      - `price` (decimal)
      - `available_tickets` (integer)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `tickets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `event_id` (uuid, references events)
      - `purchase_date` (timestamp)
      - `payment_status` (text)
      - `payment_id` (text)

  2. Sécurité
    - Activation RLS sur toutes les tables
    - Politiques d'accès appropriées pour chaque table

  3. Fonctions utilitaires
    - Fonction pour décrémenter les tickets disponibles
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Table événements
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  available_tickets integer NOT NULL CHECK (available_tickets >= 0),
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table tickets
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  purchase_date timestamptz DEFAULT now(),
  payment_status text DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_id text NOT NULL
);

-- Activation RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Politiques pour users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Politiques pour events (lecture publique, création admin uniquement)
CREATE POLICY "Events are publicly readable"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour tickets
CREATE POLICY "Users can read own tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fonction pour décrémenter les tickets disponibles
CREATE OR REPLACE FUNCTION decrement_available_tickets(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE events 
  SET available_tickets = available_tickets - 1
  WHERE id = event_id AND available_tickets > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Données d'exemple pour les événements
INSERT INTO events (title, description, date, price, available_tickets, image_url) VALUES
(
  'Concert Jazz au Sunset',
  'Une soirée jazz exceptionnelle avec les meilleurs musiciens de la région dans un cadre intimiste et chaleureux.',
  '2024-03-15 20:00:00+01:00',
  45.00,
  150,
  'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'
),
(
  'Festival Rock Summer',
  'Le plus grand festival rock de l''été avec des artistes internationaux sur plusieurs scènes en plein air.',
  '2024-07-20 18:00:00+02:00',
  89.50,
  500,
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'
),
(
  'Spectacle de Danse Contemporaine',
  'Une performance artistique unique mêlant danse contemporaine et nouvelles technologies pour une expérience immersive.',
  '2024-04-10 19:30:00+02:00',
  35.00,
  80,
  'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg'
),
(
  'Conférence Tech Innovation',
  'Découvrez les dernières innovations technologiques avec des experts reconnus et des démonstrations en direct.',
  '2024-05-05 09:00:00+02:00',
  125.00,
  200,
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg'
),
(
  'Théâtre Classique - Molière',
  'Une représentation magistrale d''une pièce de Molière par la troupe théâtrale nationale dans un théâtre historique.',
  '2024-04-25 20:30:00+02:00',
  55.00,
  120,
  'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg'
),
(
  'Marathon de la Ville',
  'Participez au marathon annuel de la ville avec un parcours pittoresque et des prix pour les meilleurs coureurs.',
  '2024-06-01 08:00:00+02:00',
  25.00,
  1000,
  'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg'
);