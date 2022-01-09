precision mediump float;

// uniform vec3 uGlobalColor;
uniform sampler2D uTex;

varying vec2 vPosition;

void main()
{
    // vec4 destColor = vec4(uGlobalColor, 1.0) * vColor;
    // vec4 destColor = vec4(vec3(vPosition.x), 1.);
    vec4 destColor = texture2D(uTex, vPosition);

    gl_FragColor = destColor;
}
