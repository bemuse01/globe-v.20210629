import * as THREE from '../../../lib/three.module.js'
import GRID from '../../../data/grid.js'
import METHOD from './globe2.point.method.js'
import BUILD_PARAM from '../globe2.param.js'

export default class{
    constructor({group}){
        this.init()
        this.create()
        this.add(group)    
    }


    // init
    init(){
        this.param = {
            color: BUILD_PARAM.color,
            radius: BUILD_PARAM.radius,
            size: 2.0,
            opacity: 1.0
        }
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
        this.mesh.rotation.z = -BUILD_PARAM.rotation * RADIAN
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const {position} = METHOD.createAttribute({grid: GRID, ...this.param})

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createMaterial(){
        return new THREE.PointsMaterial({
            color: this.param.color,
            transparent: true,
            opacity: this.param.opacity
        })
    }


    // animate
    animate(){

    }
}