import HashTable from "./Utils/HashTable.js"
import { readFileText } from "./Utils/ReadFileText.js";

export default class Shader{
    constructor(gl , ShaderSource, cacheSize){
        
        const vertShader = compileShader(gl, gl.VERTEX_SHADER  , readFileText(ShaderSource[0]));
        const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, readFileText(ShaderSource[1]));
        
        this.rendererID = createProgram(gl , vertShader , fragShader),
        this.cacheLocation  = new HashTable(cacheSize)
    }
 
    setUniform1i(gl , uniformName, value){
        gl.uniform1i(getUniformLocation(gl, this, uniformName), value )
    }

    setUniform1iv(gl , uniformName, value){
        gl.uniform1iv(getUniformLocation(gl, this, uniformName), value )
    }
    // get simple floats one by one param
    setUniform1f(gl , uniformName, x){
        gl.uniform1f(getUniformLocation(gl, this, uniformName) , x )
    }
    setUniform2f(gl , uniformName, x , y ){
        gl.uniform2f(getUniformLocation(gl, this, uniformName) ,  x , y )
    }
    setUniform3f(gl , uniformName,  x , y , z ){
        gl.uniform3f(getUniformLocation(gl, this, uniformName) , x , y , z )
    }
    setUniform4f(gl , uniformName,  x , y , z , w){
        gl.uniform4f(getUniformLocation(gl, this, uniformName) , x , y , z , w )
    }
    //get floats vector
    setUniform2fv(gl , uniformName, value ){
        gl.uniform2fv(getUniformLocation(gl, this, uniformName) , value )
    }
    setUniform3fv(gl , uniformName,  value ){
        gl.uniform3fv(getUniformLocation(gl, this, uniformName) , value )
    }
    setUniform4fv(gl , uniformName,  value ){
        gl.uniform4fv(getUniformLocation(gl, this, uniformName) , value )
    }
    //matrix of 3x3 floats
    setUniformMat3f(gl , uniformName, value){
        gl.uniformMatrix3fv(getUniformLocation(gl, this, uniformName), gl.FALSE , value )
    }
    //matrix of 4x4 floats
    setUniformMat4f(gl , uniformName, value){
        gl.uniformMatrix4fv(getUniformLocation(gl, this, uniformName), gl.FALSE , value )
    }

    bind(gl){
        gl.useProgram(this.rendererID);
    }
    
    unbind(gl){
        gl.useProgram(null);
    }
    
    delete(gl){
        gl.deleteProgram(this.rendererID);
    }

    destructor(){
        delete this;
    }

}

function getUniformLocation(gl , shader , uniformName){
    if(shader.cacheLocation.getValue(uniformName))
        return shader.cacheLocation.getValue(uniformName)

    const location = gl.getUniformLocation(shader.rendererID, uniformName);
    
    if(location == -1)
        console.log(`Uniform ${uniformName} doesn't exist`)
    
    shader.cacheLocation.add(uniformName, location)

    return location;
}

function compileShader(gl , type , source){
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    
    if(success){
        return shader
    }
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

function createProgram(gl , vertexShader , fragmentShader){
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    let success = gl.getProgramParameter(program , gl.LINK_STATUS)
    
    if(success){
        return program;
    }

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

