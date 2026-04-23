


// class ActionNode { 
//     constructor(preconditionNodes, template, x, y, r) {
//         this.exclusive = []
//         this.preconditionNodes = preconditionNodes;
//         this.template = template;
//         this.x = x;
//         this.y = y;
//         this.r = r;
//     }

//     drawNode(ctx) {
        
//     }
// };

// class ConditionNode {

//     constructor(addEdgeNodes, deleteEdgeNodes, state, x, y, r) {
//         this.exclusive = []
//         this.addEdgeNodes = addEdgeNodes;
//         this.deleteEdgeNodes = deleteEdgeNodes;
//         this.template = template;
//         this.x = x;
//         this.y = y;
//         this.r = r;
//     }

//     drawNode(ctx) {

//         this.addEdgeNodes.forEach((node) => {
//             // draw edges
//         });
//         this.deleteEdgeNodes.forEach((node) => {
//             // draw edges
//         });
//     }

// }


// class ActionTemplate {
//     constructor(description, preconditions, postconditions) {
//         this.description = description;
//         this.preconditions = preconditions;
//         this.postconditions = postconditions;
//     }
// }

// class ConditionTemplate {
//     constructor(description) {
//         this.description = description
//     }
// }

// class PlanningGraph {
//     // not required for eactions at a given time step to not interfere
//     // directed and leveled graphs

//     constructor(conditionLevel, actionTemplates, goal) {
//         this.conditionLevels = [ conditionLevel ];
//         this.actionLevels = [];
//         this.validPlan = null;
//         this.validPlanPossible = true;
//         this.actionTemplates = actionTemplates;
//         this.goal = goal; // stack of condition templates
//     }

//     createActionLevel() {
//         let actionLevel = Array();
//         const lastPrecondLevel = this.conditionLevels[-1];

//         // insert an action node if no two of its preconditions are labelled as mutually exclusive
//         this.actionTemplates.forEach(templ => {
//             let feasible = true;
//             let exclSet = Set();
//             templ.preconditions.forEach(preCond => {
//                 let node = templ.extractNodeFromLevel(actionLevel);
//                 if (!node) {
//                     feasible = false;
//                     break;
//                 }
//                 node.exclusive.forEach((exclNode => {
//                     if (exclSet.contains(exclNode)) {
//                         feasible = false;
//                         break;
//                     }
//                     exclSet.add(exclNode);
//                 }));
//                 if (feasible) actionLevel.add(new ActionNode(preCondNodes, templ));            
//             })
//         });

//         // insert all the no-op actions
//         this.lastPrecondLevel.forEach((cond) => {
//             const noOp = new ActionNode({cond}, null);
//             noOp.exclusive = // ????
//             actionLevel.add(noOp);
//         });

//         this.actionLevels.add(actionLevel);
//     }

//     createConditionLevel() {
//         let conditionLevel = Array();
//         const lastActionLevel = this.actionLevels[-1];
//         lastActionLevel.forEach((action) => {
//             action.template.postconditions.forEach((postTempl)=>conditionLevel.add(new ConditionNode(action)))
//         })

//     }

//     validPlanExists() {
//         /**
//          * For each goal at time t in some arbitrary order, select some action at time t - 1 achieving that goal that is not exclusive of 
//          * any actions that have already been selected. Continue recursively with the next goal at time t. (Of course, if by good fortune a 
//          * goal has already been achieved by some previously selected action, we do not need to select a new action for it.) 
//          * If our recursive call returns failure, then try a different action achieving our current goal, and so forth, 
//          * returning failure once all such actions have been tried. Once finished with all the goals at time t, the preconditions 
//          * to the selected actions make up the new goal set at time t - 1. We call this a “goal set creation step”. 
//          * Graphplan then continues A “forward-checking” Graphplan this procedure at time step t - 1. 
//          */

//         /**
//          * for each condition node according to condition in the goal (if cant find condition just return false)
//          * 1 --> search through add edge nodes and delete edge nodes to get an action not exclusive of any prior selected actions
//          * 2 --> reurse down each level
//          * 3 --> failure when
//          * 4 --> if one action picked fails, try another, we only fail when all these actions fail
//          */

//         // if the graph has leveled off and the pre condition isnt changing then you know its impossible

//         return this.validPlanHelper(this.goals, this.actionLevels.length-1);

//     }

//     // recursively return the plan or null if it cannot exist
//     validPlanHelper(goals, levelInd) {
//         const lastCondLevel = this.conditionLevels[levelInd];
//         const lastActionLevel = this.actionLevels[levelInd];
//         const excActionNodes = Set();
//         const lastGoals = Stack();

//         // base case
//         if (levelInd == 0) {

//         }

//         // create goal stack for index levelInd - 1
//         while (!goals.isEmpty()) {
//             const templ = goals.pop();
//             let selectedActionNode = null;
//             const node = templ.extractNodeFromLevel(lastCondLevel);
//             if (node == null) return null;

//             // recurse precondition actions not exclusive of any prior selected action
//             node.addEdgeNodes.forEach((edgeNode) => {
//                 if (excActionNodes.contains(edgeNode)) continue;
//             });
//             node.deleteEdgeNodes.forEach((edgeNode) => {
//                 if (excActionNodes.contains(edgeNode)) continue;
//             });

//             if (selectedActionNode == null) return;
//             selectedActionNode.excluded.forEach((actionNode) => {
//                 excActionNodes.add(actionNode);
//             });
//             selectedActionNode.postConditionNodes.forEach((postNode) => {
//                 if (goals.contains(postNode)) goals.remove(postNode); 
//             });
//         }

//         // recurse
//         this.validPlanHelper(lastGoals, levelInd - 1);
//     }

//     generate() {
//         while (!this.validPlanExists()) {
//             this.createActionLevel();
//             this.createConditionLevel();
//             if (!this.validPlanPossible) break;
//         }
//     }

// };

// export { PlanningGraph };