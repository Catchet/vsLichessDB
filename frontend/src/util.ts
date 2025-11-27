import { Chess, SQUARES } from "chess.js";
import type { Color, Key } from "@lichess-org/chessground/types";
import type { Api } from "@lichess-org/chessground/api";

export function toDests(chess: Chess): Map<Key, Key[]> {
  const dests = new Map();
  SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length)
      dests.set(
        s,
        ms.map((m) => m.to)
      );
  });
  return dests;
}

export function toColour(chess: Chess): Color {
  return chess.turn() === "w" ? "white" : "black";
}

export function updateBoardState(cg: Api, chess: Chess, moveStr: string) {
  const move = chess.move(moveStr);
  cg.move(move.from, move.to);
  cg.set({
    turnColor: toColour(chess),
    check: chess.isCheck(),
    movable: {
      color: toColour(chess),
      dests: toDests(chess),
    },
  });
  cg.playPremove();
}
