const WHITE_FREQ={
  'C':262,
  'D':294,
  'E':330,
  'F':349,
  'G':392,
  'A':440,
  'B':494,
  'C-high':523
}

const BLACK_FREQ={
  'C#':277,
  'D#':311,
  'F#':370,
  'G#':415,
  'A#':466,
}

let slider;
let whiteKeyBoards = [];
let blackKeyBoards = [];
let osc = new p5.Oscillator('sine');
let PIANO_WIDTH;

function createWhiteKeyBoard() {
  let notes = Object.keys(WHITE_FREQ);
  for (let i = 0; i < 8; i++) {
      let white = new WhiteKeyBoard(0, i* windowHeight/8, notes.shift());
      whiteKeyBoards.push(white);
  }
}

function createBlackKeyBoard() {
  let notes = Object.keys(BLACK_FREQ);
  for (let i = 0; i < 7; i++) {
      if( i!= 2 && i!= 6 ) {
          let black = new BlackKeyBoard(
                  PIANO_WIDTH/3, 
                  windowHeight/16 + windowHeight/80  + i* windowHeight/8,
                  notes.shift()
              );
          blackKeyBoards.push(black);
      }
  }
}

class WhiteKeyBoard {
  constructor(x, y, note) {
      this.x = x;
      this.y = y;
      this.note = note
  }
  
  show() {
      noFill();
      rect(this.x, this.y, PIANO_WIDTH, windowHeight/8);
  }

  clicked(){
      if (mouseX < PIANO_WIDTH/3 && // 1/3 of the piano
          mouseX > this.x && 
          mouseX < this.x + PIANO_WIDTH && 
          mouseY > this.y && 
          mouseY < this.y + windowHeight/8
      ) {
          osc.amp(slider.value())
          osc.freq(WHITE_FREQ[this.note]);
          console.log(this.note, WHITE_FREQ[this.note]);
      }
  }
}

class BlackKeyBoard {
  constructor(x, y, note) {
      this.x = x;
      this.y = y;
      this.note=note
  }
  
  show() {
      fill('black');
      rect(this.x, this.y, PIANO_WIDTH*2/3, windowHeight/10);
  }

  clicked(){
     if ( mouseX > PIANO_WIDTH/3 && // 1/3 of the piano
          mouseX > this.x &&
          mouseX < this.x + PIANO_WIDTH*2/3 && 
          mouseY > this.y && 
          mouseY < this.y + windowHeight/10
      ) {
          osc.amp(slider.value())
          osc.freq(BLACK_FREQ[this.note]);
          console.log(this.note, BLACK_FREQ[this.note]);
      }
  }

}


function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  

  if(windowWidth < windowHeight) PIANO_WIDTH = windowWidth;
  else PIANO_WIDTH = windowWidth/2;

  getAudioContext().resume();
  createWhiteKeyBoard();
  createBlackKeyBoard();

  cnv.mouseClicked(function() {
      osc.start();
      blackKeyBoards.forEach(black => {
          black.clicked();
      });
      whiteKeyBoards.forEach(white => {
          white.clicked();
      });
      osc.stop(0.5);
  });
  
  slider = createSlider (0, 1, 0.2, 0.01);
  slider.style('width', '300px');
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  drawPiano();
  
}

function drawPiano() {
  whiteKeyBoards.forEach(whiteKeyBoard => {
      whiteKeyBoard.show();
  });
  blackKeyBoards.forEach(blackKeyBoard => {
      blackKeyBoard.show();
  });
}