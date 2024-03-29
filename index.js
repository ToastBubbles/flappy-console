let snakemode = false,
  points = 0,
  lost = false,
  height = 20,
  intervals = 18,
  width = 162,
  pipeBod = " ░▒▓█▓▒░ ",
  pipeHead = "░▒▓███▓▒░",
  space = "         ",
  lastCell = 2,
  sliced = 0,
  h = height / 2,
  x = 8,
  frametoggle = 0,
  onPipe = false;

function rand() {
  let min = 3,
    max = 14,
    rand = Math.round(Math.random() * (max - min) + min);
  return rand;
}

function addDraw(bg) {
  let newbg = bg.split("\n"),
    newArr = [],
    prog = 0,
    pos = rand();
  if (lastCell > 0) {
    newbg.forEach((lin) => {
      newArr.push((lin += space));
    });
    lastCell -= 1;
  } else {
    newbg.forEach((lin) => {
      if (prog < pos) {
        newArr.push((lin += pipeBod));
      } else if (prog == pos) {
        newArr.push((lin += pipeHead));
      } else if (prog > pos && prog < pos + 5) {
        newArr.push((lin += space));
      } else if (prog == pos + 5) {
        newArr.push((lin += pipeHead));
      } else {
        newArr.push((lin += pipeBod));
      }
      lastCell = 2;
      prog++;
    });
  }
  return newArr.join("\n");
}
function start() {
  let positions = [rand(), rand(), rand(), rand(), rand(), rand(), rand()];
  curPos = 0;
  prog = 0;
  lines = "";
  while (prog < height) {
    let line = "";
    let i = 0;
    let pipe = 0;
    while (i < intervals) {
      if (i % 3 == 0 && i != 0) {
        curPos = positions[pipe];
        if (prog < curPos) {
          line += pipeBod;
        } else if (prog == curPos) {
          line += pipeHead;
        } else if (prog > curPos && prog < curPos + 5) {
          line += space;
        } else if (prog == curPos + 5) {
          line += pipeHead;
        } else {
          line += pipeBod;
        }
        pipe++;
        lastCell = 2;
      } else {
        line += space;
        lastCell -= 1;
      }
      i++;
    }
    line += "\n";
    lines += line;
    prog++;
  }
  movebg(lines);
}

function movebg(bg) {
  bgArr = bg.split("\n");
  let newArr = [];

  for (let line of bgArr) {
    newArr.push(line.slice(1));
  }
  sliced++;
  bg = newArr.join("\n");
  if (sliced < 9) {
  } else {
    sliced = 0;

    bg = addDraw(bg);
  }

  addBird(bg);
}

function setCharAt(str, index, chr, losable = false) {
  if (str.charAt(index) != " ") {
    if (losable) {
      lost = true;
    }
  }
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function addBird(bg) {
  frametoggle++;

  `
     ,---.
    [   O '>
     """""
  `;

  let birdbg = setCharAt(bg, width * h + h + x - h * sliced, "@", true);
  let birdpointbg = pointCheck(birdbg);
  if (!lost) {
    render(birdpointbg);
    setTimeout(() => {
      if (frametoggle == 4) {
        h++;
        frametoggle = 0;
      }
      if (snakemode) {
        movebg(birdbg);
      } else {
        movebg(bg);
      }
    }, 75);
  } else {
    uLost();
  }
}
function render(str) {
  let ystr = str.replaceAll("@", "\x1b[93m@\x1b[32m");
  let finalStr = `\x1b[32m${ystr}\x1b[0m`;
  console.log(finalStr);
}
function uLost() {
  console.log(`game over, your score was ${points}`);
  process.exit();
}

function pointCheck(bg) {
  let state = onPipe;
  if (bg.charAt(x) != " ") {
    onPipe = true;
  } else {
    onPipe = false;
  }
  if (onPipe == false && state != onPipe) {
    points++;
  }
  let pointbg = setCharAt(bg, width / 2, points.toString());
  return pointbg;
}

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  } else if (key.name === "space") {
    h -= 2;
  }
});

start();
