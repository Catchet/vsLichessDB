import type { Color } from "@lichess-org/chessground/types";
import { board, setupBoard } from "./main";

export function setupControls() {
  document.getElementById("toggle-side-btn")!.addEventListener("click", () => {
    board.toggleOrientation();
  });

  document.getElementById("start-btn")!.addEventListener("click", () => {
    let fen = "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4";
    let playSide: Color = getChosenSide();
    setupBoard(fen, playSide);
  });
}

export function getChosenSide(): Color {
  return (
    document.querySelector('input[name="side"]:checked') as HTMLInputElement
  ).value === "black"
    ? "black"
    : "white";
}
