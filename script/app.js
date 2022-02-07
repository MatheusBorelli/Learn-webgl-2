import Shader from "./Shader.js";
import VertexBuffer from "./VertexBuffer.js";
import { resizeDisplay , GetFPS } from "./WebglUtils/WebglUtils.js";
import Matrix3 from "./Utils/Matrix3.js";

const canvas = document.querySelector("#Canvas")
const gl = canvas.getContext("webgl2")
if(!gl){
    console.log("WebGL 2 is unnavaible for you")
}
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

//Compile and Shader Stuff
const shaderSource = ["./assets/shaders/VertexShader.glsl","./assets/shaders/FragmentShader.glsl"]

const shader = new Shader(gl , shaderSource , 10);

// Buffer Stuff
const vertexBufferObject = new VertexBuffer(gl , gl.ARRAY_BUFFER)

const unit = (canvas.width  / 16);

const positions = [
    0.0,          0.0,
    3.0*unit,     0.0,
    0.0,          3.0*unit,
    0.0,          3.0*unit,
    3.0*unit,     3.0*unit,
    3.0*unit,     0.0
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

//requestAnimationFrame(draw);
let positionObject = [30 , 30];

let angle = -10%360;
//1rad × 180/π = 57°
angle = (angle * Math.PI)/180;
let rotation = [Math.sin(angle) , Math.cos(angle)];

let scale = [0.85 , 0.85];

let then = 0;

let translationMatrix = Matrix3().translation( positionObject[0] , positionObject[1] );
let rotationMatrix    = Matrix3().rotation( rotation[0] , rotation[1] );
let scaleMatrix       = Matrix3().scaling( scale[0] , scale[1] );
//let matrix = Matrix3().multiply(scaleMatrix, rotationMatrix);
//matrix = Matrix3().multiply( matrix , translationMatrix);

function draw(){
    
    //now *= 0.001;
    //const deltaTime = now - then
    //then = now;
    //const fps  = 1 / deltaTime;
    
    resizeDisplay(gl.canvas);
    gl.viewport( 0 , 0 , gl.canvas.width , gl.canvas.height);
    gl.clearColor(0 , 0 , 0 , 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shader.bind(gl);
    gl.bindVertexArray(vao);

    shader.setUniform2f(gl , "u_resolution" , gl.canvas.width ,  gl.canvas.height);
    //shader.setUniform2fv(gl , "u_translation" , positionObject)
    //shader.setUniform2fv(gl , "u_rotation" , rotation);
    //shader.setUniform2fv(gl , "u_scale", scale);
    
    let matrix = Matrix3().identity();

    for(let i = 0 ; i < 5 ; i++){
        matrix = Matrix3().multiply( matrix , rotationMatrix);
        matrix = Matrix3().multiply( matrix , scaleMatrix);
        matrix = Matrix3().multiply( matrix , translationMatrix);
        
        shader.setUniformMat3f(gl , "u_matrix" , matrix);

        const primitiveType = gl.TRIANGLES
        const count = 6

        gl.drawArrays(primitiveType, 0 , count)
    }
    console.log(matrix)
    //console.log(fps);
    //requestAnimationFrame(draw);
}

draw()