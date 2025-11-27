import type { Api } from "@lichess-org/chessground/api";
import type { Color } from "@lichess-org/chessground/types";
import type { Chess } from "chess.js";
import { toColour, updateBoardState } from "./util";
import { fetchNextMove } from "./net";

export type MoveGenerator = (chess: Chess) => string;

export async function establishOpponent(
  cg: Api,
  chess: Chess,
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
  if (playSide !== toColour(chess)) {
    await makeDelayedMove(cg, chess, delay);
  }
}

function makeMoveGenerator(cg: Api, chess: Chess, delay: number) {
  return async (orig: string, dest: string) => {
    chess.move({ from: orig, to: dest });
    if (chess.isCheck()) {
      cg.set({
        check: true,
      });
    }
    await makeDelayedMove(cg, chess, delay);
  };
}

async function makeDelayedMove(cg: Api, chess: Chess, delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  let move;
  try {
    move = await fetchNextMove(chess.fen());
  } catch (err) {
    move = makeRandomMove(chess);
    console.error(err);
  }
  updateBoardState(cg, chess, move);
}

export function makeRandomMove(chess: Chess): string {
  const moves = chess.moves({ verbose: true });
  const move = moves[Math.floor(Math.random() * moves.length)];
  return move.san;
}
