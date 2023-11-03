struct Triangle{
    color: vec4f,
    scale: vec2f,
    offset: vec2f,
}

@group(0) @binding(0) var<uniform> triangle: Triangle;

@vertex fn vs( @builtin(vertex_index) vertexIndex : u32) -> @builtin(position) vec4f
{
    let pos = array(
        vec2f(0.0, 0.5),
        vec2f(-0.5, -0.5),
        vec2f(0.5, -0.5),
    );

    return vec4f(pos[vertexIndex] * triangle.scale + triangle.offset, 0.0, 1.0);
   
}

@fragment fn fs() -> @location(0) vec4f{
    return triangle.color;
}