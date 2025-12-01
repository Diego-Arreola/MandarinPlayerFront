import Button from '../components/Button';
import Input from '../components/Input';

const JoinGamePage = () => {
  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2 style={{ color: 'var(--secondary-color)' }}>Join a Game</h2>
      <form>
        <Input
          type="text"
          placeholder="Enter Game Code"
          maxLength={5}
          style={{ textTransform: 'uppercase' }}
        />
        <Button type="submit" style={{ width: '100%' }}>Join</Button>
      </form>
    </div>
  );
};

export default JoinGamePage;