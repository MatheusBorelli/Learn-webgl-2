export default class VertexBuffer{
    constructor(gl , bufferType){
        this.rendererID = gl.createBuffer();
        gl.bindBuffer(bufferType , this.rendererID);
    }

    bind(gl){
        gl.bindVertexArray(this.rendererID);
    }
    unbind(gl){
        gl.bindVertexArray(null);
    }
    destructor(){
        delete this;
    }
    
    addBufferData(gl , bufferType , data , drawType){
        gl.bufferData(bufferType, data, drawType);
    }
    
}