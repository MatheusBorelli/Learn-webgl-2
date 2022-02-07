#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

uniform vec2 u_resolution;

uniform mat3 u_matrix;
//uniform vec2 u_translation;
//uniform vec2 u_rotation;
//uniform vec2 u_scale;

// all shaders have a main function
void main() { 
    /*
    //Scale the position
    vec2 scaledPosition = a_position * u_scale;

    //Rotate the position
    vec2 rotatedPosition = vec2(
        scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
        scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

    //Add in the translation
    vec2 position = rotatedPosition + u_translation;
    */
    vec2 position = (u_matrix * vec3(a_position, 1)).xy;
    
    //convert position to pixels (max height in pixel resolution = 1)
    vec2 resolutionGrid = position / u_resolution;

    //vec2 zeroToTwo = resolutionGrid * 2.0;
    //vec2 clipSpace = zeroToTwo - 1.0;
    //makes pixels (0,0) the bottom left position
    resolutionGrid *= 2.0;
    resolutionGrid -= 1.0;


    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = vec4( resolutionGrid , 0 , 1);
}