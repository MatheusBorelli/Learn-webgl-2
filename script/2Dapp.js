import Shader from "./Shader.js";
import VertexBuffer from "./VertexBuffer.js";
import { Matrix3 } from "./Utils/MatrixMath.js";
import { resizeDisplay , getFPS} from "./WebglUtils/WebglUtils.js";
import createSliderBar, { destroySlideBar } from "./Utils/SlideBar.js";

export function main2D(gl){
    gl.enable(gl.BLEND);
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    //Compile and Shader Stuff
    const shaderSource = ["./assets/shaders/VertexShader.glsl","./assets/shaders/FragmentShader.glsl"]
    const shader = new Shader(gl , shaderSource , 10);

    // Buffer Stuff
    const vertexBufferObject = new VertexBuffer(gl , gl.ARRAY_BUFFER)

    resizeDisplay(gl.canvas);
    const unitX = (gl.canvas.clientWidth  / 16);
    const unitY = (gl.canvas.clientHeight / 16);

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

    let positionObject = [Math.round(gl.canvas.clientWidth/3) , Math.round(gl.canvas.clientHeight/3)];

    let angle = 0%360;
    //1rad  = 57° * π / 180
    function degToRad(degrees){
        return (degrees * Math.PI)/180;
    }

    let scale = [1.2 , 1.2];

    let shear = [0 , 0];
    //Scope of slider creation
    {
        createSliderBar({
            sliderName: 'X',
            minVal: 0,
            maxVal: gl.canvas.clientWidth,
            defaultVal: positionObject[0],
            callback: updateTranslation(0)
        })
        createSliderBar({
            sliderName: 'Y',
            minVal: 0,
            maxVal: gl.canvas.clientHeight,
            defaultVal: positionObject[1],
            callback: updateTranslation(1)
        })
        function updateTranslation(index){
            return function(value){
                positionObject[index] = value;
                draw();
            }
        }
        createSliderBar({
            sliderName: 'Rotation',
            minVal: -360,
            maxVal: 360,
            defaultVal: angle,
            callback: updateRotation()
        })
        function updateRotation(){
            return function(value){
                angle = degToRad(value);
                draw();
            }
        }
        createSliderBar({
            sliderName: 'scale X',
            minVal: -5,
            maxVal: 5,
            defaultVal: scale[0],
            callback: updateScale(0),
            step: 0.01
        })
        createSliderBar({
            sliderName: 'scale Y',
            minVal: -5,
            maxVal: 5,
            defaultVal: scale[1],
            callback: updateScale(1),
            step: 0.01
        })
        function updateScale(index){
            return function(value){
                scale[index] = value;
                draw();
            }
        }
        createSliderBar({
            sliderName: 'shearX',
            minVal: -5,
            maxVal: 5,
            defaultVal: shear,
            callback: updateShear(0),
            step:0.01
        })
        createSliderBar({
            sliderName: 'shearY',
            minVal: -5,
            maxVal: 5,
            defaultVal: shear,
            callback: updateShear(1),
            step:0.01
        })
        function updateShear(index){
            return function(value){
                shear[index] = value;
                draw();
            }
        }
    }

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
        matrix = Matrix3.scale     ( matrix , scale[0] , scale[1]);
        matrix = Matrix3.shear     ( matrix , shear[0] , shear[1]);
        
        shader.setUniformMat3f(gl , "u_matrix" , matrix);

        const primitiveType = gl.TRIANGLES;
        const count = 6;

        gl.drawArrays(primitiveType, 0 , count);
        //requestAnimationFrame(draw);
    }

    return {
        draw: draw()
    };
}