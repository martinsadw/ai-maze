requirejs(["ai/ai"],
function(ai)
{
    function main()
    {
        // var mazeDimensions = [8, 8, 8, 3];
        // var startPosition = [0, 0, 0, 0];
        // var endPosition = [7, 7, 5, 2];
        // var results;

        var mazeDimensions = [30, 30];
        var startPosition = [0, 0];
        var endPosition = [mazeDimensions[0] - 1, mazeDimensions[1] - 1];
        var results;

        var maze = ai.generateMaze(mazeDimensions, 7);
        // results = ai.mazeBacktracking(maze, startPosition, endPosition);
        // console.log(results);
        // results = ai.mazeBreadthSearch(maze, startPosition, endPosition);
        // console.log(results);
        // results = ai.mazeDepthSearch(maze, startPosition, endPosition);
        // console.log(results);
        // results = ai.mazeOrderedSearch(maze, startPosition, endPosition);
        // console.log(results);
        // results = ai.mazeGreedySearch(maze, startPosition, endPosition);
        // console.log(results);
        // results = ai.mazeAStar(maze, startPosition, endPosition);
        // console.log(results);
        // results = ai.mazeIDAStar(maze, startPosition, endPosition);
        // console.log(results);

        if (maze.ndim == 2)
        {
            var dimX = 20;
            var dimY = 20;

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

            var grid = d3.select("#maze")
                .append("svg")
                .attr("width", (mazeDimensions[0] * (dimX + padX) + 10) + "px")
                .attr("height", (mazeDimensions[1] * (dimY + padY) + 10) + "px");

            var iterator = ai.mazeAStarIt(maze, startPosition, endPosition);

            (function MazeIterate()
            {
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
                    setTimeout(MazeIterate, 50);
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

    main();
});
