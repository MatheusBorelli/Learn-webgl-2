import { main2D } from "./2Dapp.js";
import { main3D } from "./3Dapp.js";

const canvas = document.querySelector("#Canvas")
const gl = canvas.getContext("webgl2")
if(!gl){
    alert("WebGL 2 is unnavaible for you")
}

const button2D = document.getElementById("2D-btn");
const button3D = document.getElementById("3D-btn");

button2D.addEventListener("click", () => {
    requestAnimationFrame(main2D(gl, canvas).draw)
})
button3D.addEventListener("click", () => {
    requestAnimationFrame(main3D(gl, canvas).draw);
})