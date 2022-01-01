uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2  uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;

varying float vElevation;

#include <perlin_3d>

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Elevation
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                      sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                      uBigWavesElevation;

    // Perlin noise
    for (float i = 1.0; i <= 4.0; i++) {
        elevation -= abs(
            cnoise(
                vec3(modelPosition.xz * uSmallWavesFrequency * i,
                uTime * uSmallWavesSpeed)
            ) * uSmallWavesElevation / i
        );
    }

    modelPosition.y += elevation;

    vec4 viewPosition      = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings
    vElevation = elevation;
}
