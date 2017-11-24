define(["ai/maze"],
function(mazeLib)
{
    function mazeIDAStar(maze, startPosition, endPosition)
    {
        var results = new mazeLib.Statistics();
        var startTime = new Date();

        var startNode = new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0);

        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

        var newThreshold = mazeLib.getNodeDistance(startPosition, endPosition);
        var threshold;

        do
        {
            threshold = newThreshold;

            var stack = [];
            var currentRecursion = new mazeLib.RecursionNode(maze, startNode);

            while (stack.length > 0 || currentRecursion.curOperation < currentRecursion.operations.length)
            {
                if (currentRecursion.curOperation >= currentRecursion.operations.length)
                {
                    currentRecursion = stack.pop();
                    continue;
                }

                if (currentRecursion.mazeNode.flatten == endFlatten)
                {
                    stack.push(currentRecursion);

                    results.find = true;
                    results.path = mazeLib.getRecursionMazeNodeList(stack);
                    results.depth = results.path.length;
                    results.cost = currentRecursion.mazeNode.cost;

                    // results.expandedNodes = closed.length;
                    // results.visitedNodes = closed.length + open.length;

                    // results.averageBranchingFactor = results._numberOfBranchs / results.expandedNodes;

                    break;
                }

                var operation = currentRecursion.operations[currentRecursion.curOperation];
                var flatten = mazeLib.coordToFlatten(operation.coord, maze.shape);
                var stackIndex = stack.find(recursion => recursion.mazeNode.flatten == flatten);

                var operationCost = operation.cost;

                currentRecursion.curOperation++;
                if (!stackIndex) // Checks if the position isn't in the recursion stack
                {
                    results._numberOfBranchs++;

                    var heuristic = currentRecursion.mazeNode.cost + operationCost + mazeLib.getNodeDistance(operation.coord, endPosition);

                    if (heuristic <= threshold)
                    {
                        var nextNode = new mazeLib.MazeNode(flatten, stack.length-1, currentRecursion.mazeNode.cost + operationCost);
                        stack.push(currentRecursion);
                        currentRecursion = new mazeLib.RecursionNode(maze, nextNode);
                    }
                    else
                    {
                        if (heuristic < newThreshold || newThreshold == threshold)
                            newThreshold = heuristic;
                    }
                }
            }
        } while (newThreshold !== threshold && !results.find);

        var timeDiff = new Date() - startTime;
        results.executionTime = timeDiff;
        return results;
    }

    return mazeIDAStar;
});
