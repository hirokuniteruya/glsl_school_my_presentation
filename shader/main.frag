precision mediump float;

uniform vec3 uGlobalColor;

varying vec4 vColor;

void main()
{
    vec4 destColor = vec4(uGlobalColor, 1.0) * vColor;

    gl_FragColor = destColor;
}
