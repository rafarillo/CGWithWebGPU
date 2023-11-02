import { Render } from "./rendert";

const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("myCanvas");
if(!canvas)
{
    console.log("Could not find canvas");
}

let rend:Render = new Render(canvas);
