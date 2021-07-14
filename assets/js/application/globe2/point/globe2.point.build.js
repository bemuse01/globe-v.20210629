import * as THREE from '../../../lib/three.module.js'
import GRID from '../../../data/grid.js'
import METHOD from './globe2.point.method.js'
import BUILD_PARAM from '../globe2.param.js'

export default class{
    constructor({group, size}){
        this.init(size)
        this.create()
        this.add(group)    
    }


    // init
    init(size){
        this.size = size

        this.param = {
            color: BUILD_PARAM.color,
            pSize: 3.0,
            opacity: 0.6,
            ratio: BUILD_PARAM.ratio,
            reduce: BUILD_PARAM.reduce
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
        const {position} = METHOD.createAttribute({grid: GRID, size: this.size.obj, ...this.param})

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createMaterial(){
        return new THREE.PointsMaterial({
            color: this.param.color,
            transparent: true,
            opacity: this.param.opacity,
            size: this.param.pSize
        })
    }


    // resize
    resize(size){
        this.size = size

        this.mesh.geometry.dispose()
        this.mesh.geometry = this.createGeometry()
    }


    // animate
    animate(){
        this.mesh.rotation.y += BUILD_PARAM.vel
    }
}