define(["ai/maze"],
function(mazeLib)
{
    function mazeOrderedSearch(maze, startPosition, endPosition)
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
            var currentPosition = mazeLib.getSmallestNode(open);
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

                var closedElement = closed.find(node => node.flatten == flatten);
                var openElement = open.find(node => node.flatten == flatten);

                if (closedElement)
                {
                    continue;
                }
                else if (openElement)
                {
                    if (openElement.cost > currentPosition.cost + operations[i].cost)
                    {
                        openElement.parent = (closed.length-1);
                        openElement.cost = currentPosition.cost + operations[i].cost;
                    }
                }
                else
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

    function* mazeOrderedSearchIt(maze, startPosition, endPosition)
    {
        if (maze.ndim !== 2)
        {
            console.error("Not supported yet!");
            return;
        }

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

        var open = [new mazeLib.MazeNode(mazeLib.coordToFlatten(startPosition, maze.shape), null, 0)];
        var closed = [];

        var endFlatten = mazeLib.coordToFlatten(endPosition, maze.shape);

        while (open.length > 0)
        {
            // TODO(andre:2017-11-23): This solution iterates over the entire list.
            // Keeping it ordered would be better
            var currentPosition = mazeLib.getSmallestNode(open);
            closed.push(currentPosition);

            var currentPositionCoord = mazeLib.flattenToCoord(currentPosition.flatten, maze.shape);
            mazeLib.setMazeId(results.map, currentPositionCoord, 6);

            results.path = mazeLib.getNodeStackData(closed, closed.length-1, maze.shape);
            results.depth = results.path.length;

            results.expandedNodes = closed.length;
            results.visitedNodes = closed.length + open.length;

            results.averageBranchingFactor = results._numberOfBranchs / results.expandedNodes;

            results.cost = currentPosition.cost;

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

                var closedElement = closed.find(node => node.flatten == flatten);
                var openElement = open.find(node => node.flatten == flatten);

                if (closedElement)
                {
                    continue;
                }
                else if (openElement)
                {
                    if (openElement.cost > currentPosition.cost + operations[i].cost)
                    {
                        openElement.parent = (closed.length-1);
                        openElement.cost = currentPosition.cost + operations[i].cost;
                    }
                }
                else
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
        mazeOrderedSearch: mazeOrderedSearch,
        mazeOrderedSearchIt: mazeOrderedSearchIt,
    };
});
