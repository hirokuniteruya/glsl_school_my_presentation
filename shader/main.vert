attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 invMatrix;
uniform vec3 uLightDirection;

varying vec4 vColor;

void main()
{
    // 拡散光の導出
    vec3 invLight = normalize(invMatrix * vec4(uLightDirection, 0.0)).xyz;
    float diffuse = clamp(dot(normal, invLight), 0.1, 1.0);

    vColor = vec4(vec3(diffuse), 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
