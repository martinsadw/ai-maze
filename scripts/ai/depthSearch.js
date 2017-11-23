define(["ai/maze"],
function(mazeLib)
{
    function mazeDepthSearch(maze, startPosition, endPosition)
    {
        var results = new mazeLib.Statistics();
        var startTime = new Date();

        var open = [new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0)];
        var closed = [];

        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

        while (open.length > 0)
        {
            var currentPosition = open.pop();
            closed.push(currentPosition);

            if (currentPosition.flatten == endFlatten)
            {
                results.find = true;
                results.path = mazeLib.getNodeStack(closed, closed.length-1);
                results.depth = results.path.length;
                results.cost = currentPosition.cost;

                results.expandedNodes = closed.length;
                results.visitedNodes = closed.length + open.length;

                results.averageBranchingFactor = results._numberOfBranchs / results.expandedNodes;

                break;
            }

            var operations = mazeLib.getOperations(maze, mazeLib.flattenToCoord(currentPosition.flatten, maze.shape));
            operations.reverse();

            for (var i = 0; i < operations.length; ++i)
            {
                var flatten = mazeLib.coordToFlatten(operations[i], maze.shape);

                var closedIndex = closed.find(node => node.flatten == flatten);
                var openIndex = open.find(node => node.flatten == flatten);

                var operationCost = 1;

                if (!closedIndex && !openIndex) // Checks if the position isn't in one of the lists
                {
                    results._numberOfBranchs++;
                    open.push(new mazeLib.MazeNode(flatten, (closed.length-1), currentPosition.cost + operationCost));
                }
            }
        }

        var timeDiff = new Date() - startTime;
        results.executionTime = timeDiff;
        return results;
    }

    return mazeDepthSearch;
});
