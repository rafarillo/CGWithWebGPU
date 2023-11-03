export class TriangleMesh implements Mesh
{
    sca:number[];
    col:number[];
    offset:number[];
    unifromBufferSize!:number;
    uniformValues:Float32Array;

    constructor(scale:number[], color:number[], offset:number[])
    {
        this.sca = scale;
        this.col = color;
        this.offset = offset;
        this.unifromBufferSize = 4 * 4 + 4 * 2 + 4 * 2;
        this.uniformValues = new Float32Array(this.unifromBufferSize/4);

        const kColorOffset:number = 0;
        const kScaleOffSet:number = 4;
        const kOffsetOffset:number = 6;

        this.uniformValues.set(this.col, kColorOffset);
        this.uniformValues.set(this.sca, kScaleOffSet);
        this.uniformValues.set(this.offset, kOffsetOffset);
    }
    get UniformValues(): Float32Array {
        return this.uniformValues;
    }

    public get Scale() : number[] {
        return this.sca
    }
    
    public get Color() : number[] {
        return this.col
    }
    
    public get Offset() : number[] {
        return this.offset
    }
    
    public get BufferSize() : number {
        return this.unifromBufferSize;
    }
}