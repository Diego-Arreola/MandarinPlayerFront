import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ color: 'var(--secondary-color)' }}>¡Hola, {user?.name}!</h2>

      <div style={{ display: 'flex', gap: '20px', margin: '30px 0' }}>
        <Button onClick={() => navigate('/topics')} style={{ flex: 1 }}>
          Ver temas
        </Button>
        <Button onClick={() => navigate('/joingame')} variant="secondary" style={{ flex: 1 }}>
          Join game
        </Button>
      </div>

      <div>
        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          Past Game Results
        </h3>
        {/* This section can be populated with data later */}
        <p>No recent games.</p>
      </div>

      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <Button onClick={handleLogout} variant="secondary">Log Out</Button>
      </div>
    </div>
  );
};

export default WelcomePage;