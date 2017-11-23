define(["ai/maze", "ai/backtracking", "ai/breadthSearch", "ai/depthSearch", "ai/orderedSearch", "ai/greedySearch", "ai/AStar"],
function(mazeLib, mazeBacktracking, mazeBreadthSearch, mazeDepthSearch, mazeOrderedSearch, mazeGreedySearch, mazeAStar)
{
    // var stopExecution = 10000;
    // function d()
    // {
    //     --stopExecution;
    //     if (stopExecution < 0)
    //         throw new Error("Hello!");
    // }

    function mazeIDAStar(maze, startPosition, endPosition)
    {
        var results = new mazeLib.Statistics();
        var startTime = new Date();

        var timeDiff = new Date() - startTime;

        results.executionTime = timeDiff;
        return results;
    }

    return {
        generateMaze: mazeLib.generateMaze,
        mazeBacktracking: mazeBacktracking,
        mazeBreadthSearch: mazeBreadthSearch,
        mazeDepthSearch: mazeDepthSearch,
        mazeOrderedSearch: mazeOrderedSearch,
        mazeGreedySearch: mazeGreedySearch,
        mazeAStar: mazeAStar,
        mazeIDAStar: mazeIDAStar,
        coordToFlatten: mazeLib.coordToFlatten,
        flattenToCoord: mazeLib.flattenToCoord,
    };
});
