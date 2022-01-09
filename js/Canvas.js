import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { BaseCanvas } from './libs/BaseCanvas'
import { MyClock } from './libs/MyClock'
import { ButtonGeometry } from './MyGeometry/ButtonGeometry'
import { Pane } from 'tweakpane'
import { gsap } from 'gsap'
import perlin_3d from '../shader/chunk/perlin_3d.glsl?raw'
import sea_vs    from '../shader/sea.vert?raw'
import sea_fs    from '../shader/sea.frag?raw'
import button_vs from '../shader/button.vert?raw'
import button_fs from '../shader/button.frag?raw'
import playText  from '../image/play-text.png'

export class Canvas extends BaseCanvas {
    constructor(audioManager)
    {
        super({
            // axesHelper: true,
            // gridHelper: true,
            orbitControls: true,
            // autoResize: true,
        })

        this.audioManager = audioManager
        console.log('this.audioManager: ', this.audioManager);
        this.gui.add( this.audioManager, 'doSoundTest' ).name('サウンドテスト')

        this.dampedMouse = new THREE.Vector2()

        this.camera.position.set(2, 2, 2)

        /**
         * Tweakpane
         */
        // const pane = new Pane({ container: document.getElementById('float-layer') })
        // this.PARAMS = {
        //     volume: 0,
        // }
        // pane.addMonitor(this.PARAMS, 'volume', {
        //     interval: 16,
        //     view: 'graph',
        //     min: 0,
        //     max: 0.5,
        // })

        /**
         * Shader chunks
         */
        THREE.ShaderChunk['perlin_3d'] = perlin_3d

        /**
         * Global variables
         */
        this.isMousehovered = false
        this.isMainWorld = false
        /** @type {Array.<GSAPTween>} */
        this.tweens = []
        this.btnTl = null

        /**
         * Colors
         */
        this.COLORS = {
            globalColor:  0x32e6e6,
            depthColor:   0x52bbf4,
            surfaceColor: 0x9bd8ff,
            // clearColor:   0x9ddaff,
            clearColor:   0xbf4545,
            outsideClearColor: 0x333333,
        }

        /**
         * Sea
         */
        this.sea = new THREE.Mesh(
            // new THREE.PlaneGeometry(2, 2, 512, 512),
            new THREE.IcosahedronGeometry(1, 24),
            new THREE.ShaderMaterial({
                vertexShader: sea_vs,
                fragmentShader: sea_fs,
                uniforms: {
                    uTime: { value: 0 },

                    uBigWavesElevation: { value: 0.025 },
                    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                    uBigWavesSpeed: { value: 0.75 },

                    uSmallWavesElevation: { value: 0.15 },
                    uSmallWavesFrequency: { value: 3 },
                    uSmallWavesSpeed: { value: 0.2 },

                    uDepthColor: { value: new THREE.Color(this.COLORS.depthColor) },
                    uSurfaceColor: { value: new THREE.Color(this.COLORS.surfaceColor) },
                    uColorOffset: { value: 0.21 },
                    uColorMultiplier: { value: 6 },

                    uSynthAmplitude: { value: 0 },
                },
            })
        )
        this.sea.rotation.x = - Math.PI * 0.5
        this.scene.add(this.sea)

        const seaUniforms = this.sea.material.uniforms
        this.gui_sea        = this.gui.addFolder('sea').close()
        this.gui_bigWaves   = this.gui_sea.addFolder('uBigWaves')
        this.gui_smallWaves = this.gui_sea.addFolder('uSmallWaves')

        this.gui_bigWaves.add(seaUniforms.uBigWavesElevation, 'value').min(0).max(.1).step(0.001).name('uBigWavesElevation')
        this.gui_bigWaves.add(seaUniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
        this.gui_bigWaves.add(seaUniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
        this.gui_bigWaves.add(seaUniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

        this.gui_smallWaves.add(seaUniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
        this.gui_smallWaves.add(seaUniforms.uSmallWavesFrequency, 'value').min(0).max(5).step(0.001).name('uSmallWavesFrequency')
        this.gui_smallWaves.add(seaUniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')

        this.gui_sea.addColor(seaUniforms.uDepthColor, 'value').name('uDepthColor')
        this.gui_sea.addColor(seaUniforms.uSurfaceColor, 'value').name('uSurfaceColor')
        this.gui_sea.add(seaUniforms.uColorOffset, 'value').min(-1).max(1).step(0.001).name('uColorOffset')
        this.gui_sea.add(seaUniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

        /**
         * Objects around
         */
        this.objectsAround = new THREE.Group()
        this.scene.add(this.objectsAround)

        // Material
        const standardMaterial = new THREE.MeshStandardMaterial({ flatShading: true })
        // const standardMaterial = new THREE.MeshLambertMaterial()

        // Cones
        const coneMesh = new THREE.Mesh(
            new THREE.ConeGeometry(0.1, 0.2, 8,1),
            standardMaterial
        )
        this.cones = []
        this.createSurroundingObjects(coneMesh, this.cones, 0)
        this.objectsAround.add(...this.cones)

        // Cylinders
        const cylinderMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8, 1),
            standardMaterial
        )
        this.cylinders = []
        this.createSurroundingObjects(cylinderMesh, this.cylinders, 0.25 * 1 / 3)
        this.objectsAround.add(...this.cylinders)

        // Spheres
        const sphereMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            standardMaterial
        )
        this.spheres = []
        this.createSurroundingObjects(sphereMesh, this.spheres, 0.25 * 2 / 3)
        this.objectsAround.add(...this.spheres)

        /**
         * Lights
         */
        this.ambientLight = new THREE.AmbientLight('white', 0.1)
        this.directionalLight_upper  = new THREE.DirectionalLight('lightBlue', 1)
        this.directionalLight_lowerA = new THREE.DirectionalLight('yellow', 1)
        this.directionalLight_lowerB = new THREE.DirectionalLight('blue', 1)
        this.directionalLight_upper.position.set(0, -1, 0)
        this.directionalLight_lowerA.position.set(0, 1, 0.25)
        this.directionalLight_lowerB.position.set(0, 1, -0.25)
        this.scene.add(
            this.ambientLight,
            this.directionalLight_upper,
            this.directionalLight_lowerA,
            // this.directionalLight_lowerB,
        )

        /**
         * Outside world
         */
        this.renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height)
        // this.renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.width)
        this.outsideScene = new THREE.Scene()
        this.outsideCamera = new THREE.PerspectiveCamera(60, this.sizes.aspect, 0.1, 1000)
        this.outsideCamera.position.set(0, 0, 5)

        /**
         * Button
         */
        /** memo
         * MeshBasicMaterial を使用した時、テクスチャのアス比の補正が必要。
         */
        this.buttonMesh = new THREE.Mesh(
            new ButtonGeometry(4, 1.4, 32),
            new THREE.ShaderMaterial({
                vertexShader: button_vs,
                fragmentShader: button_fs,
                uniforms: {
                    uTex: { value: this.renderTarget.texture },
                    uTexScale: { value: .4 },
                    uDarkness: { value: .5 },
                }
            })
        )
        this.outsideScene.add(this.buttonMesh)

        this.gui_button = this.gui.addFolder('PlayButton').close()
        this.gui_button.add(this.buttonMesh.material.uniforms.uTexScale, 'value').min(0).max(1).step(0.001).name('uTexScale')

        /**
         * Text: play
         */
        const textEl = document.createElement('p')
        textEl.innerText = 'PLAY'
        textEl.style.fontSize = '10px'
        textEl.style.color = 'white'
        textEl.style.fontFamily = 'Poppins'
        textEl.style.pointerEvents = 'none' // 何故か効かない
        this.textObject = new CSS3DObject(textEl)
        this.textObject.scale.multiplyScalar(0.08)
        // this.outsideScene.add(this.textObject)

        this.textTexture = this.textureLoader.load(playText)
        this.textTexture.minFilter = THREE.LinearFilter
        this.textTexture.magFilter = THREE.LinearFilter
        this.textTexture.format = THREE.RGBAFormat

        this.textMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 1),
            new THREE.MeshBasicMaterial({
                map: this.textTexture,
                transparent: true,
            })
        )
        this.textMesh.scale.setScalar(.8)
        this.outsideScene.add(this.textMesh)

        /**
         * Raycaster
         */
        this.raycaster = new THREE.Raycaster()
        this.intersects = null
        this.mouse.set(-1, 1)

        /**
         * Event listeners
         */
        window.addEventListener('mousemove', this.getNormalizedMousePosition.bind(this))
        window.addEventListener('resize', this.onResize.bind(this))
        window.addEventListener('mouseup', this.onMouseup.bind(this))

        /**
         * Renderer settings
         */
        // this.renderer.autoClearColor = false
        this.renderer.setClearColor(this.COLORS.clearColor)
        this.gui.addColor(this.COLORS, 'clearColor').onChange(() => {
            this.renderer.setClearColor(this.COLORS.clearColor)
        })
        this.gui.addColor(this.COLORS, 'outsideClearColor')

        this.clock = new MyClock(false)
        this.isFirstFrame = true
        this.animate()
    }

    /**
     * Animate
     */
    animate()
    {
        this.controls.update()

        if (this.isFirstFrame) {
            // 何故か最初のフレームで this.intersects.length > 0 となる事象への対応
            this.isFirstFrame = false
        } else if(!this.isMainWorld) {
            // レイキャスター
            this.raycaster.setFromCamera(this.mouse, this.outsideCamera)
            this.intersects = this.raycaster.intersectObjects(this.outsideScene.children)

            if(this.intersects.length > 0) {
                if(this.isMousehovered === false) {
                    this.onMouseenter()
                    this.isMousehovered = true
                }
            } else {
                if(this.isMousehovered === true) {
                    this.onMouseleave()
                    this.isMousehovered = false
                }
            }
        }

        const elapsedTime = this.clock.getElapsedTime()

        // 音量の取得
        let amplitudes = this.audioManager.getAmplitudes()
        // this.PARAMS.volume = amplitudes[0] // monitor on tweakpane

        // 周囲を取り囲むオブジェクトへ音量を作用させる
        for (const obj of this.cylinders) {
            obj.scale.setScalar(1 + amplitudes[0])
        }
        for (const obj of this.spheres) {
            obj.scale.setScalar(1 + amplitudes[1])
        }
        for (const obj of this.cones) {
            obj.scale.setScalar(1 + amplitudes[2])
        }

        this.sea.material.uniforms.uSynthAmplitude.value = amplitudes[0]
        this.sea.material.uniforms.uTime.value = elapsedTime

        this.objectsAround.rotation.y = elapsedTime * 0.1

        // メインシーンの描画
        this.renderer.setRenderTarget(this.renderTarget)
        this.renderer.setClearColor(this.COLORS.clearColor)
        this.renderer.render(this.scene, this.camera)

        // 外界の描画（ボタン）
        this.renderer.setRenderTarget(null)
        this.renderer.setClearColor(this.COLORS.outsideClearColor)
        this.renderer.render(this.outsideScene, this.outsideCamera)
        // this.css3DRenderer.render(this.outsideScene, this.outsideCamera)

        requestAnimationFrame(this.animate.bind(this))
    }

    onMouseenter()
    {
        this.tweens.forEach(tween => tween.resume())
        this.clock.resume()
        this.btnTl && this.btnTl.kill()
        this.btnTl = gsap.timeline({defaults: { duration: 1, ease: 'power3.out' }})
            .to(this.buttonMesh.material.uniforms.uTexScale, { value: .6 })
            .to(this.buttonMesh.material.uniforms.uDarkness, { value: .1, duration: .5 }, '<')
            .to(this.buttonMesh.scale, { x: 1.2, y: 1.2 }, '<')
            .to(this.textMesh.scale, { x: 1, y: 1 }, '<')
        document.body.style.cursor = "pointer"
    }

    onMouseleave()
    {
        this.tweens.forEach(tween => tween.pause())
        this.clock.stop()
        this.btnTl && this.btnTl.kill()
        this.btnTl = gsap.timeline({defaults: { duration: .5, ease: 'power3.out' }})
            .to(this.buttonMesh.material.uniforms.uTexScale, { value: .4 })
            .to(this.buttonMesh.material.uniforms.uDarkness, { value: .5 }, '<')
            .to(this.buttonMesh.scale, { x: 1, y: 1 }, '<')
            .to(this.textMesh.scale, { x: .8, y: .8 }, '<')
        document.body.style.cursor = "auto"
    }

    onMouseup()
    {
        if(this.intersects.length > 0 && !this.isMainWorld) this.enterToMainWorld()
    }

    enterToMainWorld()
    {
        this.btnTl = gsap.timeline({defaults: { duration: 1.5, ease: 'power3.out' }})
            .to(this.buttonMesh.material.uniforms.uTexScale, { value: 1 })
            .to(this.buttonMesh.material.uniforms.uDarkness, { value: 0, duration: .5 }, '<')
            .to(this.buttonMesh.scale, { x: 5, y: 5 }, '<')
            .to(this.textMesh.position, { z: 10 }, '<')
            .to(this.textMesh.material, { opacity: 0, duration: .2 }, '<')
            .to(this.camera.position, { x: 1.8, y: 1, z: 1.8 }, '<')

        document.body.style.cursor = "auto"

        this.isMainWorld = true

        // 音声再生する処理をここに入れる。
        setTimeout(() => {
            this.audioManager.startAll()
        }, 500);
    }

    // mouseUpdate()
    // {
    //     const smoothness = .1

    //     this.dampedMouse.x += ( this.mouse.x * this.sizes.aspect * 2 - this.dampedMouse.x ) * smoothness
    //     this.dampedMouse.y += ( this.mouse.y * 2 - this.dampedMouse.y ) * smoothness
    // }

    onResize()
    {
        super.onResize()
    }

    /**
     * 引数で渡された Mesh を複製して、球体の周囲を取り囲む Mesh 群を作成します。
     * @param {THREE.Mesh} originalMesh 原型となるMeshオブジェクト
     * @param {Array} meshesArray Meshを格納する為の空の配列
     * @param {number} radianOffset 角度のオフセット
     * @param {number} animationDelay 浮遊アニメーションの遅延[s]
     */
    createSurroundingObjects(originalMesh, meshesArray, radianOffset, animationDelay)
    {
        for (let i = 0; i < 4; i++) {
            const mesh = originalMesh.clone()

            const radius = 1.5
            const radian = Math.PI * 2 * (radianOffset + i / 4)

            mesh.position.x = Math.cos(radian) * radius
            mesh.position.z = Math.sin(radian) * radius
            mesh.position.y = (Math.random() - 0.5) * .8

            mesh.rotation.x = Math.PI * 0.125
            mesh.rotation.y = Math.random() * Math.PI * 2
            mesh.rotation.order = 'YXZ'

            meshesArray.push(mesh)

            const tween = gsap.to(mesh.position, {
                y: "+=.1",
                duration: 3,
                delay: animationDelay,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                paused: true,
            })

            this.tweens.push(tween)
        }
    }
}
