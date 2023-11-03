import { Render } from "./rendert";
import { TriangleMesh } from "./triangleMesh";

const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("myCanvas");
if(!canvas)
{
    console.log("Could not find canvas");
}

const rand = (min=-1, max=1) =>{
    return min + Math.random() * (max - min);
}

const triangles:TriangleMesh[] = [];
const aspect:number = canvas.width/canvas.height; 
for(let i = 0; i < 100; i++)
{
    triangles.push(new TriangleMesh(
        [rand(0.2, 0.5)/aspect, rand(0.2, 0.5)],
        [rand(0, 1), rand(0, 1), rand(0, 1), 1.0],
        [rand(-0.9, 0.9), rand(-0.9, 0.9)]
    ))
}

let rend:Render = await Render.Build(canvas, triangles);

rend.ResizingCanvasRender();
