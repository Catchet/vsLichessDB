import { Chessground } from "@lichess-org/chessground";
import type { Api } from "@lichess-org/chessground/api";
import { Chess } from "chess.js";
import { toDests, toColour } from "./util.ts";
import "../assets/chessground.css";
import "../assets/board.css";
import "../assets/style.css";

let playSide: "white" | "black" = "white";

// init();
init("rnbqkbnr/ppppppp1/8/7p/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2");
export function init(fen?: string) {
  let board = vsRandom(document.getElementById("cg-wrap")!, fen, playSide);
}

export function vsRandom(boardElem: HTMLElement, fen?: string, playSide?: "white" | "black") {
  const delay = 300;
  const firstMove = false;
  const chess = new Chess(fen);
  const cg = Chessground(boardElem, {
    fen: fen,
    turnColor: toColour(chess),
    orientation: playSide,
    check: chess.isCheck(),
    movable: {
      color: playSide,
      free: false,
      dests: toDests(chess),
    },
    highlight: {
      check: true,
    },
  });
  cg.set({
    movable: {
      events: {
        after: randomPlay(cg, chess, delay, firstMove),
      },
    },
  });
  if (playSide !== toColour(chess))
    setTimeout(() => makeRandomMove(cg, chess, firstMove), delay);
  return cg;
}

export function randomPlay(
  cg: Api,
  chess: Chess,
  delay: number,
  firstMove: boolean
) {
  return (orig: string, dest: string) => {
    chess.move({ from: orig, to: dest });
    if (chess.isCheck()) {
      cg.set({
        check: true,
      });
    }
    setTimeout(() => makeRandomMove(cg, chess, firstMove), delay);
  };
}

export function makeRandomMove(cg: Api, chess: Chess, firstMove: boolean) {
  const moves = chess.moves({ verbose: true });
  const move = firstMove
    ? moves[0]
    : moves[Math.floor(Math.random() * moves.length)];
  chess.move(move.san);
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
