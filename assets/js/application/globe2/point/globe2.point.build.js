import * as THREE from '../../../lib/three.module.js'
import {GPUComputationRenderer} from '../../../lib/GPUComputationRenderer.js'
import GRID from '../../../data/grid.js'
import METHOD from './globe2.point.method.js'
import BUILD_PARAM from '../globe2.param.js'
import SHADER from './globe2.point.shader.js'

export default class{
    constructor({group, size, renderer}){
        this.init(size, renderer)
        this.create()
        this.add(group)    
    }


    // init
    init(size, renderer){
        this.param = {
            w: BUILD_PARAM.w,
            h: BUILD_PARAM.h,
            color: BUILD_PARAM.color,
            pSize: 3.0,
            opacity: 0.5,
            ratio: BUILD_PARAM.ratio,
            div: BUILD_PARAM.div,
            range: 5,
            reduce: 0.85
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
        this.createVelocityTexture()
        this.createPositionTexture()
    }
    initTexture(){
        this.initVelocityTexture()
        this.initPositionTexture()
    }

    // velocity texture
    createVelocityTexture(){
        const velocity = this.gpuCompute.createTexture()

        METHOD.fillVelocityTexture(velocity, {grid: GRID, ...this.param})

        this.velocityVariable = this.gpuCompute.addVariable('tVelocity', SHADER.velocity, velocity)
    }
    initVelocityTexture(){
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.velocityVariable, this.positionVariable])

        this.velocityUniforms = this.velocityVariable.material.uniforms

        this.velocityUniforms['uAcceleration'] = {value: this.param.acceleration}
        this.velocityUniforms['uLatVelocity'] = {value: BUILD_PARAM.vel}
    }

    // position texture
    createPositionTexture(){
        const position = this.gpuCompute.createTexture()

        METHOD.fillPositionTexture(position)

        this.positionVariable = this.gpuCompute.addVariable('tPosition', SHADER.position, position)
    }
    initPositionTexture(){
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable])

        this.positionUniforms = this.positionVariable.material.uniforms
        
        this.positionUniforms['uRadius'] = {value: this.radius}
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
        const mesh = new THREE.Points(geometry, material)
        // mesh.layers.set(this.param.layers)
        
        this.local.add(mesh)
        this.local.rotation.z = -BUILD_PARAM.rotation * RADIAN
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const position = new Float32Array(this.param.w * this.param.h * 3)
        const coord = METHOD.createAttributeCoord(this.param)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        geometry.setAttribute('aCoord', new THREE.BufferAttribute(coord, 2))

        return geometry
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                uSize: {value: this.param.size},
                uColor: {value: new THREE.Color(this.param.color)},
                uPosition: {value: null},
                uMaxDist: {value: this.radius},
                uReduce: {value: this.param.reduce}
            } 
        })
    }


    // resize
    resize(size){
        const {w, h} = size.obj
        this.radius = Math.max(w, h) / this.param.div

        this.positionUniforms['uRadius'].value = this.radius
        this.local.children[0].material.uniforms['uMaxDist'].value = this.radius
    }


    // animate
    animate(){
        this.gpuCompute.compute()

        this.local.children[0].material.uniforms['uPosition'].value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
    }
}