export default class VertexBuffer{
    constructor(gl , bufferType){
        this.rendererID = gl.createBuffer();
        gl.bindBuffer(bufferType , this.rendererID);
    }

    bind(gl){
        gl.bindBuffer(this.rendererID);
    }
    unbind(gl){
        gl.bindBuffer(null);
    }
    destructor(){
        delete this;
    }
    
    addBufferData(gl , bufferType , data , drawType){
        gl.bufferData(bufferType, data, drawType);
    }
    
}