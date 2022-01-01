uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2  uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;

uniform float uSynthAmplitude;

varying float vElevation;

#include <perlin_3d>

#define PI 3.141592653589793

float atan2(float y, float x)
{
    return x == 0.0 ? sign(y) * PI / 2. : atan(y, x);
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // 極座標
    float phi   = atan2(modelPosition.y, modelPosition.x);
    float theta = atan2(modelPosition.z, modelPosition.x);

    theta += PI * uTime * .2;

    float distanceToAxisY = length(modelPosition.xz);
    float distanceToAxisZ = length(modelPosition.xy);

    // Elevation
    float elevation = sin(phi   * uBigWavesFrequency.x * distanceToAxisY + uTime * uBigWavesSpeed) *
                      sin(theta * uBigWavesFrequency.y * distanceToAxisZ + uTime * uBigWavesSpeed) *
                      uBigWavesElevation;
    // elevation = sin(phi   * uBigWavesFrequency.x / distanceToAxisY + uTime * uBigWavesSpeed) *
    //             sin(theta * uBigWavesFrequency.y / distanceToAxisZ + uTime * uBigWavesSpeed) *
    //             uBigWavesElevation;

    float smallWaves = 0.0;

    // Perlin noise
    for (float i = 1.0; i <= 3.0; i++) {
        smallWaves -= abs(
            cnoise(
                vec3(
                    phi   * uSmallWavesFrequency * i,
                    theta * uSmallWavesFrequency * i,
                    uTime * uSmallWavesSpeed
                )
            ) * uSmallWavesElevation / i
        );
    }

    elevation += smallWaves * (0.2 + uSynthAmplitude * 8.0) + uSynthAmplitude * .6;

    modelPosition.xyz *= (1.0 + elevation);

    vec4 viewPosition      = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings
    vElevation = elevation;
}
