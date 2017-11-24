define(["ai/maze", "ai/backtracking", "ai/breadthSearch", "ai/depthSearch", "ai/orderedSearch", "ai/greedySearch", "ai/AStar", "ai/IDAStar"],
function(mazeLib, mazeBacktracking, mazeBreadthSearch, mazeDepthSearch, mazeOrderedSearch, mazeGreedySearch, mazeAStar, mazeIDAStar)
{
    // var stopExecution = 10000;
    // function d()
    // {
    //     --stopExecution;
    //     if (stopExecution < 0)
    //         throw new Error("Hello!");
    // }

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
