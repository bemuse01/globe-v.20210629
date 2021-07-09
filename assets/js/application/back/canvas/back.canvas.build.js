import * as THREE from '../../../lib/three.module.js'
import METHOD from './back.canvas.method.js'
import BUILD_PARAM from '../back.param.js'
import SHADER from './back.canvas.shader.js'

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
            font: 'arial',
            text: `qwerttyuiop[]{}asdfghjkl;':"zxcvbnm,./<>1234567890-=\\~!@#$%^&*()_+|QWERTYUIOPASDFGHJKLZXCVBNM`,
            fontSize: 6,
            gap: 6
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
        
        METHOD.fillDelayTexture(delay)

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

        METHOD.fillTimeTexture(time)

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
        group.add(this.mesh)
    }


    // create
    create(){
        this.createMesh()
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        this.mesh = new THREE.Mesh(geometry, material)
    }
    createGeometry(){
        return new THREE.PlaneGeometry(this.size.obj.w, this.size.obj.h, this.param.seg, this.param.seg)
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

        this.mesh.geometry.dispose()
        this.mesh.geometry = this.createGeometry()

        this.mesh.material.uniforms['uTexture'].value.dispose()
        this.mesh.material.uniforms['uTexture'].value = this.createTextureFromCanvas()
    }


    // animate
    animate({size}){
        const currentTime = window.performance.now()

        this.delayUniforms['uCurrentTime'].value = currentTime

        this.timeUniforms['uRand'].value = Math.floor(Math.random() * size.el.w)
        this.timeUniforms['uOldTime'].value = currentTime
        this.timeUniforms['uCurrentTime'].value = currentTime

        this.mesh.material.uniforms['uDelay'].value = this.gpuCompute.getCurrentRenderTarget(this.delayVariable).texture
    }
}