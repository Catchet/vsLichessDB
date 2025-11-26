import type { Api } from "@lichess-org/chessground/api";
import type { Color } from "@lichess-org/chessground/types";
import type { Chess, Move } from "chess.js";
import { toColour, updateBoardState } from "./util";

export type MoveGenerator = (chess: Chess) => Move;

export function establishOpponent(
  cg: Api,
  chess: Chess,
  moveGenerator: MoveGenerator,
  playSide?: Color
) {
  const delay = 300;
  cg.set({
    movable: {
      events: {
        after: makeMoveGenerator(cg, chess, moveGenerator, delay),
      },
    },
  });
  if (playSide !== toColour(chess))
    setTimeout(() => {
      const move = moveGenerator(chess);
      updateBoardState(cg, chess, move);
    }, delay);
}

function makeMoveGenerator(
  cg: Api,
  chess: Chess,
  moveGenerator: MoveGenerator,
  delay: number
) {
  return (orig: string, dest: string) => {
    chess.move({ from: orig, to: dest });
    if (chess.isCheck()) {
      cg.set({
        check: true,
      });
    }
    setTimeout(() => {
      const move = moveGenerator(chess);
      updateBoardState(cg, chess, move);
    }, delay);
  };
}

export function makeRandomMove(chess: Chess): Move {
  const moves = chess.moves({ verbose: true });
  const move = moves[Math.floor(Math.random() * moves.length)];
  return move;
}
