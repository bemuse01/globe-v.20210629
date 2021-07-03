import * as THREE from '../../../lib/three.module.js'
import GRID from '../../../data/grid.js'
import METHOD from './globe.point.method.js'
import BUILD_PARAM from '../globe.param.js'
import SHADER from './globe.point.shader.js'

export default class{
    constructor({group, gpuCompute}){
        this.init(gpuCompute)
        this.create()
        this.add(group)
    }


    // init
    init(gpuCompute){
        this.gpuCompute = gpuCompute

        this.param = {
            color: BUILD_PARAM.color,
            w: BUILD_PARAM.w,
            h: BUILD_PARAM.h,
            radius: BUILD_PARAM.radius,
            size: 1.0,
            range: 5,
            layers: PROCESS
        }

        this.initGPGPU()
    }
    initGPGPU(){
        this.createTexture()
        this.initTexture()
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

        METHOD.fillPositionTexture(position, this.param.radius)

        this.positionVariable = this.gpuCompute.addVariable('tPosition', SHADER.position, position)
    }
    initPositionTexture(){
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable])

        this.positionUniforms = this.positionVariable.material.uniforms
        
        this.positionUniforms['uRadius'] = {value: this.param.radius}
        this.positionUniforms['uVelocity'] = {value: this.param.velocity}
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
                uPosition: {value: null}
            }
        })
    }


    // animate
    animate(){
        // this.local.children[0].rotation.y += this.param.vel

        this.local.children[0].material.uniforms['uPosition'].value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
    }
}