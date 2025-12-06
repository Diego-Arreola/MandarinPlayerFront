import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import logo from '../assets/MPGeneratedLogo.png'; // Make sure your logo is at src/assets/logo.png

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <img
        src={logo}
        alt="Mandarin Player logo"
        style={{
          width: 'clamp(250px, 50vw, 400px)',
          marginBottom: '20px',
          border: '3px solid black',
          borderRadius: '15px',
          padding: '10px',
        }}
      />

      <Button onClick={() => navigate('/login')} variant="primary">
        Log In
      </Button>
      <Button onClick={() => navigate('/signup')} variant="primary">
        Sign Up
      </Button>
      <Button onClick={() => navigate('/joingame')} variant="primary">
        Join Game
      </Button>
    </div>
  );
};

export default HomePage;