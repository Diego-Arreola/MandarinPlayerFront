import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { authRepository } from '../api/HttpAuthRepository';
const { registerUser } = authRepository;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await registerUser({ name, email, password });
      // On success, show the success message
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      {isSuccess ? (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--secondary-color)' }}>Sign up successful!</h2>
          <p>Your account has been created. Please log in to continue.</p>
          <Button onClick={() => navigate('/login')}>Accept</Button>
        </div>
      ) : (
        <>
          <h2 style={{ color: 'var(--secondary-color)' }}>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button type="submit" style={{ flex: 1 }}>
                Create Account
              </Button>
              <Button type="button" onClick={() => navigate('/')} variant="secondary" style={{ flex: 1 }}>
                Return
              </Button>
            </div>
          </form>
          <p>
            Already have an account? <Link to="/login" style={{ color: 'var(--secondary-color)' }}>Log In</Link>
          </p>
        </>
      )}
    </div>
  );
};

export default SignUpPage;