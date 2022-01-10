import{V as g,S as z,P as S,W,C as O,T as F,A as D,G as E,O as L,a as V,B as j,F as p,b as I,M as m,I as N,c as P,d as M,e as q,f as X,g as G,h as R,i as k,j as Y,D as x,k as H,L as T,R as Q,l as K,m as U,n as J,o as f,p as Z,q as y,r as _,s as b}from"./vendor.69b5b100.js";const $=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerpolicy&&(n.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?n.credentials="include":s.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}};$();const ee={x:0,y:0,z:4},A={fovy:60,near:.1,far:1e3};class te{constructor(e={}){var o,a,r,l;const t=(o=e.axesHelper)!=null?o:!1,i=(a=e.gridHelper)!=null?a:!1,s=(r=e.orbitControls)!=null?r:!1,n=(l=e.autoResize)!=null?l:!1;this.sizes={width:window.innerWidth,height:window.innerHeight,aspect:window.innerWidth/window.innerHeight},this.mouse=new g(0,0),this.scene=new z,this.camera=new S(A.fovy,this.sizes.aspect,A.near,A.far),this.camera.position.set(...Object.values(ee)),this.renderer=new W({antialias:!0,alpha:!0}),this.renderer.setSize(this.sizes.width,this.sizes.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0),document.body.appendChild(this.renderer.domElement),this.css3DRenderer=new O,this.css3DRenderer.domElement.style.position="absolute",this.css3DRenderer.domElement.style.top=0,this.css3DRenderer.domElement.style.pointerEvents="none",this.css3DRenderer.setSize(this.sizes.width,this.sizes.height),document.body.appendChild(this.css3DRenderer.domElement),this.textureLoader=new F,t===!0&&(this.axesHelper=new D(10),this.scene.add(this.axesHelper)),i===!0&&(this.gridHelper=new E(10,10),this.gridHelper.rotation.x=Math.PI/2,this.gridHelper.position.z=-.02,this.scene.add(this.gridHelper)),s===!0&&(this.controls=new L(this.camera,this.renderer.domElement),this.controls.enableDamping=!0),this.gui=new V,n===!0&&window.addEventListener("resize",this.onResize.bind(this))}onResize(){this.sizes.width=window.innerWidth,this.sizes.height=window.innerHeight,this.sizes.aspect=this.sizes.width/this.sizes.height,this.camera.aspect=this.sizes.aspect,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.sizes.width,this.sizes.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.css3DRenderer.setSize(this.sizes.width,this.sizes.height)}getScreenMousePosition(e){this.mouse.x=e.clientX,this.mouse.y=e.clientY}getNormalizedMousePosition(e){this.mouse.x=e.clientX/this.sizes.width*2-1,this.mouse.y=-(e.clientY/this.sizes.height)*2+1}}class se{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=w(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}resume(){this.startTime=w(),this.oldTime=this.startTime,this.running=!0}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=w();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function w(){return(typeof performance=="undefined"?Date:performance).now()}class ie extends j{constructor(e=2,t=1,i=6){super();this.type="ButtonGeometry",this.parameters={width:e,height:t,height:t,heightSegments:i,heightSegments:i};const s=e/2,n=t*.5,o=[],a=[],r=[],l=[];for(let u=0;u<=i;u++){const h=Math.PI/i*u,c=s-n+n*Math.sin(h),d=Math.cos(h)*n;a.push(c,d,0,-c,d,0),r.push(0,0,1,0,0,1),l.push((c/s+1)/2,(d/s+1)/2,(-c/s+1)/2,(d/s+1)/2)}for(let u=0;u<i;u++){const h=u*2,c=h,d=h+1,C=h+2,B=h+3;o.push(c,d,C),o.push(C,d,B)}this.setIndex(o),this.setAttribute("position",new p(a,3)),this.setAttribute("normal",new p(r,3)),this.setAttribute("uv",new p(l,2))}}var ne=`// Classic Perlin 3D Noise
// by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}
`,oe=`uniform float uTime;
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

    // \u6975\u5EA7\u6A19
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
`,ae=`precision mediump float;

uniform vec3  uDepthColor;
uniform vec3  uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main()
{
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    vec4 destColor = vec4(color, 1.0);

    gl_FragColor = destColor;
}
`,re=`precision mediump float;

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
`,le=`precision mediump float;

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

    // \u30DD\u30A4\u30F3\u30C8\u30E9\u30A4\u30C8\u98A8\uFF08\u7121\u3044\u65B9\u304C\u30B7\u30F3\u30D7\u30EB\u3067\u826F\u3044\uFF1F\uFF09
    // destColor += max(distortion * uMouseEffect, .1);

    gl_FragColor = destColor;
}
`,ue="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWwAAACkCAYAAACzUxTUAAAACXBIWXMAAAsSAAALEgHS3X78AAAO20lEQVR4nO3d63UbtxqF4e2z8l9OBWYqsFJBmAosVxCkgtgVZFxBnAoCVxC5gkNVELmC0B1QFej8GPF45gNI8QIOLvM+a2kloHWBKM4mBtcXj4+PAgCU7z+5KwAAOAyBDQCVILABoBIENgBUgsAGgEoQ2ABQCQIbACpBYANAJQhsAKgEgQ0AlSCwAaASBDYAVILABoBKENgAUAkCGwAqQWADQCUIbACoBIENAJUgsAGgEgQ2AFSCwAaASnx3wtd0qSsxoXtJm8j/l6x7pox6XUu6MY+tJfnJa3K62O9wL+k2Q11a8VLSO/PYWpJ/8fj4eOw3O/oLCnen/sm4l7R6+m9J7PP9IkstcAkrST9FHv9B/WuyFveSXpvHflR511ItbiW9MY+9lXRLYIce1F9It08fuVvhBHabFpL+3fFvH1TXndS1pH/MY18kLZX/+qnNO0l/mMc+SXKSRGA/75P6W9RVpp9PYLfpo6Tfdvzbg/rb4prEguZPhbf22G2h/q7kavDYV/VviBspTWD/fGLlprR4+pD6C+H66b/2Nm6fO/WtnlW6ah2EwG7TRuGF+WpQ/lV19WVL8S6en5WvsVOblZ55/lIEdu0Bcv30sXz6eLXvk9UHt9N0fYytPd/oXz9/Dcpf1DcG/h48dqf+9ViThZ5pIWKnTtLv5rGga4zADl2rv6ButDu8H9Tf6vkJ6tP68z1HdpBu25pea/yaq23wUeqvm7/NY58VziTBN7vGAK7tJzIPO3SvPowX6i+ku8jnXKlvIfnJaoVWXGsc1g/6NgXuo/ncbooKJXarPqCH3ojA3seb8oOeBhktAns/r/629K36WzvrFxHaOI4dhBvORPLm325U3+Cj1IeNvV68vo0j4ZuPCsfSOu2YEklgH+ZWfcvoz8i/Edo41EuFLc1u8P8b9bOStq4in1+DjcIW4pW4TqylwplCdwrvtP6PwD7cRn3r6Ff1tyxDhDYO4TQekNsu2hryplzrtLiVwgbOT6r390ntpeJdIXvfoBl0PM21+hfklXn8rdIvyeX5bsdah03ds59X89Q4O8D6oL5lOfdVkF59Q2/o2fyghX2ae/UvOtvS9qqzzxGXt9Q4hB+0+67M3hK79NWZjDNlukb6VrQN6086oLFHYJ9uO5tk6Ep7+p8wa86U/Z7Ptf/2i+ptCNxLem8ee606Z8CkEOsK+aoDu4roEjlfbIlxyvmzPN/1WyjcN+S514jXuBX2XnU3BlYKV/HNcYOolc5YDUoL+3ydwilM3fTVQMGcKccGGy0bzrUP1jmFXYi3qvfO4RTvFIb1Bx0xPkELOw2n8VJjSfpeaZbj8nzXb61x//Whg9N2wO4Sg9pTiq2CnMsGUQuFy/ajqxn3oYWdhlfYynbTVwMFslscfNXhodvS4KMUXwX5m+rbM+UUtxqH9c7VjPsQ2Om0dnEhDdt69Ed87a3G3QhvVP9qQaewcdN610inI1Yz7kNgp2NbTa/V9osQz1so7LP0R3z9RuHryp1enSLMbRXktcJd+PauZtyHwE5nrb5Pamg5fTVQENu6/qzjZw+1NvgoxVdBtrhB1EmrGfchsNOyraGjBhTQHGfKp7Sq7jVuCFxFvm+N3ils4HjV3+Uz1CnsCnE6YzICgZ3WypSXGeqAMjiFG/mvTvxerY6POI376FvqGlkqXJ9x0GrGfQjstOwgwiJHJVAE23VxzqIXO/j4k9p4bd0rXLPQwgZRZ61m3IfATmuj8YX13HFjaJM9pEA6r+W4iXx9d8b3K8lHhYeEdKq7O9ErvPadEqzLILDTo5UN25L6pPMvVttCr/Vwg5gbtdM1cqN+AHXoqNWM+xDYl7fIXQFMKnZIgU/wfdcat0RrPdwgJjbVr8YNomJdIdsDlpMgsNNb5a4AsnJKN9hoeVOuva936Fbj03akfv5yTV0jSVYz7kNgA2nZEO0Sfm+vcdfBa7U1E+md6l0FGdvYqVPi3QgJbCCdpcJDClJv1uRN2SX+/jnFukZeqfyukYXCOp68mnEfAhtIx5ny8ET0VGwI1Hy4QcxK/SDd0G8qu78+1hVykfoS2EAaC4XHPl3iwIG1wmlw7gI/J6dO8VWQJb4xdUq8mnEfAju9mgZJkI4z5S+63Gkq3pRbGnzccip/ql9sY6ezVzPuQ2CnZ1sBF3mnRXGcKV/yOC+v8eDcK5XdZXCK2CrINyrnbuJiqxn3IbDTs4E9tzPr5sgeUnCJwUbLm7K78M/LIbYK8qPKWNvQacKukC0COz37R0T7YocUXPrOyptyC4cbxJS4CnKpcGOnZKsZ9yGw07L917Z1gPYsFM6/neJ087XC47bcBD93arGpfjk3iHqp8O4p6WrGfQjstGxgr3NUApOywXHIieipeFNucfBRiq+C/EN5Bvi9LryacR8CO62lKdN/3T5nyn7Cn32r8eBjK4cbxMRWQfqJ6xDb2KnThNc5gZ2WHalf5agEJuMUtrb8xHWwP89N/POnknuDqIXC5/oiqxn3IbDTuVG46Q8t7LalPKTgVN6UWzncIGalcBXk75pmPxWviVYz7kNgp+NMeZWhDphO6kMKTrVWOPjYTV+NyXSafhVkbGMnpwxrLAjsNBYK+7b89NXAhFKciJ5Ky4cbxDiFJzt1F/pZ15HvfdHVjPsQ2Gl0ppxyD2SU51KHFJxqpXDwsbWVj0OxVZCX2iDKK+zqzDYbh8A+31Lhpj/d9NXAhJzCizhLi2vAtrJbneK3FVsF6ZX2zqJT2O11o4zbTRDY59m1n4B9DG2JrWzMzZtya4cbxFxyFWRsY6cPyjyRgMA+j1d4OnLrLZu5Wyr8m/vpqxHYKFxc4jLUY0qxqX4pNojKuppxHwL7dF7hQONn5b81xmU5U/6kcla0elNu7XCDmNgqyHM3iOoUbuZVxJgAgX0ar7DfetIlqshiofDv7qevxk4rhasB3fTVmJxdBXlO18hS4cZOnQp5Uyawj7O9VYqF9VLsfd06Z8olzgaa2+CjlG6DqFhXyGflWRAVRWAfbql+wMF2g0j9C4NVje1zplzMhTzgFc5RLuJ2/sJWCldBHrtBlFfGjZ0OQWA/b6H+Xfe/CgebHiS9VVm3xbgMe0iBVObffaOwlegy1COHTvFVkIeIbezkVNhdM4G921L9C/9fxVvVXwefg/bZ2+tPKuxiHrAt/1YPN4hxGt9hHLJB1EJhsP+pAq9tAntsqf7Fvlbfoo4FtdT3a12LbpC5WCjcS8JPX42D3StsaboM9cghtgryuQ2ivMKFUPZ7FOHF4+PjsV9jv+BForpMbal+kOH66f/tBRnzVf0Lf3WhOsW08nzX7KPGMwe+KM/m+cdwkv4alB/U/hS/oZXG1/RX9X8ze1f0Tn1f99CPKrQxliKwazoG66VOO3Nx+47rU1bmQAR2fhuNW2C/quwWttS/1teqr96pxH7/TxrfaVyrD/bh53xQoa1rKU1gt2p78rVX3qlbBHZeTmFLdaFy+6+HvMZTUO/U/nL1oRtJf5vH3upb3/S9xg244u+cCOyxL+rDeaVyBhwI7LzsRW1baSW7lvSPeewHFbIIZCJe4zet7RvuO433CnlQ/3ytJ6rXSeYa2NtunHv1f6D7p48SW00Edj6xwCu2f3OHmt9wUnip/jkYTsm8Uzhm9V5lzqsfSRHYPyeqy6VsVNcFZhHY+XjV36XgVG+XTipL9bO+dvmsShYXzXmWSC14vvNoadCuxkHT1DqF26VKlb2BMQ8biHPKfyJ6Kt6U57C/iNUpnJsuFbiacR8CG4gr8ZCCU9m+2TkcbhDTmfKdyplccBACGwgtFe4bUvyA1B5rhesl3PTVyK6alvQuBDYQcqZ8p8Knex3Am/IcDjdoDoENjC1U9iEFp/Iab4okzbOVXTUCGxhzptzSocrelOc4+Fg1AhsYc6bsM9ThUmw//FwON2jGd7krABQkdkjBjdqeUeFU2UyJOSOwgW9iXQSn7O5Yk+3hBuu81cAh6BIBegsdtid6i1zuCuAwBDbQm/MA3Jx/96oQ2EDPmfJ79fu2tPjxvfldryK/PwpEYAPhviFSW7NDrI36bVaHXIZ64EgENlDXieipeFP+SfM5Wb1aBDbm7lrhTJCa9w051Er9oqChbvpq4BgENubOtq6/qO4DL45h35huxP4iRSOwMWcvFa70m0PrestrvL/IlVj5WDQCG3PmFB5SMKdVfxuFvy9T/ApGYGPObDjdqv3BRovDDSpCYGOulgr3Demmr0Z29wqPznIZ6oEDENiYK2fKLRxScCrbyuZwg0IR2Jijhdo8pOBUt+JwgyoQ2JgjZ8o1n4iewkYcblAFAhtz5EzZZ6hDaTjcoAIENuYmdkjBnOZe77IWJ6sXj8DG3Nhb/TkPNlrelLeHG6AQBDbmZKHwkAJa1994MfhYNAIbc2Jb1181r5WNh7BvYAw+FoTAxpw4U/YZ6lA6b8ocblAQAhtz4TSvQwpOtZb02Tzmpq8GYghszIW9tf8sBht38abM4QaFILAxB3M9pOBUt+JwgyIR2JiD2GDjKkM9auJNmcMNCkBgo3VzP6TgVN6UOdygAAQ2WufEYOMp1gpPVmeKX2YENlo3xxPRU/GmzOEGmRHYaNlS4b4hfvpqVGulcPDRTV8NbBHYaJkz5S9isPFYHG5QEAIbrVooPKSAwcbj+chjbuI64AmBjVY5U57bieipbMTgYzEIbLTKmfIcT0RPhcMNCkFgo0UcUpAWJ6sX4rvcFcDRVrkrUJhl5LHYIQX3l69K0z5K+mtQ3h5usM5RmbkisOtjN+DH2ELhc+Snr0ZzbtWH9nARkhN7jEyKLhG0xrau534ieiobhYO2DD5OjMBGa5wp+wx1aFVnyhxuMLEXj4+PuesAADgALWwAqASBDQCVILABoBIENgBUgsAGgEoQ2ABQCQIbACpBYANAJQhsAKgEgQ0AlSCwAaASBDYAVILABoBKENgAUAkCGwAqQWADQCUIbACoBIENAJUgsAGgEgQ2AFSCwAaAShDYAFAJAhsAKkFgA0AlCGwAqASBDQCVILABoBIENgBUgsAGgEoQ2ABQCQIbACpBYANAJQhsAKgEgQ0AlfgfDeQKea4XBp8AAAAASUVORK5CYII=";class he extends te{constructor(e){super({orbitControls:!0});this.audioManager=e,console.log("this.audioManager: ",this.audioManager),this.gui.add(this.audioManager,"doSoundTest").name("\u30B5\u30A6\u30F3\u30C9\u30C6\u30B9\u30C8"),this.dampedMouse=new g,this.camera.position.set(2,2,2),I.perlin_3d=ne,this.isMousehovered=!1,this.isMainWorld=!1,this.tweens=[],this.btnTl=null,this.COLORS={globalColor:3335910,depthColor:5422068,surfaceColor:10213631,clearColor:12535109,outsideClearColor:3355443},this.sea=new m(new N(1,24),new P({vertexShader:oe,fragmentShader:ae,uniforms:{uTime:{value:0},uBigWavesElevation:{value:.025},uBigWavesFrequency:{value:new g(4,1.5)},uBigWavesSpeed:{value:.75},uSmallWavesElevation:{value:.15},uSmallWavesFrequency:{value:3},uSmallWavesSpeed:{value:.2},uDepthColor:{value:new M(this.COLORS.depthColor)},uSurfaceColor:{value:new M(this.COLORS.surfaceColor)},uColorOffset:{value:.21},uColorMultiplier:{value:6},uSynthAmplitude:{value:0}}})),this.sea.rotation.x=-Math.PI*.5,this.scene.add(this.sea);const t=this.sea.material.uniforms;this.gui_sea=this.gui.addFolder("sea").close(),this.gui_bigWaves=this.gui_sea.addFolder("uBigWaves"),this.gui_smallWaves=this.gui_sea.addFolder("uSmallWaves"),this.gui_bigWaves.add(t.uBigWavesElevation,"value").min(0).max(.1).step(.001).name("uBigWavesElevation"),this.gui_bigWaves.add(t.uBigWavesFrequency.value,"x").min(0).max(10).step(.001).name("uBigWavesFrequencyX"),this.gui_bigWaves.add(t.uBigWavesFrequency.value,"y").min(0).max(10).step(.001).name("uBigWavesFrequencyY"),this.gui_bigWaves.add(t.uBigWavesSpeed,"value").min(0).max(4).step(.001).name("uBigWavesSpeed"),this.gui_smallWaves.add(t.uSmallWavesElevation,"value").min(0).max(1).step(.001).name("uSmallWavesElevation"),this.gui_smallWaves.add(t.uSmallWavesFrequency,"value").min(0).max(5).step(.001).name("uSmallWavesFrequency"),this.gui_smallWaves.add(t.uSmallWavesSpeed,"value").min(0).max(4).step(.001).name("uSmallWavesSpeed"),this.gui_sea.addColor(t.uDepthColor,"value").name("uDepthColor"),this.gui_sea.addColor(t.uSurfaceColor,"value").name("uSurfaceColor"),this.gui_sea.add(t.uColorOffset,"value").min(-1).max(1).step(.001).name("uColorOffset"),this.gui_sea.add(t.uColorMultiplier,"value").min(0).max(10).step(.001).name("uColorMultiplier"),this.objectsAround=new q,this.scene.add(this.objectsAround);const i=new X({flatShading:!0}),s=new m(new G(.1,.2,8,1),i);this.cones=[],this.createSurroundingObjects(s,this.cones,0),this.objectsAround.add(...this.cones);const n=new m(new R(.05,.05,.2,8,1),i);this.cylinders=[],this.createSurroundingObjects(n,this.cylinders,.25*1/3),this.objectsAround.add(...this.cylinders);const o=new m(new k(.1,8,8),i);this.spheres=[],this.createSurroundingObjects(o,this.spheres,.25*2/3),this.objectsAround.add(...this.spheres),this.ambientLight=new Y("white",.1),this.directionalLight_upper=new x("lightBlue",1),this.directionalLight_lowerA=new x("yellow",1),this.directionalLight_lowerB=new x("blue",1),this.directionalLight_upper.position.set(0,-1,0),this.directionalLight_lowerA.position.set(0,1,.25),this.directionalLight_lowerB.position.set(0,1,-.25),this.scene.add(this.ambientLight,this.directionalLight_upper,this.directionalLight_lowerA),this.renderTarget=new H(this.sizes.width,this.sizes.height),this.outsideScene=new z,this.outsideCamera=new S(60,this.sizes.aspect,.1,1e3),this.outsideCamera.position.set(0,0,5),this.buttonMesh=new m(new ie(4,1.4,32),new P({vertexShader:re,fragmentShader:le,uniforms:{uTex:{value:this.renderTarget.texture},uTexScale:{value:.4},uDarkness:{value:.5},uTime:{value:0},uMouse:{value:this.mouse},uMouseEffect:{value:1},uAspect:{value:this.sizes.aspect}}})),this.outsideScene.add(this.buttonMesh),this.gui_button=this.gui.addFolder("PlayButton").close(),this.gui_button.add(this.buttonMesh.material.uniforms.uTexScale,"value").min(0).max(1).step(.001).name("uTexScale"),this.textTexture=this.textureLoader.load(ue),this.textTexture.minFilter=T,this.textTexture.magFilter=T,this.textTexture.format=Q,this.textMesh=new m(new K(2,1),new U({map:this.textTexture,transparent:!0})),this.textMesh.scale.setScalar(.8),this.outsideScene.add(this.textMesh),this.raycaster=new J,this.intersects=null,this.mouse.set(-1,1),window.addEventListener("mousemove",this.getNormalizedMousePosition.bind(this)),window.addEventListener("resize",this.onResize.bind(this)),window.addEventListener("mouseup",this.onMouseup.bind(this)),this.renderer.setClearColor(this.COLORS.clearColor),this.gui.addColor(this.COLORS,"clearColor"),this.gui.addColor(this.COLORS,"outsideClearColor"),this.clock=new se(!1),this.isFirstFrame=!0,this.animate()}animate(){this.controls.update(),this.isFirstFrame?this.isFirstFrame=!1:this.isMainWorld||(this.raycaster.setFromCamera(this.mouse,this.outsideCamera),this.intersects=this.raycaster.intersectObjects(this.outsideScene.children),this.intersects.length>0?this.isMousehovered===!1&&(this.onMouseenter(),this.isMousehovered=!0):this.isMousehovered===!0&&(this.onMouseleave(),this.isMousehovered=!1));const e=this.clock.getElapsedTime();let t=this.audioManager.getAmplitudes();for(const i of this.cylinders)i.scale.setScalar(1+t[0]);for(const i of this.spheres)i.scale.setScalar(1+t[1]);for(const i of this.cones)i.scale.setScalar(1+t[2]);this.objectsAround.rotation.y=e*.1,this.sea.material.uniforms.uSynthAmplitude.value=t[0],this.sea.material.uniforms.uTime.value=e,this.buttonMesh.material.uniforms.uTime.value=e,this.renderer.setRenderTarget(this.renderTarget),this.renderer.setClearColor(this.COLORS.clearColor),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.renderer.setClearColor(this.COLORS.outsideClearColor),this.renderer.render(this.outsideScene,this.outsideCamera),requestAnimationFrame(this.animate.bind(this))}onMouseenter(){this.tweens.forEach(e=>e.resume()),this.clock.resume(),this.btnTl&&this.btnTl.kill(),this.btnTl=f.timeline({defaults:{duration:1,ease:"power3.out"}}).to(this.buttonMesh.material.uniforms.uTexScale,{value:.6}).to(this.buttonMesh.material.uniforms.uDarkness,{value:.1,duration:.5},"<").to(this.buttonMesh.scale,{x:1.2,y:1.2},"<").to(this.textMesh.scale,{x:1,y:1},"<").to(this.buttonMesh.material.uniforms.uMouseEffect,{value:.3,duration:.5},"<"),document.body.style.cursor="pointer"}onMouseleave(){this.tweens.forEach(e=>e.pause()),this.clock.stop(),this.btnTl&&this.btnTl.kill(),this.btnTl=f.timeline({defaults:{duration:.5,ease:"power3.out"}}).to(this.buttonMesh.material.uniforms.uTexScale,{value:.4}).to(this.buttonMesh.material.uniforms.uDarkness,{value:.5},"<").to(this.buttonMesh.scale,{x:1,y:1},"<").to(this.textMesh.scale,{x:.8,y:.8},"<").to(this.buttonMesh.material.uniforms.uMouseEffect,{value:1},"<"),document.body.style.cursor="auto"}onMouseup(){this.intersects.length>0&&!this.isMainWorld&&this.enterToMainWorld()}enterToMainWorld(){this.btnTl=f.timeline({defaults:{duration:1.5,ease:"power3.out"}}).to(this.buttonMesh.material.uniforms.uTexScale,{value:1}).to(this.buttonMesh.material.uniforms.uDarkness,{value:0,duration:.5},"<").to(this.buttonMesh.scale,{x:5,y:5},"<").to(this.textMesh.position,{z:10},"<").to(this.textMesh.material,{opacity:0,duration:.2},"<").to(this.camera.position,{x:1.8,y:1,z:1.8},"<").to(this.buttonMesh.material.uniforms.uMouseEffect,{value:0},"<"),document.body.style.cursor="auto",this.isMainWorld=!0,setTimeout(()=>{this.audioManager.startAll()},500)}onResize(){super.onResize()}createSurroundingObjects(e,t,i,s){for(let n=0;n<4;n++){const o=e.clone(),a=1.5,r=Math.PI*2*(i+n/4);o.position.x=Math.cos(r)*a,o.position.z=Math.sin(r)*a,o.position.y=(Math.random()-.5)*.8,o.rotation.x=Math.PI*.125,o.rotation.y=Math.random()*Math.PI*2,o.rotation.order="YXZ",t.push(o);const l=f.to(o.position,{y:"+=.1",duration:3,delay:s,repeat:-1,yoyo:!0,ease:"sine.inOut",paused:!0});this.tweens.push(l)}}}var de="/assets/MassiveX.4a08aa25.mp3",ce="/assets/Drums_solo.64613890.mp3",me="/assets/Trilian_solo.768e49fc.mp3";class ve{constructor(){this.isReady=!1,this.isPlaying=!1,this.testSynth=new Z({oscillator:{type:"square"},envelope:{attack:.1}}).toDestination(),this.massive=new y({url:de,loop:!0}).toDestination(),this.drums=new y({url:ce,loop:!0,volume:-4}).toDestination(),this.trilian=new y({url:me,loop:!0}).toDestination(),_().then(()=>{this.isReady=!0}),this.fftSize=512,this.buffer=new Uint8Array(this.fftSize),this.analysers=[new b("waveform",this.fftSize),new b("waveform",this.fftSize),new b("waveform",this.fftSize)],this.massive.connect(this.analysers[0]),this.drums.connect(this.analysers[1]),this.trilian.connect(this.analysers[2]),window.addEventListener("keydown",e=>{e.key==="Escape"&&(this.isPlaying?this.stopAll():this.startAll())})}startAll(){this.massive.start(),this.drums.start(),this.trilian.start(),this.isPlaying=!0}stopAll(){this.massive.stop(),this.drums.stop(),this.trilian.stop(),this.isPlaying=!1}getAmplitudes(){let e=[];return this.analysers.forEach(t=>{let i=null;t._analysers[0].getByteTimeDomainData(this.buffer),i=this.buffer.reduce((s,n)=>Math.max(s,n)),i-=128,i/=127,i**=2,e.push(i)}),e}doSoundTest(){this.testSynth.triggerAttackRelease("C4","4n")}}const fe=new ve;new he(fe);
