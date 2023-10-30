const output_label:HTMLElement = <HTMLElement> document.getElementById("compatibility-check");

if(navigator.gpu)
{
    output_label.innerText = "This browser can support WebGPU";
}
else
{
    output_label.innerText = "This browser can't support WebGPU";

}