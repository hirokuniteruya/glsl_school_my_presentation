precision mediump float;

uniform sampler2D uTex;
uniform float uTexScale;
uniform float uDarkness;
uniform float uTime;
uniform vec2  uMouse;
uniform float uMouseEffect;
uniform float uAspect;

varying vec2 vPosition;

void main()
{
    vec2 uvMouse = (uMouse / uTexScale + 1.) * .5;
    float distortion = 1. - length(vec2(
        (vPosition.x - uvMouse.x) * uAspect,
        vPosition.y - uvMouse.y
    ));

    vec4 destColor = texture2D(uTex, vPosition);

    destColor -= uDarkness;

    // ポイントライト風（無い方がシンプルで良い？）
    // destColor += max(distortion * uMouseEffect, .1);

    gl_FragColor = destColor;
}
