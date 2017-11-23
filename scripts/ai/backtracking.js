define(["ai/maze"],
function(mazeLib)
{
    // 2849595 ms
    // 47 minutes
    // NOTE(andre:2017-11-22): This method fails with large mazes because of recursion
    function mazeBacktracking(maze, startPosition, endPosition)
    {
        var results = new mazeLib.Statistics();
        var startTime = new Date();

        var startNode = new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0);
        mazeBacktrackingRecursion(maze, startNode, endPosition, [], results);

        var timeDiff = new Date() - startTime;
        results.executionTime = timeDiff;

        return results;
    }

    function mazeBacktrackingRecursion(maze, currentNode, endPosition, stack, results)
    {
        if (results.find)
            return;

        var currentFlatten = currentNode.flatten;
        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

        stack.push(currentNode);

        if (currentFlatten == endFlatten)
        {
            results.find = true;
            results.path = stack.slice(0); // Makes a copy of the path taken
            results.depth = results.path.length;
            results.cost = currentNode.cost;
        }

        var operations = mazeLib.getOperations(maze, mazeLib.flattenToCoord(currentFlatten, maze.shape));

        for (var i = 0; i < operations.length; ++i)
        {
            var flatten = mazeLib.coordToFlatten(operations[i], maze.shape);

            var stackIndex = stack.find(node => node.flatten == flatten);

            var operationCost = 1;

            if (!stackIndex) // Checks if the position isn't in the recursion stack
            {
                results._numberOfBranchs++;

                var nextNode = new mazeLib.MazeNode(flatten, stack.length-1, currentNode.cost + operationCost);
                mazeBacktrackingRecursion(maze, nextNode, endPosition, stack, results);
            }
        }
        stack.pop();
    }

    return mazeBacktracking;
});
