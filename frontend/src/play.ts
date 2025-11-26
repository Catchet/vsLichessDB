import type { Api } from "@lichess-org/chessground/api";
import type { Color } from "@lichess-org/chessground/types";
import type { Chess } from "chess.js";
import { toColour, updateBoardState } from "./util";
import { fetchNextMove } from "./net";

export type MoveGenerator = (chess: Chess) => string;

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
        after: makeMoveGenerator(cg, chess, delay),
      },
    },
  });
  if (playSide !== toColour(chess))
    setTimeout(() => {
      const move = moveGenerator(chess);
      updateBoardState(cg, chess, move);
    }, delay);
}

function makeMoveGenerator(cg: Api, chess: Chess, delay: number) {
  return async (orig: string, dest: string) => {
    chess.move({ from: orig, to: dest });
    if (chess.isCheck()) {
      cg.set({
        check: true,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, delay));

    let move;
    try {
      move = await fetchNextMove(chess.fen());
    } catch (err) {
      move = makeRandomMove(chess);
      console.error(err);
    }
    updateBoardState(cg, chess, move);
  };
}

export function makeRandomMove(chess: Chess): string {
  const moves = chess.moves({ verbose: true });
  const move = moves[Math.floor(Math.random() * moves.length)];
  return move.san;
}
