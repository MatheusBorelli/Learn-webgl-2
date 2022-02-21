import { main2D } from "./2Dapp.js";
import { main3D } from "./3Dapp.js";
import { destroySlideBar } from "./Utils/SlideBar.js";

const canvas = document.querySelector("#Canvas")
const gl = canvas.getContext("webgl2")
if(!gl){
    alert("Your device doesn't support WebGL 2")
}

const button2D = document.getElementById("2D-btn");
const button3D = document.getElementById("3D-btn");


button2D.addEventListener('click', () => {
    destroySlideBar()
    main2D(gl)
})

button3D.addEventListener('click', () => {
    destroySlideBar()
    main3D(gl)
})