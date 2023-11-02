struct VertexWithColor{
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
}

@vertex fn vs( @builtin(vertex_index) vertexIndex : u32) -> VertexWithColor
{
    let pos = array(
        vec2f(0.0, 0.5),
        vec2f(-0.5, -0.5),
        vec2f(0.5, -0.5),
    );

    var vcOutput:VertexWithColor;
    vcOutput.position = vec4f(pos[vertexIndex], 0.0, 1.0);
    return vcOutput;
}

@fragment fn fs(input:VertexWithColor) -> @location(0) vec4f{
    let red = vec4f(1, 0, 0, 1);
    let green = vec4f(0, 1, 0, 1);

    let grid = vec2u(input.position.xy)/8;

    return select (red, green, (grid.x + grid.y)%2 == 1);

}