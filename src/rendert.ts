import color from "./Shaders/color.wgsl"

export class Render
{
    canvas:HTMLCanvasElement;
    adapter!:GPUAdapter;
    device!:GPUDevice;
    context!:GPUCanvasContext

    constructor(canvas:HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.SetupDevice();
        this.SetContext();

        const format:GPUTextureFormat = <GPUTextureFormat>this.SetContext();
        if(!format)
        {
            console.log("Could not find format");
        }

        const module:GPUShaderModule = this.CreateShaderModule();
        const pipeline:GPURenderPipeline = this.CreatePipeline(module, format);

        this.Render(pipeline);
    }

    private async SetupDevice()
    {
        this.adapter = <GPUAdapter> await navigator.gpu.requestAdapter();
        if(!this.adapter) {
            console.log("Could not find adapter");
            return;
        }
        
        this.device = <GPUDevice> await this.adapter.requestDevice();
        if(!this.adapter) {
            console.log("Could not find device");
            return;
        }        
    }

    private SetContext():GPUTextureFormat|null
    {
        this.context = <GPUCanvasContext>this.canvas.getContext("webgpu");
        if(!this.context) {
            console.log("Could not find context");
            return null;
        }
        const format:GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format: format
        })
        return format;
    }

    private CreateShaderModule():GPUShaderModule
    {
        const module:GPUShaderModule = this.device.createShaderModule({
            label: "Hardcode red triangle shader",
            code: color
        })

        return module;
    }

    private CreatePipeline(module:GPUShaderModule, format:GPUTextureFormat): GPURenderPipeline
    {
        const pipeline:GPURenderPipeline = this.device.createRenderPipeline({
            label: "Hardcoded red triangle shader",
            layout: "auto",
            vertex: {
                module: module,
                entryPoint: "vs",
            },
            fragment: {
                module: module,
                entryPoint: "fs",
                targets: [{format: format}]
            },
        })

        return pipeline;
    }

    private CreateRenderPassDescriptor(view: GPUTextureView): GPURenderPassDescriptor
    {
        // list all textures that we will draw
        const renderPassDescriptor:GPURenderPassDescriptor = {
            label: "basic canvas renderPass",
            colorAttachments: [
                {
                    view: view,
                    clearValue: [0.3, 0.3, 0.3, 1],
                    loadOp: "clear", // clear to color above before draw
                    storeOp: "store", // store the result what we draw
                }
            ]
        }

        return renderPassDescriptor;
    }

    private Render(pipeline:GPURenderPipeline)
    {
        
        const renderPassDescriptor:GPURenderPassDescriptor = this.CreateRenderPassDescriptor(this.context.getCurrentTexture().createView())

        const encoder:GPUCommandEncoder = this.device.createCommandEncoder({label: "Our encoder"});
        const pass:GPURenderPassEncoder = encoder.beginRenderPass(renderPassDescriptor); // this could be went wrong

        pass.setPipeline(pipeline);
        pass.draw(3);

        pass.end();

        const commandBuffer:GPUCommandBuffer = encoder.finish();
        this.device.queue.submit([commandBuffer]);
    }
    
}