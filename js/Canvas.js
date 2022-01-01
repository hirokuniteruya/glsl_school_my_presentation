import * as THREE from 'three'
import { BaseCanvas } from './libs/BaseCanvas'
import perlin_3d from '../shader/chunk/perlin_3d.glsl?raw'
import main_vs   from '../shader/main.vert?raw'
import main_fs   from '../shader/main.frag?raw'
import sea_vs    from '../shader/sea.vert?raw'
import sea_fs    from '../shader/sea.frag?raw'

export class Canvas extends BaseCanvas {
    constructor()
    {
        super({
            // axesHelper: true,
            // gridHelper: true,
            orbitControls: true,
            // autoResize: true,
        })

        this.dampedMouse = new THREE.Vector2()

        this.camera.position.set(1.2, 1.2, 1.2)

        /**
         * Shader chunks
         */
        THREE.ShaderChunk['perlin_3d'] = perlin_3d

        /**
         * Colors
         */
        const COLORS = {
            globalColor: 0x32e6e6,
            depthColor: 0x186691,
            surfaceColor: 0x9bd8ff,
        }

        /**
         * Sphere
         */
        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.RawShaderMaterial({
                vertexShader: main_vs,
                fragmentShader: main_fs,
                uniforms: {
                    uLightDirection: { value: new THREE.Vector3(1, 0, 1) },
                    uTime: { value: 0 },
                    uGlobalColor: { value: new THREE.Color(COLORS.globalColor) },
                    invMatrix: { value: new THREE.Matrix4() }
                }
            })
        )
        // this.scene.add(this.sphere)

        this.gui_sphere = this.gui.addFolder('sphere').open(false)
        this.gui_sphere.addColor(this.sphere.material.uniforms.uGlobalColor, 'value').name('globalColor')
        this.gui_sphere.add(this.sphere.material.uniforms.uLightDirection.value, 'x').min(-1).max(1).step(0.01)

        /**
         * Sea
         */
        this.sea = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 512, 512),
            new THREE.ShaderMaterial({
                vertexShader: sea_vs,
                fragmentShader: sea_fs,
                uniforms: {
                    uTime: { value: 0 },

                    uBigWavesElevation: { value: 0.2 },
                    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                    uBigWavesSpeed: { value: 0.75 },

                    uSmallWavesElevation: { value: 0.15 },
                    uSmallWavesFrequency: { value: 3 },
                    uSmallWavesSpeed: { value: 0.2 },

                    uDepthColor: { value: new THREE.Color(COLORS.depthColor) },
                    uSurfaceColor: { value: new THREE.Color(COLORS.surfaceColor) },
                    uColorOffset: { value: 0.08 },
                    uColorMultiplier: { value: 5 },
                }
            })
        )
        this.sea.rotation.x = - Math.PI * 0.5
        this.scene.add(this.sea)

        const seaUniforms = this.sea.material.uniforms
        this.gui_sea = this.gui.addFolder('sea')

        this.gui_sea.add(seaUniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
        this.gui_sea.add(seaUniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
        this.gui_sea.add(seaUniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
        this.gui_sea.add(seaUniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

        this.gui_sea.add(seaUniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
        this.gui_sea.add(seaUniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
        this.gui_sea.add(seaUniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')

        this.gui_sea.addColor(seaUniforms.uDepthColor, 'value').name('uDepthColor')
        this.gui_sea.addColor(seaUniforms.uSurfaceColor, 'value').name('uSurfaceColor')
        this.gui_sea.add(seaUniforms.uColorOffset, 'value').min(0).max(4).step(0.001).name('uColorOffset')
        this.gui_sea.add(seaUniforms.uColorMultiplier, 'value').min(0).max(4).step(0.001).name('uColorMultiplier')

        /**
         * Event listeners
         */
        window.addEventListener('mousemove', this.getNormalizedMousePosition.bind(this))
        window.addEventListener('resize', this.onResize.bind(this))

        // this.renderer.autoClearColor = false
        this.clock = new THREE.Clock()
        this.animate()
    }

    /**
     * Animate
     */
    animate()
    {
        this.controls.update()

        // this.mouseUpdate()

        const elapsedTime = this.clock.getElapsedTime()

        this.sphere.rotation.y += 0.01
        const invMat = this.sphere.matrixWorld.clone().invert()
        this.sphere.material.uniforms.invMatrix.value = invMat

        this.sea.material.uniforms.uTime.value = elapsedTime

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
}
