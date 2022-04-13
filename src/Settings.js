//import { positions } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';

function moveArrayToString(moves) {
    return moves.map((s, i) => {
      if (i % 2 === 0)
        return ((i / 2) + 1) + ". " + s + "\t";
      return s + " ";
    });
    /*
    game.history().map((s, i) => {
      if (i % 2 === 0)
        return ((i / 2) + 1) + ". " + s + "\t";
      return <span key={i}>{s}<br/></span>;
    })*/
  }

export default function Settings({ show, setShow, line }) {

  if (show)
    return (
      <div id="settings" style={{zIndex: 10000, position: 'absolute', fontSize: 40, backgroundColor: 'white', padding: '0px 80px', maxWidth:400}}>
        <CloseIcon style={{position:'absolute', right:0, top:0, fontSize:30}} onClick={e => setShow(false)}/>
        <p>{moveArrayToString(line)}</p>
        <input type='text'></input>
      </div>
    );
  return null;
}