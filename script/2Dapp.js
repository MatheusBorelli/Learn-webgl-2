import Shader from "./Shader.js";
import VertexBuffer from "./VertexBuffer.js";
import { Matrix3 } from "./Utils/MatrixMath.js";
import { resizeDisplay , getFPS} from "./WebglUtils/WebglUtils.js";

export function main2D(gl , canvas){
    gl.enable(gl.BLEND);
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    //Compile and Shader Stuff
    const shaderSource = ["./assets/shaders/VertexShader.glsl","./assets/shaders/FragmentShader.glsl"]
    const shader = new Shader(gl , shaderSource , 10);

    // Buffer Stuff
    const vertexBufferObject = new VertexBuffer(gl , gl.ARRAY_BUFFER)

    resizeDisplay(gl.canvas);
    const unitX = (gl.canvas.clientWidth  / 16);
    const unitY = (gl.canvas.clientHeight  / 16);

    const positions = [
        0.0,            0.0,
        3.0 * unitX,    0.0,
        0.0,            3.0 * unitY,
        0.0,            3.0 * unitY,
        3.0 * unitX,    3.0 * unitY,
        3.0 * unitX,    0.0
    ];

    vertexBufferObject.addBufferData(gl,
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.DYNAMIC_DRAW);

    // Vertex Array Object
    const vao = gl.createVertexArray();

    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(0);

    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
        0, size, type, normalize, stride, offset
    );
    gl.bindVertexArray(vao);

    shader.bind(gl);

    let positionObject = [100 , 100];

    let angle = 10%360;
    //1rad  = 57° * π / 180
    angle = (angle * Math.PI)/180;

    let scale = [1.2 , 1.2];
    
    function draw(now){
        resizeDisplay(gl.canvas);
        gl.viewport( 0 , 0 , gl.canvas.width , gl.canvas.height);
        gl.clearColor(0.08, 0.086, 0.09, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        shader.bind(gl);
        gl.bindVertexArray(vao);
        
        let matrix = Matrix3.identity();

        matrix = Matrix3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = Matrix3.translate ( matrix , positionObject[0] , positionObject[1] );
        matrix = Matrix3.rotate    ( matrix , angle );
        matrix = Matrix3.scale     ( matrix , scale[0] , scale[1] );
        //matrix = Matrix3.translate ( matrix , -1.5*unitX , -1.5*unitY );
        
        shader.setUniformMat3f(gl , "u_matrix" , matrix);

        const primitiveType = gl.TRIANGLES;
        const count = 6;

        gl.drawArrays(primitiveType, 0 , count);
        requestAnimationFrame(draw);
    }
    return {
        draw(now){draw(now)}
    };
}