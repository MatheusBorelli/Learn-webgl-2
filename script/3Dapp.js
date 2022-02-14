import Shader from "./Shader.js";
import VertexBuffer from "./VertexBuffer.js";
import { Matrix4 } from "./Utils/MatrixMath.js";
import { resizeDisplay , getFPS} from "./WebglUtils/WebglUtils.js";
import setGeometry from "./SetGeometry.js";
import setColors from "./SetColor.js";

export function main3D(gl, canvas){
    gl.enable(gl.BLEND);
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    function turnOff3D(){
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
    }

    //Compile and Shader Stuff
    const shaderSource = ["./assets/shaders/3DVertexShader.glsl","./assets/shaders/3DFragmentShader.glsl"]
    const shader = new Shader(gl , shaderSource , 10);

    const maxDepth = 400;
    resizeDisplay(gl.canvas);
    // const unitX = (gl.canvas.clientWidth  / 16);
    // const unitY = (gl.canvas.clientHeight  / 16);
    // const unitZ = maxDepth / 16;

    // Buffer Creation
    const positionBuffer = new VertexBuffer(gl, gl.ARRAY_BUFFER);
    setGeometry(gl);

    // Vertex Array Object for Position
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

    //Buffer Creation
    const colorBuffer = new VertexBuffer(gl ,gl.ARRAY_BUFFER);
    setColors(gl);

    // Vertex Array Object for Color
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(
        1, 3, gl.UNSIGNED_BYTE, true, 0, 0
    );

    gl.bindVertexArray(vao);
    shader.bind(gl);

    let positionObject = [gl.canvas.width/2 , gl.canvas.height/2, 0];
    let xAngle = 0%360;
    let yAngle = 30%360;
    let zAngle = 20%360;
    //1rad  = 57° * π / 180
    xAngle = (xAngle * Math.PI)/180;
    yAngle = (yAngle * Math.PI)/180;
    zAngle = (zAngle * Math.PI)/180;

    let scale = [ 1, 1, 1];// EM 3D NUNCA ESQUECA ISSO AKI EM 0

    draw();

    function draw(now){
        resizeDisplay(gl.canvas);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);    
        
        gl.viewport( 0 , 0 , gl.canvas.width , gl.canvas.height);
        gl.clearColor(0.08, 0.086, 0.09, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        shader.bind(gl);
        gl.bindVertexArray(vao);
        
        let matrix = Matrix4.identity();
        let left = 0;
        let right = gl.canvas.clientWidth;
        let bottom = gl.canvas.clientHeight;
        let top = 0;
        let near = maxDepth;
        let far = (-maxDepth);

        matrix = Matrix4.orthographic( left, right, bottom, top, near, far);
        matrix = Matrix4.translate   ( matrix , positionObject[0] , positionObject[1], positionObject[2] );
        matrix = Matrix4.xRotate     ( matrix , xAngle );
        matrix = Matrix4.yRotate     ( matrix , yAngle );
        matrix = Matrix4.zRotate     ( matrix , zAngle );
        matrix = Matrix4.scale       ( matrix , scale[0] , scale[1] , scale[2]);
        
        shader.setUniformMat4f(gl , "u_matrix" , matrix);

        const primitiveType = gl.TRIANGLES;
        const count = 16 * 6;

        gl.drawArrays(primitiveType, 0 , count);
        turnOff3D();
        requestAnimationFrame(draw)
    }
    return {draw(){draw()}}
}