define([],
function()
{
    // function createMaze(dimensions)
    // {
    //     var size = 0;
    //     for (var i = 0; i < dimensions.length; ++i)
    //     {
    //         size += dimensions[i];
    //     }
    //
    //     var map = [];
    //     for (var i = 0; i < size; ++i)
    //     {
    //         map[i] = 0;
    //     }
    //
    //     return {
    //         dimensions: dimensions,
    //         numDimensions: dimensions.length,
    //         size: size,
    //         map: map,
    //     }
    // }
    //
    // function getMazeIndex(m, coord)
    // {
    //     if (m.numDimensions != coord.length)
    //     {
    //         console.error("Error, wrong number of dimensions");
    //         console.error(m.numDimensions + " != " + coord.length);
    //         return;
    //     }
    //
    //     var pos = 0;
    //     var stride = 1;
    //     for (var i = 0; i < m.numDimensions; ++i)
    //     {
    //         pos += (coord[i] - 1) * stride;
    //         stride *= m.dimensions[i];
    //     }
    //
    //     return pos;
    // }
    //
    // function getMazePos(m, coord)
    // {
    //     var index = getMazeIndex(m, coord);
    //     return m.map[index];
    // }
    //
    // function setMazePos(m, coord, value)
    // {
    //     var index = getMazeIndex(m, coord);
    //     m.map[index] = value;
    // }
    //
    // function generateMaze(m)
    // {
    //     if (m.numDimensions != 2)
    //     {
    //         console.log("numDimensions > 2 not supported yet!");
    //         return;
    //     }
    //
    //     for (var i = 0; i < m.dimensions[0]; ++i)
    //     {
    //         setMazePos(m, [i, 0], 1);
    //         setMazePos(m, [i, m.dimensions[1]-1], 1);
    //     }
    //
    //     for (var i = 0; i < m.dimensions[1]; ++i)
    //     {
    //         setMazePos(m, [0, i], 1);
    //         setMazePos(m, [m.dimensions[0]-1, i], 1);
    //     }
    // }

    // createMaze([4, 4, 4])
    // [[[00, 01, 02, 03],
    //   [04, 05, 06, 07],
    //   [08, 09, 10, 11],
    //   [12, 13, 14, 15]],
    //  [[16, 17, 18, 19],
    //   [20, 21, 22, 23],
    //   [24, 25, 26, 27],
    //   [28, 29, 30, 31]],
    //  [[32, 33, 34, 35],
    //   [36, 37, 38, 39],
    //   [40, 41, 42, 43],
    //   [44, 45, 46, 47]],
    //  [[48, 49, 50, 51],
    //   [52, 53, 54, 55],
    //   [56, 57, 58, 59],
    //   [60, 61, 62, 63]]],

    function Statistics()
    {
        this.path = [];
        this.depth = 0;
        this.cost = 0; // Same as depth

        // TODO(andre:2017-11-21): How to calculate this values for the backtracking algorithm?
        this.expandedNodes = 0;
        this.visitedNodes = 0;

        this._numberOfBranchs = 0;
        this.averageBranchingFactor = 0; // Equals to _numberOfBranchs divided by expandedNodes
        this.executionTime = 0;

        this.find = false;
    }

    function RecursionNode(maze, mazeNode)
    {
        this.mazeNode = mazeNode;
        this.operations = getOperations(maze, flattenToCoord(mazeNode.flatten, maze.shape));
        this.curOperation = 0;
    }

    function getRecursionMazeNodeList(recursionStack)
    {
        var stack = [];
        for (var i = 0; i < recursionStack.length; ++i)
        {
            stack.push(recursionStack[i].mazeNode);
        }

        return stack;
    }

    function MazeNode(flatten, parent, cost)
    {
        // TODO(andre:2017-11-23): Conversion between flatten and coord is a loop over all the
        // dimensions. Maybe the MazeNode should save both
        this.flatten = flatten;
        this.parent = parent;
        this.cost = cost;
    }

    function getNodeStack(list, index)
    {
        var currentNode = list[index];
        var stack = [currentNode];

        while (currentNode.parent != null)
        {
            currentNode = list[currentNode.parent];
            stack.push(currentNode);
        }

        stack.reverse();

        return stack;
    }

    function getSmallestNode(list)
    {
        var smallestIndex = 0;
        var smallestValue = list[0].cost;
        for (var i = 0; i < list.length; ++i)
        {
            if (list[i].cost < smallestValue)
            {
                smallestIndex = i;
                smallestValue = list[i].cost;
            }
        }

        return list.splice(smallestIndex, 1)[0];
    }

    function getClosestNode(list, endCoord, shape)
    {
        var closestIndex = 0;
        var closestValue = getNodeDistance(flattenToCoord(list[0].flatten, shape), endCoord);
        for (var i = 0; i < list.length; ++i)
        {
            var distance = getNodeDistance(flattenToCoord(list[i].flatten, shape), endCoord);

            if (distance < closestValue)
            {
                closestIndex = i;
                closestValue = distance;
            }
        }

        return list.splice(closestIndex, 1)[0];
    }

    function getBestNode(list, endCoord, shape)
    {
        var bestIndex = 0;
        var bestValue = list[0].cost + getNodeDistance(flattenToCoord(list[0].flatten, shape), endCoord);
        for (var i = 0; i < list.length; ++i)
        {
            var distance = list[i].cost + getNodeDistance(flattenToCoord(list[i].flatten, shape), endCoord);

            if (distance < bestValue)
            {
                bestIndex = i;
                bestValue = distance;
            }
        }

        return list.splice(bestIndex, 1)[0];
    }

    function getNodeDistance(startCoord, endCoord)
    {
        var distanceSq = 0;
        for (var i = 0; i < startCoord.length; ++i)
        {
            var delta = endCoord[i] - startCoord[i];
            distanceSq += delta * delta;
        }

        return Math.sqrt(distanceSq);
    }

    function printNodeList(list, shape)
    {
        for (var i = 0; i < list.length; ++i)
        {
            console.log(flattenToCoord(list[i].flatten, shape));
        }
    }

    function generateMaze(mazeDimensions)
    {
        var startTime = new Date();

        // var maze = nj.ones(mazeDimensions, 'int8');
        // maze.slice([1, -1], [1, -1], [1, -1]).assign(0, false);
        var maze = nj.zeros(mazeDimensions, 'int8');

        var type = 1;

        maze.set(3, 3, 1);
        maze.set(3, 4, 1);
        maze.set(4, 3, 1);
        maze.set(4, 4, 1);

        if (type > 0)
        {
            maze.set(4, 2, 1);
            maze.set(4, 1, 1);
            maze.set(4, 0, 1);
            maze.set(0, 1, 1);
            maze.set(1, 1, 1);
            maze.set(2, 1, 1);
            maze.set(2, 4, 1);
            maze.set(1, 4, 1);
            maze.set(1, 5, 1);
            maze.set(1, 6, 1);
            maze.set(3, 7, 1);
            maze.set(3, 6, 1);
        }

        if (type > 1)
        {
            maze.set(6, 7, 1);
            maze.set(6, 6, 1);
            maze.set(6, 5, 1);
            maze.set(6, 4, 1);
            maze.set(6, 3, 1);
            maze.set(6, 2, 1);
            maze.set(6, 1, 1);
        }

        if (type > 2)
        {
            maze.set(3, 0, 1);
            maze.set(5, 0, 1);
            maze.set(7, 0, 1);
            maze.set(0, 2, 1);
            maze.set(1, 2, 1);
            maze.set(3, 2, 1);
            maze.set(0, 3, 1);
            maze.set(2, 3, 1);
            maze.set(2, 5, 1);
            maze.set(5, 5, 1);
            maze.set(0, 7, 1);
            maze.set(2, 7, 1);
            maze.set(4, 6, 1);
            maze.set(5, 6, 1);
            maze.set(4, 7, 1);
            maze.set(5, 7, 1);
        }

        var timeDiff = new Date() - startTime;
        console.log("Maze shape: (" + maze.shape + ")");
        console.log("Generation time: " + timeDiff + " ms");

        return maze;
    }

    function getOperations(maze, position)
    {
        if (maze.ndim !== position.length)
        {
            console.error("Wrong number of dimensions\n" + maze.ndim + " !== " + position.length);
        }

        var shape = maze.shape;
        var ndim = maze.ndim

        var numOperations = Math.pow(3, ndim);
        var operations = [];
        for (var i = 0; i < numOperations; ++i)
        {
            var singleOperation = [];
            var coord = i;
            var isValid = true;
            var similarity = 0; // Used to remove the position from the list
            for (var j = 0; j < ndim; ++j)
            {
                singleOperation[j] = (coord % 3) - 1; // Ranges from -1 to 1
                singleOperation[j] += position[j]; // Ranges from position-1 to position+1
                coord = Math.floor(coord / 3);

                if (singleOperation[j] == position[j])
                {
                    similarity++;
                }
                else if (singleOperation[j] < 0 || singleOperation[j] > shape[j]-1) // Check if it's out of bounds
                {
                    isValid = false;
                    break;
                }
            }

            if (isValid &&
                similarity < ndim &&
                maze.get.apply(maze, singleOperation) != 1) // Check if the position is a wall
            {
                operations.push(singleOperation);
            }
        }

        return operations
    }

    function flattenToCoord(flatten, shape)
    {
        var coord = [];
        for (var i = 0; i < shape.length; ++i)
        {
            coord[i] = flatten % shape[i];
            flatten = Math.floor(flatten / shape[i]);
        }

        return coord
    }

    function coordToFlatten(coord, shape)
    {
        if (coord.length !== shape.length)
        {
            console.error("Wrong number of dimensions\n" + coord.length + " !== " + shape.length);
        }

        var pos = 0;
        var stride = 1;
        for (var i = 0; i < shape.length; ++i)
        {
            pos += coord[i] * stride;
            stride *= shape[i];
        }

        return pos;
    }

    return {
        Statistics: Statistics,
        RecursionNode: RecursionNode,
        getRecursionMazeNodeList: getRecursionMazeNodeList,
        MazeNode: MazeNode,
        getNodeStack: getNodeStack,
        getSmallestNode: getSmallestNode,
        getClosestNode: getClosestNode,
        getBestNode: getBestNode,
        getNodeDistance: getNodeDistance,
        printNodeList: printNodeList,
        generateMaze: generateMaze,
        getOperations: getOperations,
        flattenToCoord: flattenToCoord,
        coordToFlatten: coordToFlatten,
    }
});
