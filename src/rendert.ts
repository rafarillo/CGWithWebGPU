import color from "./Shaders/color.wgsl"

export class Render
{
    private canvas:HTMLCanvasElement;
    private adapter!:GPUAdapter;
    private device!:GPUDevice;
    private context!:GPUCanvasContext;
    private pipeline!:GPURenderPipeline;

    constructor(canvas:HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.SetupDevice();
    }

    private SetupDevice()
    {
        navigator.gpu.requestAdapter().then((adapterValue: GPUAdapter|null) => {
            this.adapter = <GPUAdapter>adapterValue;
            if(!this.adapter) {
                console.log("Could not find adapter");
                return;
            }

            this.adapter.requestDevice().then((deviceValue:GPUDevice) => {
                this.device = deviceValue;
                const format:GPUTextureFormat = <GPUTextureFormat>this.SetContext();
                if(!format)
                {
                    console.log("Could not find format");
                }
    
                const module:GPUShaderModule = this.CreateShaderModule();
                this.pipeline = this.CreatePipeline(module, format);


                this.ResizingCanvas();

            });

            

        });
        
    }

    private ResizingCanvas() {
        const observer: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const obsCanvas = <HTMLCanvasElement>entry.target;
                const width = entry.contentBoxSize[0].inlineSize;
                const height = entry.contentBoxSize[0].blockSize;

                obsCanvas.width = Math.max(1, Math.min(width, this.device.limits.maxTextureDimension2D));
                obsCanvas.height = Math.max(1, Math.min(height, this.device.limits.maxTextureDimension2D));
                this.Render();
            }
        });

        observer.observe(this.canvas);
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

    Render()
    {
        
        const renderPassDescriptor:GPURenderPassDescriptor = this.CreateRenderPassDescriptor(this.context.getCurrentTexture().createView())

        const encoder:GPUCommandEncoder = this.device.createCommandEncoder({label: "Our encoder"});
        const pass:GPURenderPassEncoder = encoder.beginRenderPass(renderPassDescriptor); // this could be went wrong

        pass.setPipeline(this.pipeline);
        pass.draw(3);

        pass.end();

        const commandBuffer:GPUCommandBuffer = encoder.finish();
        this.device.queue.submit([commandBuffer]);
    }
    
}