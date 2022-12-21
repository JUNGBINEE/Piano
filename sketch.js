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

let r, g, b;
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
        this.osc = new p5.Oscillator('sine');
    }
    
    show() {
        noFill();
        rect(this.x, this.y, PIANO_WIDTH, windowHeight/8);
    }

    touched(){
        touches.forEach(touch => {
            if ( touch.x < PIANO_WIDTH/3 && // 1/3 of the piano
                touch.x > this.x && 
                touch.x < this.x + PIANO_WIDTH && 
                touch.y > this.y && 
                touch.y < this.y + windowHeight/8
            ) {
                this.osc.start();
                this.osc.amp(slider.value())
                this.osc.freq(WHITE_FREQ[this.note]);
                console.log(this.note, WHITE_FREQ[this.note]);
                this.osc.stop(0.3);
            }
        });
    }
}

class BlackKeyBoard {
    constructor(x, y, note) {
        this.x = x;
        this.y = y;
        this.note=note
        this.osc = new p5.Oscillator('sine');

    }
    
    show() {
        fill('black');
        rect(this.x, this.y, PIANO_WIDTH*2/3, windowHeight/10);
    }

    touched(){
        touches.forEach(touch => {
            if ( touch.x > PIANO_WIDTH/3 && // 1/3 of the piano
                touch.x > this.x &&
                touch.x < this.x + PIANO_WIDTH*2/3 && 
                touch.y > this.y && 
                touch.y < this.y + windowHeight/10
            ) {
                this.osc.start();
                this.osc.amp(slider.value())
                this.osc.freq(BLACK_FREQ[this.note]);
                console.log(this.note, BLACK_FREQ[this.note]);
                this.osc.stop(0.3);
            }
        });
    }

}


function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);

    if(windowWidth < windowHeight) PIANO_WIDTH = windowWidth;
    else PIANO_WIDTH = windowWidth/2;

    getAudioContext().resume();
    createWhiteKeyBoard();
    createBlackKeyBoard();
  
    slider = createSlider ( 0, 1, 0.2, 0.01);
    slider.style('width', '300px');  


}

function touchStarted() {
    blackKeyBoards.forEach(black => {
        black.touched();
    });
    whiteKeyBoards.forEach(white => {
        white.touched();
    });
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

function deviceMoved() {
  r = map(accelerationX, -90, 90, 0, 255);
  g = map(accelerationY, -90, 90, 0, 255);
  b = map(accelerationZ, -90, 90, 0, 255);
  background(r,g,b);
}
