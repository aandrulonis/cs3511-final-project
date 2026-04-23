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
        console.log(`x ${this.x} y ${this.y}`)
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
bottomActLevel.forEach((node)=>node.draw(ctx,radius));
middlePropLevel.forEach((node)=>node.draw(ctx,radius));
middleActLevel.forEach((node)=>node.draw(ctx,radius));
finalPropLevel.forEach((node)=>node.draw(ctx,radius));

drawEdge(255,255,255,bottomPropLevel[0],bottomActLevel[0],ctx,radius);
drawEdge(255,255,255,bottomPropLevel[1],bottomActLevel[2],ctx,radius);
drawEdge(255,255,255,bottomPropLevel[1],bottomActLevel[3],ctx,radius);
drawEdge(255,255,255,bottomPropLevel[2],bottomActLevel[1],ctx,radius);

drawEdge(255,255,255,bottomActLevel[0],middlePropLevel[3],ctx,radius);
drawEdge(255,255,255,bottomActLevel[1],middlePropLevel[4],ctx,radius);
drawEdge(255,255,255,bottomActLevel[2],middlePropLevel[5],ctx,radius);
drawEdge(255,255,255,bottomActLevel[2],middlePropLevel[6],ctx,radius);
drawEdge(255,255,255,bottomActLevel[3],middlePropLevel[5],ctx,radius);
drawEdge(255,255,255,bottomActLevel[3],middlePropLevel[7],ctx,radius);

drawEdge(255,255,255,middlePropLevel[0],middleActLevel[0],ctx,radius);
drawEdge(255,255,255,middlePropLevel[1],middleActLevel[2],ctx,radius);
drawEdge(255,255,255,middlePropLevel[1],middleActLevel[3],ctx,radius);
drawEdge(255,255,255,middlePropLevel[2],middleActLevel[1],ctx,radius);

drawEdge(255,255,255,middleActLevel[0],finalPropLevel[3],ctx,radius);
drawEdge(255,255,255,middleActLevel[1],finalPropLevel[4],ctx,radius);
drawEdge(255,255,255,middleActLevel[2],finalPropLevel[5],ctx,radius);
drawEdge(255,255,255,middleActLevel[2],finalPropLevel[6],ctx,radius);
drawEdge(255,255,255,middleActLevel[3],finalPropLevel[5],ctx,radius);
drawEdge(255,255,255,middleActLevel[3],finalPropLevel[7],ctx,radius);

