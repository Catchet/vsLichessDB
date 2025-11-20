import { Chessground } from '@lichess-org/chessground'
import '../assets/chessground.css'
import '../assets/board.css'
import '../assets/style.css'

const config = {};
const ground = Chessground(document.getElementById("cg-wrap")!, config);
