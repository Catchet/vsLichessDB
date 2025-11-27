import axios from "axios";

interface NextMoveResponse {
  next_move: string;
}

export async function fetchNextMove(fen: string): Promise<string> {
  const encodedFen = encodeURIComponent(fen);
  const response = await axios.get<NextMoveResponse>(
    `/chess/next-move?fen=${encodedFen}`
  );
  return response.data.next_move;
}
