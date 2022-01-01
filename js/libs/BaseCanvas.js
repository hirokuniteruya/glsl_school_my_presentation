/**
 * どのプロジェクトでも使いそうな ThreeJS の各種オブジェクトや
 * 独自メソッドを定義した BaseCanvas クラスのファイルです。
 */
import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { GUI } from 'lil-gui'

const DEFAULT_CAM_POS = { x: 0, y: 0, z: 4 }

const CAM_PARAMS = {
    fovy: 60,
    near: 0.1,
    far: 1000,
}

export class BaseCanvas {
    /**
     * @param {Object} options - オプション
     * @param {boolean} [options.axesHelper=false] - GridHelper を使用するかどうか（初期値: false）
     * @param {boolean} [options.gridHelper=false] - AxesHelper を使用するかどうか（初期値: false）
     * @param {boolean} [options.orbitControls=false] - OrbitControls を使用するかどうか（初期値: false）
     * @param {boolean} [options.autoResize=false] - 自動的にリサイズ処理を行うかどうか（初期値: false）
     */
    constructor( options = {} )
    {
        const _axesHelper = options.axesHelper ?? false
        const _gridHelper = options.gridHelper ?? false
        const _orbitControls = options.orbitControls ?? false
        const _autoResize = options.autoResize ?? false

        this.sizes = {
            width:  window.innerWidth,
            height: window.innerHeight,
            aspect: window.innerWidth / window.innerHeight
        }

        this.mouse = new THREE.Vector2(0, 0)

        /* Scene */
        this.scene = new THREE.Scene()

        /* Camera */
        this.camera = new THREE.PerspectiveCamera(
            CAM_PARAMS.fovy,
            this.sizes.aspect,
            CAM_PARAMS.near,
            CAM_PARAMS.far
        )
        this.camera.position.set(...Object.values(DEFAULT_CAM_POS))

        /* Renderer */
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setClearColor(0x000000)
        document.body.appendChild(this.renderer.domElement)

        /* CSS3DRenderer */
        this.css3DRenderer = new CSS3DRenderer()
        this.css3DRenderer.domElement.style.position      = 'absolute'
        this.css3DRenderer.domElement.style.top           = 0
        this.css3DRenderer.domElement.style.pointerEvents = 'none'
        this.css3DRenderer.setSize(this.sizes.width, this.sizes.height);
        document.body.appendChild(this.css3DRenderer.domElement)

        /* Loader */
        this.textureLoader = new THREE.TextureLoader()
        // this.cubeTexLoader = new THREE.CubeTextureLoader()

        /* Helpers */
        if(_axesHelper === true) {
            this.axesHelper = new THREE.AxesHelper(10),
            this.scene.add(this.axesHelper)
        }
        if(_gridHelper === true) {
            this.gridHelper = new THREE.GridHelper(10, 10)
            this.gridHelper.rotation.x = Math.PI / 2
            this.gridHelper.position.z = -.02
            this.scene.add(this.gridHelper)
        }

        /* Controls */
        if(_orbitControls === true) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.enableDamping = true
        }

        /* GUI */
        this.gui = new GUI()

        /* Event listener */
        if(_autoResize === true) {
            window.addEventListener('resize', this.onResize.bind(this))
        }
    }

    onResize()
    {
        this.sizes.width  = window.innerWidth
        this.sizes.height = window.innerHeight
        this.sizes.aspect = this.sizes.width / this.sizes.height

        this.camera.aspect = this.sizes.aspect
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.css3DRenderer.setSize(this.sizes.width, this.sizes.height)
    }

    getScreenMousePosition(ev) {
        this.mouse.x = ev.clientX
        this.mouse.y = ev.clientY
    }

    getNormalizedMousePosition(ev) {
        this.mouse.x =   ( ev.clientX / this.sizes.width  ) * 2 - 1
        this.mouse.y = - ( ev.clientY / this.sizes.height ) * 2 + 1
    }
}
