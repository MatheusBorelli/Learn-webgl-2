import Shader from "./Shader.js";
import VertexBuffer from "./VertexBuffer.js";
import { Matrix4 } from "./Utils/MatrixMath.js";
import { resizeDisplay } from "./WebglUtils/WebglUtils.js";
import setGeometry from "./SetGeometry.js";
import setColors from "./SetColor.js";
import createSliderBar from "./Utils/SlideBar.js";

export function main3D(gl){
    gl.enable(gl.BLEND);
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    function turnOff3D(){
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
    }

    //Compile and Shader Stuff
    const shaderSource = ["./assets/shaders/3DVertexShader.glsl","./assets/shaders/3DFragmentShader.glsl"]
    const shader = new Shader(gl , shaderSource , 10);

    const maxDepth = gl.canvas.maxDepth;
    resizeDisplay(gl.canvas);
    
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

    /*  
        Sliders Variables
    */
    let positionObject = [0 , 0, -gl.canvas.height];
    let rotation = [ degToRad(0) , degToRad(0) , degToRad(0)]
    //1rad  = 57° * π / 180
    function degToRad(degAngle){
        return (degAngle * Math.PI)/180
    }
    function radToDeg(radAngle){
        return (radAngle * 180)/Math.PI
    }

    let scale = [ 1, 1, 1];// EM 3D NUNCA ESQUECA ISSO AKI EM 0

    let fieldOfViewRad = degToRad(80);
    
    let shear = [0 , 0 , 0]
    {
        //////////////////
        ///FIELD OF VIEW//
        //////////////////
        createSliderBar({ sliderName: 'fieldOfView', minVal: 50, maxVal: 120, defaultVal: radToDeg(fieldOfViewRad), callback: updateFieldOfView() })
        function updateFieldOfView(){
            return (value) => {
                fieldOfViewRad = degToRad(value);
                draw();
            } 
        }

        /////////////////
        ///TRANSLATION///
        /////////////////

        createSliderBar({ sliderName: 'X', minVal: -gl.canvas.clientWidth, maxVal: gl.canvas.clientWidth, defaultVal: positionObject[0], callback: updateTranslation(0) })

        createSliderBar({ sliderName: 'Y', minVal: -gl.canvas.clientHeight, maxVal: gl.canvas.clientHeight, defaultVal: positionObject[1], callback: updateTranslation(1) })

        createSliderBar({ sliderName: 'Z', minVal: -gl.canvas.clientHeight, maxVal: gl.canvas.clientHeight, defaultVal: positionObject[2], callback: updateTranslation(2) })

        function updateTranslation(index) {
            return (value) => {
                positionObject[index] = value;
                draw();
            }
        }

        //////////////
        ///ROTATION///
        //////////////

        createSliderBar({sliderName: 'angleX',minVal: 0,maxVal: 360,defaultVal: rotation[0],callback: updateRotation(0)})

        createSliderBar({sliderName: 'angleY',minVal: 0,maxVal: 360,defaultVal: rotation[1],callback: updateRotation(1)})

        createSliderBar({sliderName: 'angleZ',minVal: 0,maxVal: 360,defaultVal: rotation[2],callback: updateRotation(2)})
        
        function updateRotation(index) {
            return function (value) {
                rotation[index] = degToRad(value);
                draw();
            }
        }

        ////////////////
        /////SCALE//////
        ////////////////

        createSliderBar({ sliderName: 'scale X', minVal: -5, maxVal: 5, defaultVal: scale[0], callback: updateScale(0),step: 0.01})

        createSliderBar({sliderName: 'scale Y',minVal: -5,maxVal: 5,defaultVal: scale[1],callback: updateScale(1),step: 0.01})

        createSliderBar({sliderName: 'scale Z',minVal: -5,maxVal: 5,defaultVal: scale[2],callback: updateScale(2),step: 0.01})

        function updateScale(index) {
            return function (value) {
                scale[index] = value;
                draw();
            }
        }

        ////////////////
        /////SHEAR//////
        ////////////////

        createSliderBar({sliderName: 'shear X',minVal: -5, maxVal: 5, defaultVal: shear[0], callback: updateShear(0),step: 0.1})

        createSliderBar({sliderName: 'shear Y',minVal: -5,maxVal: 5, defaultVal: shear[1],callback: updateShear(1),step: 0.1})

        createSliderBar({sliderName: 'shear Z',minVal: -5,maxVal: 5, defaultVal: shear[2],callback: updateShear(2),step: 0.1})

        function updateShear(index) {
            return function (value) {
                shear[index] = value;
                draw();
            }
        }
    }

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

        // ORTHOGRAPHIC WAY
        //
        //let left = 0;
        //let right = gl.canvas.clientWidth;
        //let bottom = gl.canvas.clientHeight;
        //let top = 0;
        //let near = maxDepth;
        //let far = (-maxDepth);
        //matrix = Matrix4.orthographic( left, right, bottom, top, near, far);
        
        let aspect = gl.canvas.width/gl.canvas.height;
        let zNear  = 1
        let zFar   = 2000

        let matrix = Matrix4.perspective (fieldOfViewRad, aspect , zNear , zFar);
        matrix = Matrix4.translate   ( matrix , positionObject[0] , positionObject[1], positionObject[2] );
        matrix = Matrix4.xRotate     ( matrix , rotation[0] );
        matrix = Matrix4.yRotate     ( matrix , rotation[1] );
        matrix = Matrix4.zRotate     ( matrix , rotation[2] );
        matrix = Matrix4.scale       ( matrix , scale[0] , scale[1] , scale[2]);
        matrix = Matrix4.shear       ( matrix , shear[0] , shear[1] , shear[2]);

        shader.setUniformMat4f(gl , "u_matrix" , matrix);

        const primitiveType = gl.TRIANGLES;
        const count = 16 * 6;

        gl.drawArrays(primitiveType, 0 , count);
        turnOff3D();
        //requestAnimationFrame(draw)
    }

    return {
        draw: draw()
    }
}