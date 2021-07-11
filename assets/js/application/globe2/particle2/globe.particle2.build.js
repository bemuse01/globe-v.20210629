import * as THREE from '../../../lib/three.module.js'
import BUILD_PARAM from '../globe.param.js'
import PUBLIC_METHOD from '../../../method/method.js'
import METHOD from './globe.particle2.method.js'

export default class{
    constructor({group}){
        this.init()
        this.create()
        this.add(group)
    }


    // init
    init(){
        this.param = {
            radius: BUILD_PARAM.radius,
            color: 0xffffff,
            count: 200,
            vel: 0.5,
            size: 2.5,
            rd: {
                min: 0.95,
                max: 0.25
            }
        }

        this.radius = METHOD.createRadius(this.param)
        this.degree = METHOD.createDegree(this.param)
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
        this.mesh = new THREE.Points(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()
        
        const position = new Float32Array(this.param.count * 3)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createMaterial(){
        return new THREE.PointsMaterial({
            color: this.param.color,
            size: this.param.size
        })
    }


    // animate
    animate(){
        const position = this.mesh.geometry.attributes.position
        const array = position.array

        for(let i = 0; i < this.param.count; i++){
            const index = i * 3
            const {phi, theta, vel} = this.degree[i]
            const {x, y, z} = PUBLIC_METHOD.getSphereCoord2(-phi, theta, this.radius[i])

            array[index] = x
            array[index + 1] = y
            array[index + 2] = z

            // this.degree[i].phi = (this.degree[i].phi + vel) % 180
            // this.degree[i].theta = (this.degree[i].theta + vel) % 360
            this.degree[i].phi += vel
            this.degree[i].theta += vel
        }

        position.needsUpdate = true
    }
}