import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ color: 'var(--primary-color)', fontSize: '5rem' }}>404</h1>
      <h2 style={{ color: 'var(--secondary-color)' }}>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" style={{ color: 'var(--secondary-color)', textDecoration: 'underline' }}>
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
