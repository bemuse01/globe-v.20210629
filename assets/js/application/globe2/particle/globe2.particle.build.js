import * as THREE from '../../../lib/three.module.js'
import BUILD_PARAM from '../globe2.param.js'
import METHOD from './globe2.particle.method.js'
import PUBLIC_METHOD from '../../../method/method.js'
import SHADER from './globe2.particle.shader.js'

export default class{
    constructor({group}){
        this.init()
        this.create()
        this.add(group)
    }


    // init
    init(){
        this.param = {
            count: 500,
            color: BUILD_PARAM.color,
            size: 4.0,
            velocity: 0.025,
            reduce: 2.4,
            maxConnections: 10,
            minDist: 30
        }
    }


    // add
    add(group){
        group.add(this.particle)
        group.add(this.line)
    }


    // create
    create(){
        this.particle = this.createParticleMesh()
        this.line = this.createLineMesh()
    }
    // particle
    createParticleMesh(){
        const geometry = this.createParticleGeometry()
        const material = this.createParticleMaterial()
        return new THREE.Points(geometry, material)
    }
    createParticleGeometry(){
        const geometry = new THREE.BufferGeometry()

        const position = new Float32Array(this.param.count * 3)
        this.data = METHOD.createParticleData(this.param)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3).setUsage(THREE.DynamicDrawUsage))

        return geometry
    }
    createParticleMaterial(){
        return new THREE.PointsMaterial({
            color: this.param.color,
            transparent: true,
            opacity: 1.0,
            size: this.param.size
        })
    }
    // line
    createLineMesh(){
        const geometry = this.createLineGeometry()
        const material = this.createLineMaterial()
        return new THREE.LineSegments(geometry, material)
    }
    createLineGeometry(){
        const geometry = new THREE.BufferGeometry()

        const position = new Float32Array(this.param.count ** 2 * 3)
        const opacity = new Float32Array(this.param.count ** 2)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3).setUsage(THREE.DynamicDrawUsage))
        geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacity, 1).setUsage(THREE.DynamicDrawUsage))

        console.log(geometry)

        return geometry
    }
    createLineMaterial(){
        new THREE.ShaderMaterial({
            vertexShader: SHADER.line.vertex,
            fragmentShader: SHADER.line.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)}
            },
            depthTest: false
        })
    }


    // animate
    animate({size}){
        const {w, h} = size.obj
        const radius = Math.max(w, h) / this.param.reduce

        let lineVertexIndex = 0
        let lineOpacityIndex = 0
        let curConnection = 0

        // particle
        const pPosition = this.particle.geometry.attributes.position
        const pArray = pPosition.array

        // line
        const line = this.line.geometry
        const lPosition = line.attributes.position
        const lPosArray = lPosition.array
        const lOpacity = line.attributes.aOpacity
        const lOpaArray = lOpacity.array

        for(let i = 0; i < this.param.count; i++) this.data[i].connections = 0

        for(let i = 0; i < this.param.count; i++){
            const iIndex = i * 3
            const {position, velocity, connections} = this.data[i]
            const {x, y, z} = PUBLIC_METHOD.getSphereCoord2(position.phi, position.theta, radius)

            position.phi = (position.phi + velocity.phi) % 360
            position.theta = (position.theta + velocity.theta) % 360

            pArray[iIndex] = x
            pArray[iIndex + 1] = y
            pArray[iIndex + 2] = z

            if(connections >= this.param.maxConnections) continue

            for(let j = i; j < this.param.count; j++){
                if(this.data[j].connections >= this.param.maxConnections) continue
                const jIndex = j * 3

                const dx = pArray[iIndex] - pArray[jIndex]
                const dy = pArray[iIndex + 1] - pArray[jIndex + 1]
                const dz = pArray[iIndex + 2] - pArray[jIndex + 2]
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

                if(dist < this.param.minDist){
                    const alpha = 1.0 - dist / this.param.minDist

                    this.data[i].connections++
                    this.data[j].connections++

                    lPosArray[lineVertexIndex++] = pArray[iIndex]
                    lPosArray[lineVertexIndex++] = pArray[iIndex + 1]
                    lPosArray[lineVertexIndex++] = pArray[iIndex + 2]

                    lPosArray[lineVertexIndex++] = pArray[jIndex]
                    lPosArray[lineVertexIndex++] = pArray[jIndex + 1]
                    lPosArray[lineVertexIndex++] = pArray[jIndex + 2]

                    lOpaArray[lineOpacityIndex++] = alpha
                    lOpaArray[lineOpacityIndex++] = alpha

                    curConnection++
                }
            }
        }

        pPosition.needsUpdate = true

        line.setDrawRange(0, curConnection * 2)
        lPosition.needsUpdate = true
        lOpacity.needsUpdate = true
        console.log(lOpacity)
    }
}