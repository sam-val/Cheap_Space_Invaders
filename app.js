// generate elements, variables, etc:
const FPS = 10;
const width = 15;
const grid = document.querySelector(".grid");
const start_pos = width*width - Math.floor(width/2) + 1;
const INVADERS_WIDTH = 7;
const INVADERS_HEIGHT = 5;
const INVADERS_DELAY = 12; // unit = frames per second
const FIRE_DELAY = 5;
const SHOOT_DELAY = 15;


var invaders_index = Math.floor(Math.random() * 8);
var invaders = new Array(INVADERS_HEIGHT*INVADERS_WIDTH);
invaders.fill(0);
var invaders_velocity = 1 ;
var currentShooter = start_pos; 
var fire_balls = [];
var movement = 0;
var invaders_delay_count = 0;
var fire_delay_count = 0;
var shoot_delay_count = SHOOT_DELAY;
var winning = false;
var losing = false;


    // make grid:
for (let i =0; i < width*width; i++) {
    let div = document.createElement("div");
    div.style.width = "50px";
    div.style.height = "50px";
    div.classList.add("bg");
    grid.appendChild(div);
}

    // make our shooter:
grid.children[currentShooter].classList.add("shooter");

    // generate intial invaders:
    // setInvaderLine(0,"XXXXXXX");
    setInvaderLine(0,"XXXXXXX");
    setInvaderLine(1,".XXXXX.");
    setInvaderLine(2,"X.XXX.X");
    setInvaderLine(3,".X.X.X.");
    setInvaderLine(4,"...X...");
    
var intialize_invaders = () => {
    setInvaderLine(0,"XXXXXXX");
    setInvaderLine(1,".XXXXX.");
    setInvaderLine(2,"X.XXX.X");
    setInvaderLine(3,".X.X.X.");
    setInvaderLine(4,"...X...");

    };

// GAME FUNCTIONS:

function is_invader(x,y) {
    return invaders[y*INVADERS_WIDTH + x];
}

function setInvader(x,y,n) {
    invaders[y*INVADERS_WIDTH + x] = n;
}

function edge_invader() {
    rs = false;

    for (let x = 0; x < INVADERS_WIDTH; x++) {
        for (let y = INVADERS_HEIGHT-1; y >= 0; y--) {
            if (is_invader(x,y)) {
                let pos = invaders_index + y*width + x;
                let next_pos = pos + invaders_velocity;
                let left = Math.floor(pos/width) * width;
                let right = left + width - 1;
                if (next_pos > right || next_pos < left) {
                    rs =  true;
                    return rs;
                }
            }
        }
    }

    return rs;
}

function setInvaderLine(y,line) {
    for (let x = 0; x < line.length; x++) {
        if (line[x] === "X") {
            invaders[y*INVADERS_WIDTH + x] = 1;
            let pos = invaders_index + (y*width + x);
            grid.children[pos].classList.add("invader");
        }
    }
}

function moveInvaders() {
    if (++invaders_delay_count > INVADERS_DELAY) {
        if (edge_invader()) {
            invaders_index += width; 
            invaders_velocity *= -1;
        }
        invaders_index += invaders_velocity;
        invaders_delay_count = 0;
    } 
}

function moveFireBalls() {
    if (++fire_delay_count > FIRE_DELAY) {
        for(let i = fire_balls.length - 1; i >= 0; i--) {
            fire_balls[i] = fire_balls[i] - width;

            if (fire_balls[i] < 0) {
                fire_balls.splice(i, 1);
            }        
        }
        fire_delay_count = 0;            
    }
}

function moveShooter(direction) {
    // calc new shooter:
    let new_pos = currentShooter + movement;
    if (new_pos < (width*width) && new_pos >= (width*(width-1)) ) {
        currentShooter = new_pos; 
    }
    movement = 0;
}

function drawShooter() {
}

function fire(e) {
    if (shoot_delay_count > SHOOT_DELAY) {
        // generate a ball infront of shooter:
        
        let ball_pos = currentShooter - width;

        fire_balls.push(ball_pos);
        
        shoot_delay_count = 0;
    }
}
function undraw() {
    grid.children[currentShooter].classList.remove("shooter");

    for (let ball of fire_balls) {
        if (grid.children[ball].classList.contains("laser")){
            grid.children[ball].classList.remove("laser");
        };
    }

    for (let x = 0; x < INVADERS_WIDTH; x++) {
        for (let y = 0; y < INVADERS_HEIGHT; y++) {
            let pos = invaders_index + (y*width + x);
            if (grid.children[pos].classList.contains("invader")) {
                grid.children[pos].classList.remove("invader");
                
            }
        }
    }

}
function reset_game(condition) {
    if (winning) {
        alert("game won!");

    } else if (losing) {
        alert("game over");
    }
    undraw();
    invaders_index = Math.floor(Math.random() * 8);
    invaders_velocity = 1 ;
    invaders.fill(0);
    intialize_invaders();
    console.log(invaders);
    fire_balls.length = 0 ;
    movement = 0;
    currentShooter = start_pos;
    invaders_delay_count = 0;
    fire_delay_count = 0;
    shoot_delay_count = SHOOT_DELAY;
    winning = false;
    losing = false;
}

function game() {

    // check winning:
    
    if (winning || losing) {
        reset_game(); 
    }
    // undraw current shooter and space invaders and fireballs:
    undraw();

    // update game:
        // move Invaders:
    shoot_delay_count++;
    moveInvaders();

    moveShooter();
    moveFireBalls();


        // process collision:
    for (let x = 0; x < INVADERS_WIDTH; x++) {
        for (let y = 0; y < INVADERS_HEIGHT; y++) {
            let pos = invaders_index + (y*width + x);
            if (is_invader(x,y)) {
                if (pos === currentShooter) {
                    losing = true;
                } else {
                    if (fire_balls.includes(pos)) {
                        setInvader(x,y,0);
                        fire_balls.splice(fire_balls.indexOf(pos), 1);
                    }
                }
            }
        }
    }


    // draw...
    grid.children[currentShooter].classList.add("shooter");


    for (let ball of fire_balls) {
        if (!grid.children[ball].classList.contains("laser")){
            grid.children[ball].classList.add("laser");
        };
    }


    for (let x = 0; x < INVADERS_WIDTH; x++) {
        for (let y = 0; y < INVADERS_HEIGHT; y++) {
            let pos = invaders_index + (y*width + x);

            if (is_invader(x,y)) {
                grid.children[pos].classList.add("invader");
            }
        }
    }


    if (invaders.indexOf(1) < 0) {
        winning = true;
    }
    
    setTimeout(game, 1000/FPS);
}

// TAKE AND PROCESS USER INPUT:
    // MOVEMENTS:
document.addEventListener("keydown", (e) => {
    // movement:
    if (e.key == "ArrowLeft") {
        movement = -1;
    } else if (e.key == "ArrowRight") {
        movement = 1;
    }
});

    // FIREEEEEEEEE:
document.addEventListener("keyup", (e) => {
    if (e.key == " ") {
        fire(e);
    }
})

// GAME LOOP:
setTimeout(game, 1000/FPS);

