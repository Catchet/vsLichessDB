import { Chess } from "chess.js";
import { Chessground } from "@lichess-org/chessground";
import type { Api } from "@lichess-org/chessground/api";
import type { Color } from "@lichess-org/chessground/types";
import { toDests, toColour } from "./util.ts";
import { setupControls } from "./controls.ts";
import { establishOpponent, makeRandomMove, type MoveGenerator } from "./play.ts";
import "../assets/chessground.css";
import "../assets/board.css";
import "../assets/style.css";

export let board: Api;

// init();
init("r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4");
function init(fen?: string) {
  let playSide: Color = "white";
  board = setupBoard(makeRandomMove, fen, playSide);
  setupControls();
}

export function setupBoard(moveGenerator: MoveGenerator, fen?: string, playSide?: Color): Api {
  if (board) board.destroy();
  const [newBoard, newChess] = createBoard(
    document.getElementById("cg-wrap")!,
    fen,
    playSide
  );
  establishOpponent(newBoard, newChess, moveGenerator, playSide);
  return newBoard;
}

export function createBoard(
  boardElem: HTMLElement,
  fen?: string,
  playSide?: Color
): [Api, Chess] {
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
  return [cg, chess];
}
