import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

/**
 * This component acts as a "layout" for all in-game routes.
 * Its primary job is to manage the game session logic.
 */
const GameLayout = () => {
  const { roomCode } = useParams();

  // CONCEPT: Check if the user is authenticated and allowed in this room.
  // For now, we'll just assume they are. If not, you could redirect:
  // const isAuthenticated = useAuth(); // Your custom auth hook
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  useEffect(() => {
    console.log(`Entering game room: ${roomCode}`);
    // CONCEPT: Establish WebSocket connection here.
    // const socket = connectToGameServer(roomCode);

    // The cleanup function will run when the user leaves the game routes.
    return () => {
      console.log(`Leaving game room: ${roomCode}`);
      // CONCEPT: Disconnect the WebSocket here.
      // socket.disconnect();
    };
  }, [roomCode]);

  // The <Outlet> will render the specific game screen (Lobby, Question, etc.)
  // You could also wrap this in a Context.Provider to share game state.
  return <Outlet />;
};

export default GameLayout;