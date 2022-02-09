export function resizeDisplay( canvas ){
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize = canvas.width !== displayWidth ||
                        canvas.height !== displayHeight;

    if(needResize){
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
}

export function getFPS(currentTime){
    if( typeof getFPS.lastTime == 'undefined'){ 
        getFPS.lastTime = 0;
    }
    
    currentTime *= 0.001
    
    const deltaTime = currentTime - getFPS.lastTime
    getFPS.lastTime = currentTime;
    
    const fps  = 1 / deltaTime;

    return fps
}