import * as THREE from '../../../lib/three.module.js'
import {GPUComputationRenderer} from '../../../lib/GPUComputationRenderer.js'
import GRID from '../../../data/grid.js'
import METHOD from './globe2.line.method.js'
import BUILD_PARAM from '../globe2.param.js'
import SHADER from './globe2.line.shader.js'

export default class{
    constructor({group, size, renderer}){
        this.init(size, renderer)
        this.create()
        this.add(group)
    }


    // init
    init(size, renderer){
        this.param = {
            count: 60,
            w: 1,
            h: 60,
            div: BUILD_PARAM.div,
            color: BUILD_PARAM.color,
            opacityVel: 0.02,
            timeVel: 16,
            opacity: {min: 0.0, max: 1.0}
        }

        const {w, h} = size.obj
        this.radius = Math.max(w, h) / this.param.div

        this.initGPGPU(renderer)
    }
    initGPGPU(renderer){
        this.gpuCompute = new GPUComputationRenderer(this.param.w, this.param.h, renderer)

        this.createTexture()
        this.initTexture()

        this.gpuCompute.init()
    }

    // set texutre
    createTexture(){
        this.createDelayTexture()
        this.createTimeTexture()
    }
    initTexture(){
        this.initDelayTexture()
        this.initTimeTexture()
    }

    // delay texture
    createDelayTexture(){
        const delay = this.gpuCompute.createTexture()
        
        METHOD.fillDelayTexture(delay, this.param)

        this.delayVariable = this.gpuCompute.addVariable('tDelay', SHADER.delay, delay)
    }
    initDelayTexture(){
        this.gpuCompute.setVariableDependencies(this.delayVariable, [this.delayVariable, this.timeVariable])

        this.delayUniforms = this.delayVariable.material.uniforms
        
        this.delayUniforms['uCurrentTime'] = {value: 0.0}
        this.delayUniforms['uOpacityMin'] = {value: this.param.opacity.min}
        this.delayUniforms['uOpacityMax'] = {value: this.param.opacity.max}
    }

    // time texture
    createTimeTexture(){
        const time = this.gpuCompute.createTexture()

        METHOD.fillTimeTexture(time, this.param)

        this.timeVariable = this.gpuCompute.addVariable('tTime', SHADER.time, time)
    }
    initTimeTexture(){
        this.gpuCompute.setVariableDependencies(this.timeVariable, [this.timeVariable])

        this.timeUniforms = this.timeVariable.material.uniforms

        this.timeUniforms['uRand'] = {value: 0.0}
        this.timeUniforms['uOldTime'] = {value: 0.0}
        this.timeUniforms['uCurrentTime'] = {value: 0.0}
    }
    

    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(){
        this.local = new THREE.Group()
        this.transform = new THREE.Group()

        for(let i = 0; i < this.param.count; i++){
            const mesh = this.createMesh()

            this.transform.add(mesh)
        }

        this.local.add(this.transform)
        this.local.rotation.z = -BUILD_PARAM.rotation * RADIAN
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial(geometry.attributes.position.array)
        return new THREE.LineSegments(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const {position} = METHOD.createAttribute(GRID, this.radius)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createMaterial(array){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)},
                uOrigin: {value: new THREE.Vector3(array[0], array[1], array[2])},
                uLimit: {value: new THREE.Vector3(array[3], array[4], array[5])},
                uDelay: {value: null},
            },
            // depthTest: false
        })
    }


    // animate
    animate(){
        this.transform.rotation.y += BUILD_PARAM.vel * RADIAN

        this.gpuCompute.compute()

        const currentTime = window.performance.now()

        this.delayUniforms['uCurrentTime'].value = currentTime

        this.timeUniforms['uRand'].value = Math.floor(Math.random() * this.param.h)
        this.timeUniforms['uOldTime'].value = currentTime
        this.timeUniforms['uCurrentTime'].value = currentTime

        this.transform.children.forEach(mesh => {
            mesh.material.uniforms['uDelay'].value = this.gpuCompute.getCurrentRenderTarget(this.delayVariable).texture
        })
    }
}