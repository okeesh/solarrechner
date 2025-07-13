import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface Profile {
  api_key: string;
}

interface Lead {
  id: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
  potential_savings: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoadingProfile(true);
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`api_key`)
            .eq('id', user.id)
            .single();

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            setProfile(data);
          }
        } catch (error: any) {
          console.error('Error fetching profile:', error.message);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    const fetchLeads = async () => {
      if (user) {
        try {
          setLoadingLeads(true);
          const { data, error } = await supabase
            .from('leads')
            .select(`id, created_at, customer_name, customer_email, potential_savings`)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (data) setLeads(data);
        } catch (error: any) {
          console.error('Error fetching leads:', error.message);
        } finally {
          setLoadingLeads(false);
        }
      }
    };

    fetchProfile();
    fetchLeads();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const copyToClipboard = () => {
    if (profile?.api_key) {
      navigator.clipboard.writeText(profile.api_key);
      alert('API Key copied to clipboard!');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div>
          <span>Willkommen, {user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="api-key-section">
          <h2>Ihr API-Schlüssel</h2>
          <p>Verwenden Sie diesen Schlüssel, um den Solarrechner in Ihre Webseite einzubetten.</p>
          {loadingProfile ? (
            <p>API-Schlüssel wird geladen...</p>
          ) : profile?.api_key ? (
            <div className="api-key-display">
              <code>{profile.api_key}</code>
              <button onClick={copyToClipboard}>Kopieren</button>
            </div>
          ) : (
            <p>Für Ihr Profil konnte kein API-Schlüssel gefunden werden.</p>
          )}
        </section>

        <section className="leads-section">
          <h2>Ihre Leads</h2>
          {loadingLeads ? (
            <p>Leads werden geladen...</p>
          ) : leads.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Name</th>
                  <th>E-Mail</th>
                  <th>Potenzielle Ersparnis</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td>{lead.customer_name}</td>
                    <td>{lead.customer_email}</td>
                    <td>€{lead.potential_savings.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Sie haben noch keine Leads generiert.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard; 