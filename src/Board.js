import { useRef, useState } from 'react';
import { Chess } from 'chess.js';
import axios from 'axios';

import '@emotion/react';
import SettingsIcon from '@mui/icons-material/Settings';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

import { Chessboard } from 'react-chessboard';

import Settings from './Settings';
import openings from './openings';

//const openings = JSON.parse(fs.readFileSync('newcodes.json'))
//const items = Object.keys(openings).map((key, i) => ({id: i, name: key}));

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default function PlayVsDB({ boardWidth }) {
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [arrows, setArrows] = useState([]);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentTimeout, setCurrentTimeout] = useState(undefined);
  const [currentSearch, setCurrentSearch] = useState('');
  const [chosenLine, setChosenLine] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  function getNextMove(fen) {
    return new Promise((resolve, reject) => {
      if (chosenLine.length > 0) {
        //const move_num = Math.ceil((game.history.length - 1) / 2);
        if (game.history().length < chosenLine.length) {
          // TODO: Check if move is allowed (according to chosenLine)
          // TODO: 
          resolve(chosenLine[game.history().length]);
          return;
        }
      }

      axios.get(`https://explorer.lichess.ovh/lichess?variant=standard&fen=${fen}`)
        .then(res => {
          // Choose random move among most popular options
          const total_games = res.data.white + res.data.draws + res.data.black;
          const rnd_move = getRandomInt(total_games);
          let additive = 0;
          let chosen_move = 0;
          for (let i = 0; i < res.data.moves.length; ++i) {
            additive += res.data.moves[i].white + res.data.moves[i].draws + res.data.moves[i].black;
            if (additive > rnd_move) {
              chosen_move = i;
              break;
            }
          }
          console.log("Chose the #%d most popular move", chosen_move + 1)
          console.log("The move has been played in %d%% of all games", 100 * (res.data.moves[chosen_move].white + res.data.moves[chosen_move].draws + res.data.moves[chosen_move].black) / total_games)
          resolve(res.data.moves[chosen_move].san);
        });
    })
  }

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  async function makeDBMove() {
    const nextMove = await getNextMove(game.fen())

    // exit if the game is over
    if (game.game_over() || game.in_draw()) return;

    safeGameMutate((game) => {
      game.move(nextMove);
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to a queen for example simplicity
    });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeDBMove, 200); // TODO: Fix bug where you can move the opponent's pieces
    setCurrentTimeout(newTimeout);
    return true;
  }

  function resetGame() {
    safeGameMutate((game) => {
      game.reset();
    });
    // stop any current timeouts
    clearTimeout(currentTimeout);
  }

  return (
    <div id="main" style={{justifyContent:'center', paddingTop:'2vh', display:'flex', flexDirection:'row'}}>
      <SettingsIcon sx={{fontSize: 60}} onClick={() => {setShowSettings(!showSettings)}}></SettingsIcon>
      <Settings show={showSettings} setShow={setShowSettings} line={chosenLine}></Settings>
      <div>
        <Chessboard
          id="PlayVsDB"
          animationDuration={200}
          boardOrientation={boardOrientation}
          boardWidth={boardWidth}
          customArrows={arrows}
          position={game.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
          }}
          ref={chessboardRef}
        />
        <button
          className="rc-button"
          onClick={() => {
            resetGame();
            makeDBMove();
          }}
        >
          reset
        </button>
        <button
          className="rc-button"
          onClick={() => {
            setBoardOrientation((currentOrientation) => (currentOrientation === 'white' ? 'black' : 'white'));
          }}
        >
          flip board
        </button>
        <button
          className="rc-button"
          onClick={() => {
            safeGameMutate((game) => {
              game.undo();
            });
            // stop any current timeouts
            clearTimeout(currentTimeout);
          }}
        >
          undo
        </button>
        <button
          className="rc-button"
          onClick={() => {
            setArrows([
              ['a3', 'a5'],
              ['g1', 'f3']
            ]);
          }}
        >
          Set Custom Arrows
        </button>
        <ReactSearchAutocomplete
          items={openings}
          onSearch={s => setCurrentSearch(s)}
          onSelect={item => {
            if (item !== undefined) {
              if ('moves' in item) {
                //setChosenLine(item.moves);
                let success = game.load_pgn(item.moves);
                if (success) {
                  //setChosenLine(currentSearch);
                  setChosenLine(game.history());
                  resetGame();
                } else {
                  alert('Could not parse PGN.');
                }
              } else {
                console.warn("Not undefined but has no moves");
                console.log(item);
              }
            }
            else {
              console.log("Undefined!!");
              console.log(item);
              console.log(currentSearch);
              let success = game.load_pgn(currentSearch);
              if (success) {
                //setChosenLine(currentSearch);
                setChosenLine(game.history());
                //resetGame();  // TODO: Uncomment
              } else {
                alert('Could not parse PGN.');
              }
            }
          }}
          formatResult={(item) => {
            console.log(item);
            return (
              <div className="result-wrapper">
                <span className="result-span">{item.name}</span>
                <span className="result-span" style={{fontSize: 10}}>{item.moves}</span>
              </div>
            );
          }}
          showIcon={false}
          styling={{
            height: "34px",
            borderRadius: "4px",
            backgroundColor: "white",
            fontSize: "16px",
            fontFamily: "Arial",
            iconColor: "gray",
            zIndex: 2,
          }}
          autoFocus={false}
        />
      </div>
      <div>
      <p>{game.history().map((s, i) => {
          if (i % 2 === 0)
            return ((i / 2) + 1) + ". " + s + "\t";
          return <span key={i}>{s}<br/></span>;
        })}</p>
      </div>
    </div>
  );
}