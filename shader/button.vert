// attribute vec3 position;
// attribute vec3 normal;

// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat4 normalMatrix;

uniform float uTexScale;

varying vec2 vPosition;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vPosition = ( projectedPosition.xy / projectedPosition.w / uTexScale + 1. ) * .5;
}
