define(["ai/maze"],
function(mazeLib)
{
    function mazeBreadthSearch(maze, startPosition, endPosition)
    {
        var results = new mazeLib.Statistics();
        var startTime = new Date();

        var open = [new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0)];
        var closed = [];

        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

        while (open.length > 0)
        {
            // TODO(andre:2017-11-22): Shift is O(n). Find a better way to work with queues
            // https://stackoverflow.com/questions/1590247/how-do-you-implement-a-stack-and-a-queue-in-javascript
            // https://code.tutsplus.com/articles/data-structures-with-javascript-stack-and-queue--cms-23348
            var currentPosition = open.shift();
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

            for (var i = 0; i < operations.length; ++i)
            {
                var flatten = mazeLib.coordToFlatten(operations[i].coord, maze.shape);

                var closedIndex = closed.find(node => node.flatten == flatten);
                var openIndex = open.find(node => node.flatten == flatten);

                if (!closedIndex && !openIndex) // Checks if the position isn't in one of the lists
                {
                    results._numberOfBranchs++;
                    open.push(new mazeLib.MazeNode(flatten, (closed.length-1), currentPosition.cost + operations[i].cost));
                }
            }
        }

        var timeDiff = new Date() - startTime;
        results.executionTime = timeDiff;
        return results;
    }

    return mazeBreadthSearch;
});
