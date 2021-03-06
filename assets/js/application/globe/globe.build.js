import * as THREE from '../../lib/three.module.js'
import {GPUComputationRenderer} from '../../lib/GPUComputationRenderer.js'
import PARAM from './globe.param.js'
import PUBLIC_METHOD from '../../method/method.js'
import POINT from './point/globe.point.build.js'
import BLOOM from './bloom/globe.bloom.build.js'
import COVER from './cover/globe.cover.build.js'
import LIGHT from './light/globe.light.build.js'
import PARTICLE from './particle/globe.particle.build.js'
import PARTICLE2 from './particle2/globe.particle2.build.js'


export default class{
    constructor(app){
        this.init(app)
        this.create(app)
        this.add()
    }


    // init
    init(app){
        this.modules = {
            bloom: BLOOM,
            point: POINT,
            cover: COVER,
            light: LIGHT,
            particle: PARTICLE,
            particle2: PARTICLE2
        }

        this.mouseX = 0
        this.mouseY = 0
        
        this.cPhi = 0
        this.cTheta = 0
        this.vPhi = 0
        this.vTheta = 0

        this.initGroup()
        this.initRenderObject()
        this.initGPGPU(app)
    }
    initGroup(){
        this.group = {}
        this.comp = {}

        for(const module in this.modules){
            this.group[module] = new THREE.Group()
            this.comp[module] = null
        }

        this.build = new THREE.Group()
    }
    initRenderObject(){
        this.element = document.querySelector('.globe-object')

        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(PARAM.fov, width / height, PARAM.near, PARAM.far)
        this.camera.position.z = PARAM.pos
        
        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PUBLIC_METHOD.getVisibleWidth(this.camera, 0),
                h: PUBLIC_METHOD.getVisibleHeight(this.camera, 0)
            }
        }
    }
    initGPGPU({renderer}){
        this.gpuCompute = new GPUComputationRenderer(PARAM.w, PARAM.h, renderer)
    }


    // add
    add(){
        for(let i in this.group) this.build.add(this.group[i])
        
        this.scene.add(this.build)
    }


    // create
    create(){
        for(const module in this.modules){
            const instance = this.modules[module]
            const group = this.group[module]

            this.comp[module] = new instance({group, size: this.size.obj, gpuCompute: this.gpuCompute})
        }

        this.gpuCompute.init()
    }


    // animate
    animate({app}){
        this.gpuCompute.compute()

        this.render(app)
        
        // switch this method
        // this.calcDegree()
        this.animateObject()
    }
    render(app){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = app.renderer.domElement.clientHeight - rect.bottom

        app.renderer.setScissor(left, bottom, width, height)
        app.renderer.setViewport(left, bottom, width, height)

        this.camera.lookAt(this.scene.position)
        app.renderer.render(this.scene, this.camera)
    }
    animateObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].animate) continue
            this.comp[i].animate({camera: this.camera, phi: this.vPhi, theta: this.vTheta})
        }
    }
    calcDegree(){
        this.vPhi += (this.cPhi - this.vPhi) * 0.05
        this.vTheta += (this.cTheta - this.vTheta) * 0.05
        // const {x, y, z} = PUBLIC_METHOD.getSphereCoord(this.vPhi, this.vTheta, PARAM.pos)

        // this.camera.position.x = x
        // this.camera.position.y = y
        // this.camera.position.z = z
    }


    // resize
    resize(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PUBLIC_METHOD.getVisibleWidth(this.camera, 0),
                h: PUBLIC_METHOD.getVisibleHeight(this.camera, 0)
            }
        }

        this.resizeObject()
    }
    resizeObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].resize) continue
            this.comp[i].resize(this.size)
        }
    }


    // mouse move
    mouseMove({clientX, clientY, width, height}){
        const halfX = width / 2
        const halfY = height / 2

        this.cTheta = ((clientX - halfX) / -halfX) * 10
        this.cPhi = ((clientY - halfY) / halfY) * 10
    }
}