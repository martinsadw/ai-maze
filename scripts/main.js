requirejs(["ai/ai", "setupWebGL"],
function(ai, glInfo)
{
    function main()
    {
        var gl = glInfo.gl;
        var program = glInfo.program;

        var positionLocation = gl.getAttribLocation(program, "a_position");
        var colorLocation = gl.getAttribLocation(program, "a_color");

        var matrixLocation = gl.getUniformLocation(program, "u_matrix");

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        setGeometry(gl);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        setColors(gl);

        var angleInDegrees = 0;
        var angleInRadians = angleInDegrees * Math.PI / 180;

        var translation = [400, 250];
        var rotation = [Math.sin(angleInRadians), Math.cos(angleInRadians)];
        var scale = [50, 50];
        var origin = [0.5, 0.5];

        var prevTime = 0;
        requestAnimationFrame(drawScene);

        // var mazeDimensions = [8, 8, 8, 3];
        // var startPosition = [0, 0, 0, 0];
        // var endPosition = [7, 7, 5, 2];
        // var results;

        var mazeDimensions = [8, 8];
        var startPosition = [0, 0];
        var endPosition = [7, 7];
        var results;

        var maze = ai.generateMaze(mazeDimensions);
        results = ai.mazeBacktracking(maze, startPosition, endPosition);
        console.log(results);
        results = ai.mazeBreadthSearch(maze, startPosition, endPosition);
        console.log(results);
        results = ai.mazeDepthSearch(maze, startPosition, endPosition);
        console.log(results);
        results = ai.mazeOrderedSearch(maze, startPosition, endPosition);
        console.log(results);

        function drawScene(newTime)
        {
            var dT = (newTime - prevTime) * 0.001;

            webglUtils.resizeCanvasToDisplaySize(gl.canvas);

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);

            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            var size = 2;
            var type = gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

            gl.enableVertexAttribArray(colorLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

            var size = 4;
            var type = gl.UNSIGNED_BYTE;
            var normalize = true;
            var stride = 0;
            var offset = 0;
            gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

            var matrixProjection = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
            var matrixTransform = m3.identity();
            // matrixTransform = m3.translate(matrixTransform, translation[0], translation[1]);
            matrixTransform = m3.rotate(matrixTransform, angleInRadians);
            matrixTransform = m3.scale(matrixTransform, scale[0], scale[1]);
            matrixTransform = m3.translate(matrixTransform, -origin[0], -origin[1]);

            // gl.uniformMatrix3fv(matrixLocation, false, matrix);

            matrixTransform = m3.multiply(m3.translation(translation[0], translation[1]), matrixTransform);

            if (maze.ndim == 2)
            {
                // for (var j = 0; j < maze.shape[1]; ++j)
                // {
                //     for (var i = 0; i < maze.shape[0]; ++i)
                //     {
                //         var newMatrixTransform = m3.multiply(m3.translation(i*52, j*52), matrixTransform);
                //         // if (getMazePos(maze, [i, j]) == 1)
                //         {
                //             gl.uniformMatrix3fv(matrixLocation, false, m3.multiply(matrixProjection, newMatrixTransform));
                //
                //             var primitiveType = gl.TRIANGLES;
                //             var offset = 0;
                //             var count = 6;
                //             gl.drawArrays(primitiveType, offset, count);
                //         }
                //     }
                // }

                for (var i = 0; i < results.path.length; ++i)
                {
                    var coord = ai.flattenToCoord(results.path[i].flatten, maze.shape);

                    var newMatrixTransform = m3.multiply(m3.translation(coord[0]*60, coord[1]*60), matrixTransform);

                    // if (getMazePos(maze, [i, j]) == 1)
                    {
                        gl.uniformMatrix3fv(matrixLocation, false, m3.multiply(matrixProjection, newMatrixTransform));

                        var primitiveType = gl.TRIANGLES;
                        var offset = 0;
                        var count = 6;
                        gl.drawArrays(primitiveType, offset, count);
                    }

                    // TODO(andre:2017-11-23): Rewrite this code
                    if (i > 0)
                    {
                        var prevCoord = ai.flattenToCoord(results.path[i-1].flatten, maze.shape);

                        var deltaX = coord[0] - prevCoord[0];
                        var deltaY = coord[1] - prevCoord[1];
                        var angle = -Math.atan2(deltaY, deltaX);

                        var tempTransform = m3.identity();

                        tempTransform = m3.translate(tempTransform, deltaX * 0.5 * 60, deltaY * 0.5 * 60);
                        tempTransform = m3.translate(tempTransform, prevCoord[0]*60, prevCoord[1]*60);
                        tempTransform = m3.translate(tempTransform, translation[0], translation[1]);
                        tempTransform = m3.rotate(tempTransform, angle);
                        tempTransform = m3.scale(tempTransform, scale[0], scale[1] * 0.1);
                        tempTransform = m3.translate(tempTransform, -origin[0], -origin[1]);

                        {
                            gl.uniformMatrix3fv(matrixLocation, false, m3.multiply(matrixProjection, tempTransform));

                            var primitiveType = gl.TRIANGLES;
                            var offset = 0;
                            var count = 6;
                            gl.drawArrays(primitiveType, offset, count);
                        }
                    }
                }

                for (var j = 0; j < maze.shape[1]; ++j)
                {
                    for (var i = 0; i < maze.shape[0]; ++i)
                    {
                    }
                }
            }

            requestAnimationFrame(drawScene);
        }
    }

    function setColors(gl)
    {
        var r1 = Math.random() * 256;
        var b1 = Math.random() * 256;
        var g1 = Math.random() * 256;

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Uint8Array([
                r1, b1, g1, 255,
                r1, b1, g1, 255,
                r1, b1, g1, 255,
                r1, b1, g1, 255,
                r1, b1, g1, 255,
                r1, b1, g1, 255,
            ]),
            gl.STATIC_DRAW
        );
    }

    function setGeometry(gl)
    {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                0, 0,
                0, 1,
                1, 1,

                1, 1,
                1, 0,
                0, 0,
            ]),
            gl.STATIC_DRAW
        );
    }
    var m3 = {
        translation: function(tx, ty) {
            return [
                 1,  0, 0,
                 0,  1, 0,
                tx, ty, 1,
            ];
        },

        rotation: function(angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            return [
                c, -s, 0,
                s,  c, 0,
                0,  0, 1,
            ];
        },

        scaling: function(sx, sy) {
            return [
                sx,  0, 0,
                 0, sy, 0,
                 0,  0, 1,
            ];
        },

        multiply: function(a, b) {
            var a00 = a[0 * 3 + 0];
            var a01 = a[0 * 3 + 1];
            var a02 = a[0 * 3 + 2];
            var a10 = a[1 * 3 + 0];
            var a11 = a[1 * 3 + 1];
            var a12 = a[1 * 3 + 2];
            var a20 = a[2 * 3 + 0];
            var a21 = a[2 * 3 + 1];
            var a22 = a[2 * 3 + 2];
            var b00 = b[0 * 3 + 0];
            var b01 = b[0 * 3 + 1];
            var b02 = b[0 * 3 + 2];
            var b10 = b[1 * 3 + 0];
            var b11 = b[1 * 3 + 1];
            var b12 = b[1 * 3 + 2];
            var b20 = b[2 * 3 + 0];
            var b21 = b[2 * 3 + 1];
            var b22 = b[2 * 3 + 2];
            return [
              b00 * a00 + b01 * a10 + b02 * a20,
              b00 * a01 + b01 * a11 + b02 * a21,
              b00 * a02 + b01 * a12 + b02 * a22,
              b10 * a00 + b11 * a10 + b12 * a20,
              b10 * a01 + b11 * a11 + b12 * a21,
              b10 * a02 + b11 * a12 + b12 * a22,
              b20 * a00 + b21 * a10 + b22 * a20,
              b20 * a01 + b21 * a11 + b22 * a21,
              b20 * a02 + b21 * a12 + b22 * a22,
            ];
        },

        identity: function() {
            return [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ];
        },

        projection: function(width, height) {
            return [
                2 / width,           0, 0,
                        0, -2 / height, 0,
                       -1,           1, 1,
            ];
        },

        translate: function(m, tx, ty) {
            return m3.multiply(m, m3.translation(tx, ty));
        },

        rotate: function(m, angleInRadians) {
            return m3.multiply(m, m3.rotation(angleInRadians));
        },

        scale: function(m, sx, sy) {
            return m3.multiply(m, m3.scaling(sx, sy));
        },
    };

    main();
});
