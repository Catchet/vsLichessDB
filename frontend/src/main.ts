import { Chessground } from '@lichess-org/chessground'
import type { Api } from "@lichess-org/chessground/api";
import { Chess } from "chess.js";
import { toDests, toColour } from './util.ts'
import '../assets/chessground.css'
import '../assets/board.css'
import '../assets/style.css'


// init();
init("rnbqkbnr/ppppppp1/8/7p/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2");
export function init(fen?: string) {
    let board = vsRandom(document.getElementById("cg-wrap")!, fen);
}


export function vsRandom(boardElem: HTMLElement, fen?: string) {
    const chess = new Chess(fen);
    const cg = Chessground(boardElem, {
        fen: fen,
        turnColor: toColour(chess),
        movable: {
            color: toColour(chess),
            free: false,
            dests: toDests(chess),
        },
    });
    if (toColour(chess) == "black")
        cg.toggleOrientation();
    cg.set({
        movable: {
            events: {
                after: randomPlay(cg, chess, 300, false),
            },
        },
    });
    return cg;
};


export function randomPlay(
  cg: Api,
  chess: Chess,
  delay: number,
  firstMove: boolean,
) {
  return (orig: string, dest: string) => {
    chess.move({ from: orig, to: dest });
    setTimeout(() => {
      const moves = chess.moves({ verbose: true });
      const move = firstMove
        ? moves[0]
        : moves[Math.floor(Math.random() * moves.length)];
      chess.move(move.san);
      cg.move(move.from, move.to);
      cg.set({
        turnColor: toColour(chess),
        movable: {
          color: toColour(chess),
          dests: toDests(chess),
        },
      });
      cg.playPremove();
    }, delay);
  };
}
