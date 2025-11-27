import type { Color } from "@lichess-org/chessground/types";
import { board, setupBoard } from "./main";

export function setupControls() {
  document.getElementById("toggle-side-btn")!.addEventListener("click", () => {
    board.toggleOrientation();
  });

  document.getElementById("start-btn")!.addEventListener("click", () => {
    let fen = getEnteredFen();
    let playSide: Color = getChosenSide();
    setupBoard(fen || undefined, playSide);
  });
}

export function getEnteredFen(): string {
  return (document.getElementById("fen-input") as HTMLInputElement).value;
}

export function getChosenSide(): Color {
  return (
    document.querySelector('input[name="side"]:checked') as HTMLInputElement
  ).value === "black"
    ? "black"
    : "white";
}
