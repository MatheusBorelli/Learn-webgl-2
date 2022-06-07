#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

uniform mat3 u_matrix;

// all shaders have a main function
void main() {
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = vec4(( u_matrix * vec3(a_position, 1)).xy , 0 , 1);
}