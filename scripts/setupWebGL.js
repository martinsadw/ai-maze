define([],
function()
{
    function createShader(gl, type, source)
    {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

        if (success)
        {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    function createProgram(gl, vertexShader, fragmentShader)
    {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS)

        if (success)
        {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteShader(shader);
    }

    var canvas = document.getElementById("maze");
    gl = canvas.getContext("webgl");
    if (!gl)
    {
        return;
    }

    // var vertexShaderSource = document.getElementById("vertex-shader").text;
    // var fragmentShaderSource = document.getElementById("fragment-shader").text;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    return {
        gl: gl,
        program: program,
        // vertexShader: vertexShader,
        // fragmentShader: fragmentShader,
    };
});
