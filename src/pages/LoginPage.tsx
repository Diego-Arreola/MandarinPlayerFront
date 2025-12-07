import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const user = await loginUser({ email, password });
      login(user); // Update the global auth context
      navigate('/welcome'); // Redirect to the welcome page
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2 style={{ color: 'var(--secondary-color)' }}>Log In</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ backgroundColor: 'transparent', border: '1px solid black', color: 'black' }}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ backgroundColor: 'transparent', border: '1px solid black', color: 'black' }}
        />
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Button type="submit" style={{ flex: 1 }}>
            Log In
          </Button>
          <Button type="button" onClick={() => navigate('/')} variant="secondary" style={{ flex: 1 }}>
            Return
          </Button>
        </div>
      </form>
      <p>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--secondary-color)' }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;