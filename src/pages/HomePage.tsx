import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import logo from '../assets/mandarino.png';

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
      <h1
        style={{
          fontFamily: "'Candara', sans-serif",
          fontSize: 'clamp(40px, 10vw, 70px)',
          color: 'orange',
          textShadow:
            '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 2px 2px 6px rgba(0,0,0,0.2)',
          margin: 0,
          padding: 0,
          textAlign: 'center',
        }}
      >
        Mandarin Player
      </h1>
      <img
        src={logo}
        alt="Mandarin Player logo"
        style={{
          width: 'clamp(250px, 20vw, 400px)',
          // marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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