import * as THREE from '../../../lib/three.module.js'
import BUILD_PARAM from '../globe2.param.js'
import METHOD from './globe2.particle.method.js'
import PUBLIC_METHOD from '../../../method/method.js'

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
            reduce: 2.4
        }
    }


    // add
    add(group){
        group.add(this.particle)
    }


    // create
    create(){
        this.particle = this.createParticleMesh()
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

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

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

    }
    createLineGeometry(){

    }
    createLineMaterial(){

    }


    // animate
    animate({size}){
        const {w, h} = size.obj
        const radius = Math.max(w, h) / this.param.reduce

        // particle
        const pPosition = this.particle.geometry.attributes.position
        const pArray = pPosition.array

        for(let i = 0; i < this.param.count; i++){
            const index = i * 3
            const {position, velocity} = this.data[i]
            const {x, y, z} = PUBLIC_METHOD.getSphereCoord2(position.phi, position.theta, radius)

            position.phi = (position.phi + velocity.phi) % 360
            position.theta = (position.theta + velocity.theta) % 360

            pArray[index] = x
            pArray[index + 1] = y
            pArray[index + 2] = z

            // for(let j = i; j < this.param.count; j++){
            //     if(points.data[j].connection >= this.param.maxConnection) continue

            //     const dx = points.position[i * 3] - points.position[j * 3]
            //     const dy = points.position[i * 3 + 1] - points.position[j * 3 + 1]
            //     const dz = points.position[i * 3 + 2] - points.position[j * 3 + 2]
            //     const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

            //     if(dist < this.param.minDist){
            //         const alpha = 1.0 - dist / this.param.minDist

            //         points.data[i].connection++
            //         points.data[j].connection++

            //         line.position[vertexPos++] = points.position[i * 3]
            //         line.position[vertexPos++] = points.position[i * 3 + 1]
            //         line.position[vertexPos++] = points.position[i * 3 + 2]

            //         line.position[vertexPos++] = points.position[j * 3]
            //         line.position[vertexPos++] = points.position[j * 3 + 1]
            //         line.position[vertexPos++] = points.position[j * 3 + 2]

            //         line.opacity[opacityPos++] = alpha
            //         line.opacity[opacityPos++] = alpha

            //         connection++
            //     }
            // }
        }

        pPosition.needsUpdate = true
    }
}