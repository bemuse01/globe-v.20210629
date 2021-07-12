import * as THREE from '../../../lib/three.module.js'
import METHOD from './back.canvasRight.method.js'
import BUILD_PARAM from '../back.param.js'
import SHADER from './back.canvasRight.shader.js'

export default class{
    constructor({group, size, gpuCompute}){
        this.init(size, gpuCompute)
        this.create()
        this.add(group)
    }


    // init
    init(size, gpuCompute){
        this.gpuCompute = gpuCompute
        this.size = size
        this.oldTime = window.performance.now()

        this.param = {
            seg: 1,
            color: '57, 250, 255',
            opacity: {min: 0.0, max: 1.0},
            font: BUILD_PARAM.font,
            text: BUILD_PARAM.text,
            fontSize: BUILD_PARAM.fontSize,
            gap: BUILD_PARAM.gap,
            rotation: BUILD_PARAM.rotation,
            strength: BUILD_PARAM.strength,
            opacityVel: BUILD_PARAM.opacityVel,
            timeVel: BUILD_PARAM.timeVel
        }

        this.initGPGPU()
    }
    initGPGPU(){
        this.createTexture()
        this.initTexture()
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
        this.delayUniforms['uMaxWidth'] = {value: this.size.el.w / BUILD_PARAM.gpuComputeWidth / BUILD_PARAM.div}
        this.delayUniforms['uStrength'] = {value: this.param.strength}
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
        this.createMesh()
    }
    createMesh(){
        this.local = new THREE.Group()

        const geometry = this.createGeometry()
        const material = this.createMaterial()
        const mesh = new THREE.Mesh(geometry, material)

        const halfPlaneWidth = geometry.parameters.width / 2
        mesh.position.x = this.size.obj.w / 2 - halfPlaneWidth
        
        this.local.rotation.y = -this.param.rotation * RADIAN

        this.local.add(mesh)

        // this.mesh.rotation.x = -30 * RADIAN
        // this.mesh.position.y = 200
        // this.mesh.rotation.y = -30 * RADIAN
    }
    createGeometry(){
        const width = this.size.obj.w / BUILD_PARAM.gpuComputeWidth
        const height = this.size.obj.h / BUILD_PARAM.gpuComputeheight
        return new THREE.PlaneGeometry(width, height, this.param.seg, this.param.seg)
    }
    createMaterial(){
        const texture = this.createTextureFromCanvas()

        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            depthTest: false,
            uniforms: {
                uDelay: {value: null},
                uTexture: {value: texture}
            }
        })
    }
    createTextureFromCanvas(){
        const canvas = METHOD.createTextureFromCanvas({...this.param, ...this.size.obj})
        return new THREE.CanvasTexture(canvas)
    }


    // resize
    resize(size){
        this.size = size

        this.local.children[0].geometry.dispose()
        this.local.children[0].geometry = this.createGeometry()

        this.local.children[0].material.uniforms['uTexture'].value.dispose()
        this.local.children[0].material.uniforms['uTexture'].value = this.createTextureFromCanvas()
    }


    // animate
    animate({size}){
        const currentTime = window.performance.now()

        this.delayUniforms['uCurrentTime'].value = currentTime

        this.timeUniforms['uRand'].value = Math.floor(Math.random() * size.el.h)
        this.timeUniforms['uOldTime'].value = currentTime
        this.timeUniforms['uCurrentTime'].value = currentTime

        this.local.children[0].material.uniforms['uDelay'].value = this.gpuCompute.getCurrentRenderTarget(this.delayVariable).texture
    }
}