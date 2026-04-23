// const {PlanningGraph} = import('alg.js');

// class RocketProblemTemplate {


// };


// class RocketProblemState {

//     addA

// };

// class RocketState {


// };

// // in
// const rocketGraph = new PlanningGraph(initialCond, actions, goal);
// rocketGraph.generate();



/**
 * 
 * 
 * each problem should contain:
 *   --> a list of state variables which are enums
 *   --> a list of parameter classes (eg: City, Plane)
 *   --> a list of actions possible (eg: Move) which includes NoOp
 * 
 * 
 * 
 * Each level should be a map mapping the state variable to a list of the possible state values
 * 
 * ok so each action will affect a given number of conditions so basically : 
 *  --> params : a list of parameter classes whose objects must be passed into apply
 *  --> apply(**paramObjs) : returns an action node w/appropiate edges 
 *  --> preconditions : a map of { state variable : list[values permitted] }
 * 
 * 
 * creating an action level:
 *  --> for each action
 *     --> for each combination of paramsObjs possible
 *       --> add the new action node
 *  --> add noOps
 *      --> for each proposition add a NoOp action w/appropriate edge
 * 
 * creating a proposition level:
 *  --> for each action node
 *      --> if the postcondition does not exist, add the postcondition node w/appropriate edge
 *          otherwise, simply add an edge to the postcondition
 * 
 * 
 */

class Node {
    constructor(r, g, b, x, y, text) {
        this.r=r;
        this.g=g;
        this.b=b;
        this.x=x;
        this.y=y;
        this.text=text;
    }

    draw(ctx, r) { 
        ctx.fillStyle=`rgb(${this.r},${this.g},${this.b})`;
        ctx.moveTo(this.x,this.y);
        ctx.arc(this.x, this.y, r, 0, 3*3.14159);
        ctx.fill();
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.strokeText(this.text,this.x-r*.8,this.y+r/4,r*1.5);

    }
}

function drawEdge(r, g, b, node1, node2, ctx,rad) {
   const x1=node1.x;
   const x2=node2.x;
   const y1=node1.y-rad;
   const y2=node2.y+rad;
   ctx.strokeStyle=`rgb(${r},${g},${b})`;
   ctx.beginPath();
   ctx.moveTo(x1,y1);
   ctx.lineTo(x2,y2);
   ctx.stroke();
}


const canvas = document.querySelector(".GraphCanvas");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext("2d");

const bottomPropY=canvasHeight*.8;
const bottomActY=canvasHeight*.65;
const middlePropY=canvasHeight*.5;
const middleActY=canvasHeight*.35;
const topPropY=canvasHeight*.2;
const radius=canvasHeight/20;
const bottomPropLevel = [
    new Node(20,200,20,canvasWidth/4,bottomPropY,"clean"),
    new Node(20,200,20,2*canvasWidth/4,bottomPropY,"garb"),
    new Node(20,200,20,3*canvasWidth/4,bottomPropY,"quiet"),
]
const bottomActLevel = [
    new Node(150,0,150,canvasWidth/5,bottomActY,"cook"),
    new Node(150,0,150,2*canvasWidth/5,bottomActY,"wrap"),
    new Node(150,0,150,3*canvasWidth/5,bottomActY,"carry"),
    new Node(150,0,150,4*canvasWidth/5,bottomActY,"dolly")
]
const middlePropLevel = [
    new Node(20,200,20,canvasWidth/9,middlePropY,"clean"),
    new Node(20,200,20,2*canvasWidth/9,middlePropY,"garb"),
    new Node(20,200,20,3*canvasWidth/9,middlePropY,"quiet"),
    new Node(20,200,20,4*canvasWidth/9,middlePropY,"dinner"),
    new Node(20,200,20,5*canvasWidth/9,middlePropY,"present"),
    new Node(150,150,150,6*canvasWidth/9,middlePropY,"not garb"),
    new Node(150,150,150,7*canvasWidth/9,middlePropY,"not clean"),
    new Node(150,150,150,8*canvasWidth/9,middlePropY,"not quiet"),
]
const middleActLevel = [
    new Node(150,0,150,canvasWidth/5,middleActY,"cook"),
    new Node(150,0,150,2*canvasWidth/5,middleActY,"wrap"),
    new Node(150,0,150,3*canvasWidth/5,middleActY,"carry"),
    new Node(150,0,150,4*canvasWidth/5,middleActY,"dolly")
]
const finalPropLevel=[
    new Node(20,200,20,canvasWidth/9,topPropY,"clean"),
    new Node(20,200,20,2*canvasWidth/9,topPropY,"garb"),
    new Node(20,200,20,3*canvasWidth/9,topPropY,"quiet"),
    new Node(20,200,20,4*canvasWidth/9,topPropY,"dinner"),
    new Node(20,200,20,5*canvasWidth/9,topPropY,"present"),
    new Node(150,150,150,6*canvasWidth/9,topPropY,"not garb"),
    new Node(150,150,150,7*canvasWidth/9,topPropY,"not clean"),
    new Node(150,150,150,8*canvasWidth/9,topPropY,"not quiet")
]

ctx.font=`${canvasWidth/50}px Arial`
bottomPropLevel.forEach((node)=>node.draw(ctx,radius));
ctx.strokeStyle="white"

let state=0;
let showingNoOps=false;

let checkGoalState=0;

const expl=document.getElementById('explanation')
expl.innerHTML="We start with `clean`, `garbage`, and 'quiet' as true. The possible actions to be taken are 'cook', 'wrap', 'carry', and 'dolly' to reach the final goal of 'not garb', 'dinner', and 'present'";


const nextBtn=document.getElementById('Next-Button')
const noOpToggle=document.getElementById('No-Op-Button');
nextBtn.addEventListener('click',advanceState);
noOpToggle.addEventListener('click',()=>{showingNoOps=!showingNoOps;if(showingNoOps)noOpToggle.innerHTML='Hide No-Ops';else noOpToggle.innerHTML='Show No-Ops'})

function draw() {
    if (state>=0) bottomPropLevel.forEach((node)=>node.draw(ctx,radius));
    if (state >= 1) {
        bottomActLevel.forEach((node)=>node.draw(ctx,radius));
        drawEdge(255,255,255,bottomPropLevel[0],bottomActLevel[0],ctx,radius);
        drawEdge(255,255,255,bottomPropLevel[1],bottomActLevel[2],ctx,radius);
        drawEdge(255,255,255,bottomPropLevel[1],bottomActLevel[3],ctx,radius);
        drawEdge(255,255,255,bottomPropLevel[2],bottomActLevel[1],ctx,radius);
        
    }  if (state>=2) {
        middlePropLevel.forEach((node)=>node.draw(ctx,radius));
        if (showingNoOps) {
            drawEdge(255,0,0,bottomPropLevel[0],middlePropLevel[0],ctx,radius);
            drawEdge(255,0,0,bottomPropLevel[1],middlePropLevel[1],ctx,radius);
            drawEdge(255,0,0,bottomPropLevel[2],middlePropLevel[2],ctx,radius);
        }
        drawEdge(255,255,255,bottomActLevel[0],middlePropLevel[3],ctx,radius);
        drawEdge(255,255,255,bottomActLevel[1],middlePropLevel[4],ctx,radius);
        drawEdge(255,255,255,bottomActLevel[2],middlePropLevel[5],ctx,radius);
        drawEdge(255,255,255,bottomActLevel[2],middlePropLevel[6],ctx,radius);
        drawEdge(255,255,255,bottomActLevel[3],middlePropLevel[5],ctx,radius);
        drawEdge(255,255,255,bottomActLevel[3],middlePropLevel[7],ctx,radius);
    } if (state>=3) {
        middleActLevel.forEach((node)=>node.draw(ctx,radius));
        drawEdge(255,255,255,middlePropLevel[0],middleActLevel[0],ctx,radius);
        drawEdge(255,255,255,middlePropLevel[1],middleActLevel[2],ctx,radius);
        drawEdge(255,255,255,middlePropLevel[1],middleActLevel[3],ctx,radius);
        drawEdge(255,255,255,middlePropLevel[2],middleActLevel[1],ctx,radius);
    }
      if (state>=4) {
        finalPropLevel.forEach((node)=>node.draw(ctx,radius));
        if (showingNoOps) {
            drawEdge(255,0,0,middlePropLevel[0],finalPropLevel[0],ctx,radius);
            drawEdge(255,0,0,middlePropLevel[1],finalPropLevel[1],ctx,radius);
            drawEdge(255,0,0,middlePropLevel[2],finalPropLevel[2],ctx,radius);
            drawEdge(255,0,0,middlePropLevel[3],finalPropLevel[3],ctx,radius);
            drawEdge(255,0,0,middlePropLevel[4],finalPropLevel[4],ctx,radius);
            drawEdge(255,0,0,middlePropLevel[5],finalPropLevel[5],ctx,radius);
            drawEdge(255,0,0,middlePropLevel[6],finalPropLevel[6],ctx,radius);
            drawEdge(255,0,0,middlePropLevel[7],finalPropLevel[7],ctx,radius);
        }
        drawEdge(255,255,255,middleActLevel[0],finalPropLevel[3],ctx,radius);
        drawEdge(255,255,255,middleActLevel[1],finalPropLevel[4],ctx,radius);
        drawEdge(255,255,255,middleActLevel[2],finalPropLevel[5],ctx,radius);
        drawEdge(255,255,255,middleActLevel[2],finalPropLevel[6],ctx,radius);
        drawEdge(255,255,255,middleActLevel[3],finalPropLevel[5],ctx,radius);
        drawEdge(255,255,255,middleActLevel[3],finalPropLevel[7],ctx,radius);
    }
}

function advanceState() {
    state = (state + 1) % 5;
    if (state==0){
        nextBtn.innerHTML='Next';
        expl.innerHTML="We start with `clean`, `garbage`, and 'quiet' as true. The possible actions to be taken are 'cook', 'wrap', 'carry', and 'dolly' to reach the final goal of 'not garb', 'dinner', and 'present'";
    } else if (state==1) {
        expl.innerHTML="Since all of the actions may be performed under the initial conditions, we add an action node for each action, drawing edges between the node and each of its preconditions."
    } else if (state==2) {
        expl.innerHTML="We now add the add and delete effects of each action."
    } else if (state==3) {
        expl.innerHTML="As in the beginning, each possible action may be performed based on the conditions, so we again add an action level with edges connection action nodes to their corresponding preconditions."
    }
    else if (state==4){
        nextBtn.innerHTML='Restart'
        expl.innerHTML="We again add the add and delete effects of each action node.We now find that the goal of 'not garb', 'dinner', and 'present' may be reached without any mutual exclusion, so the program terminates."
    }
}

// Animation variables
let lastTime = 0;
let frameCount = 0;
let fps = 0;
let fpsStartTime = Date.now();



function animate(currentTime = 0) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  update(deltaTime);
  draw();
  requestAnimationFrame(animate);
}

// ====================== UPDATE ======================
function update(deltaTime) {
  // Put all your logic here (movement, collisions, timers, etc.)

  // Example:
  // state.x += state.speed * (deltaTime / 16); // frame-rate independent
  // state.angle += 0.02;
}

// Start the animation
animate();