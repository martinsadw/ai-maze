define(["ai/maze", "ai/backtracking", "ai/breadthSearch", "ai/depthSearch", "ai/orderedSearch", "ai/greedySearch", "ai/AStar", "ai/IDAStar"],
function(mazeLib, backtracking, breadthSearch, depthSearch, orderedSearch, greedySearch, aStar, idaStar)
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
        mazeOrderedSearch: orderedSearch.mazeOrderedSearch,
        mazeOrderedSearchIt: orderedSearch.mazeOrderedSearchIt,
        mazeGreedySearch: greedySearch.mazeGreedySearch,
        mazeGreedySearchIt: greedySearch.mazeGreedySearchIt,
        mazeAStar: aStar.mazeAStar,
        mazeAStarIt: aStar.mazeAStarIt,
        mazeIDAStar: idaStar.mazeIDAStar,
        mazeIDAStarIt: idaStar.mazeIDAStarIt,
        coordToFlatten: mazeLib.coordToFlatten,
        flattenToCoord: mazeLib.flattenToCoord,
    };
});
