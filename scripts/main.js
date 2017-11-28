requirejs(["ai/ai"],
function(ai)
{
    function main()
    {
        // var mazeDimensions = [8, 8, 8, 3];
        // var startPosition = [0, 0, 0, 0];
        // var endPosition = [7, 7, 5, 2];
        // var results;

        var mazeDimensions = [8, 8];
        var startPosition = [0, 0];
        var endPosition = [7, 7];
        var results;

        var maze = ai.generateMaze(mazeDimensions);
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
            var dimX = 50;
            var dimY = 50;

            var borderFactor = 0.024;

            var padX = 0;
            var padY = 0;

            var map = [];
            for (var i = 0; i < mazeDimensions[0]; ++i)
            {
                map[i] = [];

                for (var j = 0; j < mazeDimensions[1]; ++j)
                {
                    map[i][j] = {
                        x: i,
                        y: j,
                        id: maze.get(i, j),
                        cost: 10.24,
                        heuristic: 15.65,
                    };
                }
            }

            map[0][0].id = 2;
            map[7][7].id = 3;

            mapPath = [
                // { x: 0, y: 0, id: 4, },
                { x: 1, y: 0, id: 4, },
                { x: 2, y: 0, id: 4, },
                { x: 3, y: 1, id: 4, },
                { x: 2, y: 2, id: 4, },
                { x: 1, y: 3, id: 4, },
                { x: 0, y: 4, id: 4, },
                { x: 0, y: 5, id: 4, },
                { x: 0, y: 6, id: 4, },
                { x: 1, y: 7, id: 4, },
                { x: 2, y: 6, id: 4, },
                { x: 3, y: 5, id: 4, },
                { x: 4, y: 5, id: 4, },
                { x: 5, y: 5, id: 4, },
                { x: 6, y: 6, id: 4, },
                // { x: 7, y: 7, id: 4, },
            ]

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
                .attr("width", "510px")
                .attr("height", "510px");

            var iterator = ai.mazeBreadthSearch(maze, startPosition, endPosition);

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

                if (!resultsIt.done)
                    setTimeout(MazeIterate, 100);
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
