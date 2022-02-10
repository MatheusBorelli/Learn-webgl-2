import Shader from "./Shader.js";
import VertexBuffer from "./VertexBuffer.js";
import { Matrix4 } from "./Utils/MatrixMath.js";
import { resizeDisplay , getFPS} from "./WebglUtils/WebglUtils.js";

const canvas = document.querySelector("#Canvas")
const gl = canvas.getContext("webgl2")
if(!gl){
    console.log("WebGL 2 is unnavaible for you")
}
gl.enable(gl.BLEND);
gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

//Compile and Shader Stuff
const shaderSource = ["./assets/shaders/3DVertexShader.glsl","./assets/shaders/3DFragmentShader.glsl"]
const shader = new Shader(gl , shaderSource , 10);

const maxDepth = 400;
resizeDisplay(gl.canvas);
const unitX = (gl.canvas.clientWidth  / 16);
const unitY = (gl.canvas.clientHeight  / 16);
const unitZ = maxDepth / 16;

// Buffer Stuff
const vertexBufferObject = new VertexBuffer(gl , gl.ARRAY_BUFFER)

const positions = [
    0.0,            0.0,         0,
    3.0 * unitX,    0.0,         0,
    0.0,            3.0 * unitY, 0,
    
    0.0,            3.0 * unitY, 0,
    3.0 * unitX,    3.0 * unitY, 0,
    3.0 * unitX,    0.0,         0
];

vertexBufferObject.addBufferData(gl,
     gl.ARRAY_BUFFER,
     new Float32Array(positions),
     gl.STATIC_DRAW);

// Vertex Array Object
const vao = gl.createVertexArray();

gl.bindVertexArray(vao);

gl.enableVertexAttribArray(0);

const size = 3;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;
gl.vertexAttribPointer(
    0, size, type, normalize, stride, offset
);
gl.bindVertexArray(vao);

shader.bind(gl);

let positionObject = [100 , 100, 0];

let xAngle = 0%360;
let yAngle = 0%360;
let zAngle = 0%360;
//1rad  = 57° * π / 180
xAngle = (xAngle * Math.PI)/180;
yAngle = (yAngle * Math.PI)/180;
zAngle = (zAngle * Math.PI)/180;

let scale = [1 , 1, 0];

//requestAnimationFrame(draw);

function draw(now){
    resizeDisplay(gl.canvas);
    gl.viewport( 0 , 0 , gl.canvas.width , gl.canvas.height);
    gl.clearColor(0 , 0 , 0 , 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shader.bind(gl);
    gl.bindVertexArray(vao);
    
    let matrix = Matrix4.identity();

    matrix = Matrix4.projection ( gl.canvas.clientWidth, gl.canvas.clientHeight, maxDepth);
    matrix = Matrix4.translate  ( matrix , positionObject[0] , positionObject[1], positionObject[2] );
    matrix = Matrix4.xRotate    ( matrix , xAngle );
    matrix = Matrix4.yRotate    ( matrix , yAngle );
    matrix = Matrix4.zRotate    ( matrix , zAngle );
    matrix = Matrix4.scale      ( matrix , scale[0] , scale[1] , scale[2]);
    //matrix = Matrix4.translate  ( matrix , -1.5*unitX , -1.5*unitY, 0 );
    
    shader.setUniformMat4f(gl , "u_matrix" , matrix);

    const primitiveType = gl.TRIANGLES;
    const count = 6;

    gl.drawArrays(primitiveType, 0 , count);
    //requestAnimationFrame(draw);
}

draw()