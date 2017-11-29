define(["ai/maze"],
function(mazeLib)
{
    // 2849595 ms
    // 47 minutes
    function mazeBacktracking(maze, startPosition, endPosition)
    {
        var results = new mazeLib.Statistics();
        var startTime = new Date();

        var startNode = new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0);
        var stack = [];
        var currentRecursion = new mazeLib.RecursionNode(maze, startNode);

        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

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

            currentRecursion.curOperation++;
            if (!stackIndex) // Checks if the position isn't in the recursion stack
            {
                results._numberOfBranchs++;

                var nextNode = new mazeLib.MazeNode(flatten, stack.length-1, currentRecursion.mazeNode.cost + operation.cost);
                stack.push(currentRecursion);
                currentRecursion = new mazeLib.RecursionNode(maze, nextNode);
            }
        }

        var timeDiff = new Date() - startTime;
        results.executionTime = timeDiff;
        return results;
    }

    function* mazeBacktrackingIt(maze, startPosition, endPosition)
    {
        if (maze.ndim !== 2)
        {
            console.error("Not supported yet!");
            return;
        }

        var results = new mazeLib.Statistics();
        var startTime = new Date();

        var startNode = new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0);
        var stack = [];
        var currentRecursion = new mazeLib.RecursionNode(maze, startNode);

        results.map = [];
        var shape = maze.shape;
        for (var i = 0; i < shape[0]; ++i)
        {
            results.map[i] = [];

            for (var j = 0; j < shape[1]; ++j)
            {
                results.map[i][j] = {
                    x: i,
                    y: j,
                    id: maze.get(i, j),
                    cost: 0,
                    heuristic: 0,
                };
            }
        }
        results.map[startPosition[0]][startPosition[1]].id = 2;
        results.map[endPosition[0]][endPosition[1]].id = 3;
        results.startPosition = [{
            x: startPosition[0],
            y: startPosition[1],
            id: 2,
        }];
        results.endPosition = [{
            x: endPosition[0],
            y: endPosition[1],
            id: 3,
        }];

        results.path = [];

        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

        while (stack.length > 0 || currentRecursion.curOperation < currentRecursion.operations.length)
        {
            if (currentRecursion.curOperation >= currentRecursion.operations.length)
            {
                currentRecursion = stack.pop();
                var visited = results.path.pop();
                mazeLib.setMazeId(results.map, [visited.x, visited.y], 5);
                yield results;

                continue;
            }

            if (currentRecursion.mazeNode.flatten == endFlatten)
            {
                stack.push(currentRecursion);

                results.find = true;
                // results.path = mazeLib.getRecursionMazeNodeList(stack);
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

            currentRecursion.curOperation++;
            if (!stackIndex) // Checks if the position isn't in the recursion stack
            {
                results._numberOfBranchs++;

                var nextNode = new mazeLib.MazeNode(flatten, stack.length-1, currentRecursion.mazeNode.cost + operation.cost);
                stack.push(currentRecursion);
                currentRecursion = new mazeLib.RecursionNode(maze, nextNode);
                results.path.push({
                    x: operation.coord[0],
                    y: operation.coord[1],
                    id: 4,
                });
                yield results;
            }
        }

        var timeDiff = new Date() - startTime;
        results.executionTime = timeDiff;
        return results;
    }

    return {
        mazeBacktracking: mazeBacktracking,
        mazeBacktrackingIt: mazeBacktrackingIt,
    };
});
