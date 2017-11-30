define(["ai/maze"],
function(mazeLib)
{
    function mazeAStar(maze, startPosition, endPosition)
    {
        var results = new mazeLib.Statistics();
        var startTime = new Date();

        var open = [new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0)];
        var closed = [];

        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

        while (open.length > 0)
        {
            // TODO(andre:2017-11-23): This solution iterates over the entire list.
            // Keeping it ordered would be better
            // Maybe even precalculate the distance to end position since it
            // doesn't change over iterations
            var currentPosition = mazeLib.getBestNode(open, endPosition, maze.shape);
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

    function* mazeAStarIt(maze, startPosition, endPosition)
    {
        var results = new mazeLib.Statistics();
        var startTime = new Date();

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

        var open = [new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0)];
        var closed = [];

        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

        while (open.length > 0)
        {
            // TODO(andre:2017-11-23): This solution iterates over the entire list.
            // Keeping it ordered would be better
            // Maybe even precalculate the distance to end position since it
            // doesn't change over iterations
            var currentPosition = mazeLib.getBestNode(open, endPosition, maze.shape);
            closed.push(currentPosition);

            var currentPositionCoord = mazeLib.flattenToCoord(currentPosition.flatten, maze.shape);
            mazeLib.setMazeId(results.map, currentPositionCoord, 6);

            results.path = mazeLib.getNodeStackData(closed, closed.length-1, maze.shape);
            results.depth = results.path.length;
            results.cost = currentPosition.cost;

            results.expandedNodes = closed.length;
            results.visitedNodes = closed.length + open.length;

            results.averageBranchingFactor = results._numberOfBranchs / results.expandedNodes;

            if (currentPosition.flatten == endFlatten)
            {
                results.find = true;
                break;
            }

            yield results;

            var operations = mazeLib.getOperations(maze, mazeLib.flattenToCoord(currentPosition.flatten, maze.shape));

            for (var i = 0; i < operations.length; ++i)
            {
                var flatten = mazeLib.coordToFlatten(operations[i].coord, maze.shape);

                var closedIndex = closed.find(node => node.flatten == flatten);
                var openIndex = open.find(node => node.flatten == flatten);

                if (!closedIndex && !openIndex) // Checks if the position isn't in one of the lists
                {
                    results._numberOfBranchs++;
                    mazeLib.setMazeId(results.map, operations[i].coord, 5);
                    open.push(new mazeLib.MazeNode(flatten, (closed.length-1), currentPosition.cost + operations[i].cost));
                }
            }
        }

        var timeDiff = new Date() - startTime;
        results.executionTime = timeDiff;
        return results;
    }

    return {
        mazeAStar: mazeAStar,
        mazeAStarIt: mazeAStarIt,
    };
});
