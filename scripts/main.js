requirejs(["ai/ai"],
function(ai)
{
    var grid = d3.select("#maze").append("svg")

    var iterator;
    var timeout;

    var settings = QuickSettings.create(window.innerWidth - 200, 0, "Config", null);
    settings.addText("Dimensions", "10, 10");
    settings.addText("Start Position", "0, 0");
    settings.addText("End Position", "9, 9");
    settings.addDropDown("Type", [
        "Open",
        "Wall",
        "Zig-Zag",
        "Obstacle",
        "Multi Path",
        "Dead End",
        "Bad Path",
        "Random",
    ]);
    settings.addDropDown("Algorithm", [
        "Backtracking",
        "Breadth Search",
        "Depth Search",
        "Ordered Search",
        "Greedy Search",
        "A*",
        "IDA*",
    ]);
    settings.addNumber("Delay", 1, 10000, 150, 1);
    settings.addText("Tile Size", "20, 20");
    settings.addBoolean("Iterative", true);
    settings.addButton("Start", function() {
        clearTimeout(timeout);
        iterator = ai.mazeIDAStarIt(maze, startPosition, endPosition);

        var mazeDimensions = JSON.parse("[" + settings.getValue("Dimensions") + "]");
        var startPosition = JSON.parse("[" + settings.getValue("Start Position") + "]");
        var endPosition = JSON.parse("[" + settings.getValue("End Position") + "]");

        var maze = ai.generateMaze(mazeDimensions, settings.getValue("Type").index);

        if (settings.getValue("Iterative"))
        {
            var results;

            console.log(settings.getValue("Algorithm").label);
            switch (settings.getValue("Algorithm").index) {
                case 0:
                    iterator = ai.mazeBacktrackingIt(maze, startPosition, endPosition);
                    break;
                case 1:
                    iterator = ai.mazeBreadthSearchIt(maze, startPosition, endPosition);
                    break;
                case 2:
                    iterator = ai.mazeDepthSearchIt(maze, startPosition, endPosition);
                    break;
                case 3:
                    iterator = ai.mazeOrderedSearchIt(maze, startPosition, endPosition);
                    break;
                case 4:
                    iterator = ai.mazeGreedySearchIt(maze, startPosition, endPosition);
                    break;
                case 5:
                    iterator = ai.mazeAStarIt(maze, startPosition, endPosition);
                    break;
                case 6:
                    iterator = ai.mazeIDAStarIt(maze, startPosition, endPosition);
                    break;
            }

            if (maze.ndim == 2)
            {
                var borderFactor = 0.024;

                var padX = 0;
                var padY = 0;

                function getFillColor(d)
                {
                    switch (d.id)
                    {
                        case 0:
                            return "#f5f5f5"; // empty
                        case 1:
                            return "#888"; // wall
                        case 2:
                            return "#2d5"; // start
                        case 3:
                            return "#d53"; // end
                        case 4:
                            return "#fb2"; // path
                        case 5:
                            return "#98fb98"; // open
                        case 6:
                            return "#afeeee"; // closed
                    }
                }
                function getTextColor(d)
                {
                    switch (d.id)
                    {
                        case 0:
                            return "#222";
                        case 1:
                            return "#fff";
                        case 2:
                            return "#222";
                        case 3:
                            return "#222";
                        case 4:
                            return "#222";
                    }
                }

                // var dim = JSON.parse("[" + settings.getValue("Tile Size") + "]");
                // var dimX = dim[0];
                // var dimY = dim[1];
                //
                // grid
                //     .attr("width", (mazeDimensions[0] * (dimX + padX) + 10) + "px")
                //     .attr("height", (mazeDimensions[1] * (dimY + padY) + 10) + "px");

                (function MazeIterate()
                {
                    var dim = JSON.parse("[" + settings.getValue("Tile Size") + "]");
                    var dimX = dim[0];
                    var dimY = dim[1];

                    grid
                        .attr("width", (mazeDimensions[0] * (dimX + padX) + 10) + "px")
                        .attr("height", (mazeDimensions[1] * (dimY + padY) + 10) + "px");

                    var resultsIt = iterator.next();
                    results = resultsIt.value;

                    grid.selectAll("*").remove();

                    var row = grid.selectAll()
                        .data(results.map)
                        .enter().append("g")
                        .attr("class", "row");

                    var column = row.selectAll()
                        .data(function(d) { return d; })
                        .enter().append("rect")
                        .attr("class", "square")
                        .attr("x", function(d) { return d.x * (dimX + padX) + 0.5; })
                        .attr("y", function(d) { return d.y * (dimY + padY) + 0.5; })
                        .attr("width", function(d) { return dimX; })
                        .attr("height", function(d) { return dimY; })
                        .style("fill", getFillColor)
                        .style("stroke", "#777")
                        .style("stroke-width", dimX * borderFactor)

                    var path = grid
                        .append("g")
                        .attr("class", "path")

                    path.selectAll()
                        .data(results.path)
                        .enter().append("rect")
                        .attr("class", "square")
                        .attr("x", function(d) { return d.x * (dimX + padX) + 0.5; })
                        .attr("y", function(d) { return d.y * (dimY + padY) + 0.5; })
                        .attr("width", function(d) { return dimX; })
                        .attr("height", function(d) { return dimY; })
                        .style("fill", getFillColor)
                        .style("stroke", "#777")
                        .style("stroke-width", dimX * borderFactor)

                    path.selectAll()
                        .data(results.startPosition)
                        .enter().append("rect")
                        .attr("class", "square")
                        .attr("x", function(d) { return d.x * (dimX + padX) + 0.5; })
                        .attr("y", function(d) { return d.y * (dimY + padY) + 0.5; })
                        .attr("width", function(d) { return dimX; })
                        .attr("height", function(d) { return dimY; })
                        .style("fill", getFillColor)
                        .style("stroke", "#777")
                        .style("stroke-width", dimX * borderFactor)

                    path.selectAll()
                        .data(results.endPosition)
                        .enter().append("rect")
                        .attr("class", "square")
                        .attr("x", function(d) { return d.x * (dimX + padX) + 0.5; })
                        .attr("y", function(d) { return d.y * (dimY + padY) + 0.5; })
                        .attr("width", function(d) { return dimX; })
                        .attr("height", function(d) { return dimY; })
                        .style("fill", getFillColor)
                        .style("stroke", "#777")
                        .style("stroke-width", dimX * borderFactor)

                    if (!resultsIt.done)
                    {
                        timeout = setTimeout(MazeIterate, settings.getValue("Delay"));
                    }
                    else
                    {
                        console.log(results);
                    }
                })();

                // row.selectAll(".textA")
                //     .data(function(d) { return d; })
                //     .enter().append("text")
                //     .text(function(d) { return d.cost; })
                //     .attr("class", "textA")
                //     .attr("text-anchor", "middle")
                //     .attr("alignment-baseline", "middle")
                //     .attr("x", function(d) { return d.x * (dimX + padX) + 0.5 + dimX * 0.5; })
                //     .attr("y", function(d) { return d.y * (dimY + padY) + 0.5 + dimY * 0.3; })
                //     .attr("font-size", "0.75em")
                //     .style("fill", getTextColor)
                //
                // row.selectAll(".textB")
                //     .data(function(d) { return d; })
                //     .enter().append("text")
                //     .text(function(d) { return d.heuristic; })
                //     .attr("class", "textB")
                //     .attr("text-anchor", "middle")
                //     .attr("alignment-baseline", "middle")
                //     .attr("x", function(d) { return d.x * (dimX + padX) + 0.5 + dimX * 0.5; })
                //     .attr("y", function(d) { return d.y * (dimY + padY) + 0.5 + dimY * 0.7; })
                //     .attr("font-size", "0.75em")
                //     .style("fill", getTextColor)
            }
        }
        else
        {
            var results;

            console.log(settings.getValue("Algorithm").label);
            switch (settings.getValue("Algorithm").index) {
                case 0:
                    results = ai.mazeBacktracking(maze, startPosition, endPosition);
                    break;
                case 1:
                    results = ai.mazeBreadthSearch(maze, startPosition, endPosition);
                    break;
                case 2:
                    results = ai.mazeDepthSearch(maze, startPosition, endPosition);
                    break;
                case 3:
                    results = ai.mazeOrderedSearch(maze, startPosition, endPosition);
                    break;
                case 4:
                    results = ai.mazeGreedySearch(maze, startPosition, endPosition);
                    break;
                case 5:
                    results = ai.mazeAStar(maze, startPosition, endPosition);
                    break;
                case 6:
                    results = ai.mazeIDAStar(maze, startPosition, endPosition);
                    break;
            }

            console.log(results)
        }
    });
});
