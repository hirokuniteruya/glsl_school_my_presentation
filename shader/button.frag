precision mediump float;

// uniform vec3 uGlobalColor;
uniform sampler2D uTex;
uniform float uDarkness;

varying vec2 vPosition;

void main()
{
    vec4 destColor = texture2D(uTex, vPosition);

    destColor -= uDarkness;

    gl_FragColor = destColor;
}
