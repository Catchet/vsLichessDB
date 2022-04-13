import './App.css';
import Board from "./Board"

function App() {
  return (
    <div>
      <Board boardWidth={Math.min(window.innerHeight / 1.2, window.innerWidth / 1.2)}></Board>
    </div>
  );
}

export default App;
