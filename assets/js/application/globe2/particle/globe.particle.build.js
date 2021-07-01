import * as THREE from '../../../lib/three.module.js'
import {GPUComputationRenderer} from '../../../lib/GPUComputationRenderer.js'
import GRID from '../../../data/grid.js'
import POINT_PARAM from '../point/globe.point.param.js'

export default class{
    constructor({group, renderer}){
        this.init(renderer)
        this.create()
        this.add(group)
    }


    // init
    init(renderer){
        this.param = {
            w: 5,
            h: GRID.length,
            size: 2.0,
            color: POINT_PARAM.color,
            radius: POINT_PARAM.radius
        }

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
        // this.createVelocityTexture()
        this.createPositionTexture()
    }
    initTexture(){
        // this.initVelocityTexture()
        this.initPositionTexture()
    }

    // velocity texture
    createVelocityTexture(){
        const velocity = this.gpuCompute.createTexture()

        METHOD.fillVelocityTexture(velocity, PARAM)

        this.velocityVariable = this.gpuCompute.addVariable('velocity', SHADER.velocity.fragment, velocity)
    }
    initVelocityTexture(){
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.velocityVariable, this.positionVariable])

        // this.velocityUniforms = this.velocityVariable.material.uniforms
    }

    // position texture
    createPositionTexture(){
        const position = this.gpuCompute.createTexture()

        METHOD.fillPositionTexture(position)

        this.positionVariable = this.gpuCompute.addVariable('position', SHADER.position.fragment, position)
    }
    initPositionTexture(){
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable])

        this.positionUniforms = this.positionVariable.material.uniforms
        
        this.positionUniforms['radius'] = {value: this.param.radius}
    }


    // add
    add(group){

    }


    // create
    create(){

    }
    createMesh(){

    }
    createGeometry(){

    }
    createMaterial(){

    }
}