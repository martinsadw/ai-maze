define(["ai/maze", "ai/backtracking", "ai/breadthSearch", "ai/depthSearch", "ai/orderedSearch", "ai/greedySearch", "ai/AStar", "ai/IDAStar"],
function(mazeLib, backtracking, breadthSearch, depthSearch, mazeOrderedSearch, mazeGreedySearch, mazeAStar, mazeIDAStar)
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
        mazeBacktracking: backtracking.mazeBacktracking,
        mazeBacktrackingIt: backtracking.mazeBacktrackingIt,
        mazeBreadthSearch: breadthSearch.mazeBreadthSearch,
        mazeBreadthSearchIt: breadthSearch.mazeBreadthSearchIt,
        mazeDepthSearch: depthSearch.mazeDepthSearch,
        mazeDepthSearchIt: depthSearch.mazeDepthSearchIt,
        mazeOrderedSearch: mazeOrderedSearch,
        mazeGreedySearch: mazeGreedySearch,
        mazeAStar: mazeAStar,
        mazeIDAStar: mazeIDAStar,
        coordToFlatten: mazeLib.coordToFlatten,
        flattenToCoord: mazeLib.flattenToCoord,
    };
});
