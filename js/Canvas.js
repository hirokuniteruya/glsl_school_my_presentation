import * as THREE from 'three'
import { BaseCanvas } from './libs/BaseCanvas'
import { ButtonGeometry } from './MyGeometry/ButtonGeometry'
import { Pane } from 'tweakpane'
import { gsap } from 'gsap'
import perlin_3d from '../shader/chunk/perlin_3d.glsl?raw'
import main_vs   from '../shader/main.vert?raw'
import main_fs   from '../shader/main.frag?raw'
import sea_vs    from '../shader/sea.vert?raw'
import sea_fs    from '../shader/sea.frag?raw'

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

        this.volumeMonitor = document.getElementById('volume')

        this.dampedMouse = new THREE.Vector2()

        this.camera.position.set(1.6, 1.6, 1.6)

        /**
         * Tweakpane
         */
        const pane = new Pane({ container: document.getElementById('float-layer') })
        this.PARAMS = {
            volume: 0,
        }
        pane.addMonitor(this.PARAMS, 'volume', {
            interval: 16,
            view: 'graph',
            min: 0,
            max: 0.5,
        })

        /**
         * Shader chunks
         */
        THREE.ShaderChunk['perlin_3d'] = perlin_3d

        /**
         * Colors
         */
        const COLORS = {
            // clearColor:   0x9ddaff,
            clearColor:   0xbf4545,
            globalColor:  0x32e6e6,
            depthColor:   0x52bbf4,
            surfaceColor: 0x9bd8ff,
        }

        /**
         * MySphere
         */
        // this.mySphere = new THREE.Mesh(
        //     new THREE.SphereGeometry(1, 32, 32),
        //     new THREE.RawShaderMaterial({
        //         vertexShader: main_vs,
        //         fragmentShader: main_fs,
        //         uniforms: {
        //             uLightDirection: { value: new THREE.Vector3(1, 0, 1) },
        //             uTime: { value: 0 },
        //             uGlobalColor: { value: new THREE.Color(COLORS.globalColor) },
        //             invMatrix: { value: new THREE.Matrix4() }
        //         }
        //     })
        // )
        // this.scene.add(this.mySphere)

        // this.gui_sphere = this.gui.addFolder('sphere').open(false)
        // this.gui_sphere.addColor(this.mySphere.material.uniforms.uGlobalColor, 'value').name('globalColor')
        // this.gui_sphere.add(this.mySphere.material.uniforms.uLightDirection.value, 'x').min(-1).max(1).step(0.01)

        /**
         * Button
         */
        const buttonGeometry = new ButtonGeometry(4, 2, 32)
        const buttonMaterial = new THREE.MeshBasicMaterial({
            color: 'lightgreen',
        })
        const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial)
        this.scene.add(buttonMesh)

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

                    uDepthColor: { value: new THREE.Color(COLORS.depthColor) },
                    uSurfaceColor: { value: new THREE.Color(COLORS.surfaceColor) },
                    uColorOffset: { value: 0.21 },
                    uColorMultiplier: { value: 6 },

                    uSynthAmplitude: { value: 0 },
                },
            })
        )
        this.sea.rotation.x = - Math.PI * 0.5
        this.scene.add(this.sea)

        const seaUniforms = this.sea.material.uniforms
        this.gui_sea = this.gui.addFolder('sea')
        this.gui_bigWaves = this.gui_sea.addFolder('uBigWaves')
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
         * Event listeners
         */
        window.addEventListener('mousemove', this.getNormalizedMousePosition.bind(this))
        window.addEventListener('resize', this.onResize.bind(this))

        /**
         * Renderer settings
         */
        // this.renderer.autoClearColor = false
        this.renderer.setClearColor(COLORS.clearColor)
        this.gui.addColor(COLORS, 'clearColor').onChange(() => {
            this.renderer.setClearColor(COLORS.clearColor)
        })

        this.clock = new THREE.Clock()
        this.animate()
    }

    /**
     * Animate
     */
    animate()
    {
        this.controls.update()

        const elapsedTime = this.clock.getElapsedTime()

        // this.mouseUpdate()

        let amplitudes = this.audioManager.getAmplitudes()

        this.PARAMS.volume = amplitudes[0]
        this.sea.material.uniforms.uSynthAmplitude.value = amplitudes[0]

        for (const obj of this.cylinders) {
            obj.scale.setScalar(1 + amplitudes[0])
        }
        for (const obj of this.spheres) {
            obj.scale.setScalar(1 + amplitudes[1])
        }
        for (const obj of this.cones) {
            obj.scale.setScalar(1 + amplitudes[2])
        }

        // this.mySphere.rotation.y += 0.01
        // const invMat = this.mySphere.matrixWorld.clone().invert()
        // this.mySphere.material.uniforms.invMatrix.value = invMat

        this.sea.material.uniforms.uTime.value = elapsedTime

        this.objectsAround.rotation.y += 0.001

        this.renderer.render(this.scene, this.camera)

        requestAnimationFrame(this.animate.bind(this))
    }

    mouseUpdate()
    {
        const smoothness = .1

        this.dampedMouse.x += ( this.mouse.x * this.sizes.aspect * 2 - this.dampedMouse.x ) * smoothness
        this.dampedMouse.y += ( this.mouse.y * 2 - this.dampedMouse.y ) * smoothness
    }

    onResize()
    {
        super.onResize()
    }

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

            gsap.to(mesh.position, {
                y: "+=.1",
                duration: 3,
                delay: animationDelay,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            })
        }
    }
}
