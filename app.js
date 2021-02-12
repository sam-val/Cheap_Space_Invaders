// generate elements, variables, etc:
const FPS = 10;
const width = 15;
const grid = document.querySelector(".grid");
const start_pos = width*width - Math.floor(width/2) + 1;
const INVADERS_WIDTH = 5;
const INVADERS_HEIGHT = 3;
const INVADERS_DELAY = 10; // unit = frames per second
const FIRE_DELAY = 5;
const SHOOT_DELAY = 1;

var invaders_index = 3;
var invaders = new Array(INVADERS_HEIGHT*INVADERS_WIDTH);
invaders.fill(0);
var invaders_velocity = 1;
var shoot = false;
var currentShooter = start_pos; 
var fire_balls = [];
var movement = 0;
var invaders_delay_count = 0;
var fire_delay_count = 0;
var shoot_delay_count = SHOOT_DELAY;

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
    setInvader(0,"..X..");
    setInvader(1,"..X..");
    setInvader(2,"..XX.");


// GAME FUNCTIONS:

function is_invader(x,y) {
    return invaders[y*INVADERS_WIDTH + x];
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

function setInvader(y,line) {
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
    if (++shoot_delay_count > SHOOT_DELAY) {
        // generate a ball infront of shooter:
        
        let ball_pos = currentShooter - width;

        fire_balls.push(ball_pos);
        
        shoot_delay_count = 0;
    }

}

function game() {

    // undraw current shooter and space invaders and fireballs:
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

    // update game:
        // move Invaders:

    moveInvaders();

    moveShooter();
    moveFireBalls();

        // if invader is hit:

        // check winning:

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

