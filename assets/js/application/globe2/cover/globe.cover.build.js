import * as THREE from '../../../lib/three.module.js'
import POINT_PARAM from '../point/globe.point.param.js'

export default class{
    constructor({group}){
        this.init()
        this.create()
        this.add(group)
    }


    // init
    init(){
        this.param = {
            radius: POINT_PARAM.radius,
            color: POINT_PARAM.color,
            seg: 32
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
        this.mesh = new THREE.Mesh(geometry, material)
    }
    createGeometry(){
        return new THREE.SphereGeometry(this.param.radius, this.param.seg, this.param.seg)
    }
    createMaterial(){
        return new THREE.MeshPhongMaterial({
            color: this.param.color,
            transparent: true
        })
    }
}