const fs = require('fs');

let c = fs.readFileSync('codes.json');
let j = JSON.parse(c);

console.log(j["rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1"].name)

let n = []

Object.entries(j).forEach(e => {
  //console.log(e);
  //n[e[1].name] = {'eco': e[1].eco, 'moves': e[1].moves};
  /*
  [
    {
      id:0,
      moves:'sda',
      name:'bafa'
    },
    {
      id:1,

    }
  ]*/
  n.push({id:n.length, name:e[1].name, moves:e[1].moves, eco:e[1].eco})
});

fs.writeFileSync('newcodes2.json', JSON.stringify(n));

/*j.map(e => {

})*/