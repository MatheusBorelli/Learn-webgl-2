export default function createSliderBar(sliderObject={sliderName}){
    if(typeof createSliderBar.idList == 'undefined'){
        createSliderBar.idList = new Array()
    }
    
    let id = generateID();

    while(createSliderBar.idList.find( (value) => {if(value == id) return true})){
        id = generateID()
    }
    createSliderBar.idList.push(id)

    genSliderBar(id, sliderObject)
}

function generateID(){
    return Math.ceil(Math.random()*100);
}

function genSliderBar(id, sliderObject = {sliderName, minVal, maxVal, defaultVal, step}){
    if(!sliderObject || !sliderObject.sliderName) return;
    
    const name  = sliderObject.sliderName || null
    const min   = sliderObject.minVal || 0
    const max   = sliderObject.maxVal || 1
    const value = sliderObject.defaultVal || 0
    const step  = sliderObject.step || 1

    const slider = `
    <div class='slider'>
        <p>${name}: </p>

        <input class='slider-range' id='SB${id}-Input' type='range' value='${value}' min='${min}' max='${max}' step='${step}'></input>
        <span id='SV${id}-Value'>${value}</span>
    </div>
    `;
    const container = document.getElementById('container')
    container.insertAdjacentHTML('beforeend', slider)

    sliderObject.valueCtx  = document.querySelector(`#SV${id}-Value`)
    sliderObject.sliderCtx = document.querySelector(`#SB${id}-Input`)
    
    sliderObject.sliderCtx.addEventListener('input', () => updateValue(sliderObject))
}

function updateValue(object){
    object.value = object.sliderCtx.value
    object.valueCtx.textContent = object.value
    if(typeof object.callback != 'undefined'){
        object.callback(object.value)
    }
}

export function destroySlideBar(){
    const slider = document.getElementsByClassName('slider')
    for(let i = slider.length - 1 ; i >= 0; --i){
        slider[i].remove()
    }
}