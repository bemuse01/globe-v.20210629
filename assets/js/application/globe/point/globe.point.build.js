import * as THREE from '../../../lib/three.module.js'
import GRID from '../../../data/grid.js'
import METHOD from './globe.point.method.js'
import PARAM from './globe.point.param.js'

export default class{
    constructor({group}){
        this.init()
        this.create()
        this.add(group)
    }


    // init
    init(){
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

        const {position} = METHOD.createAttribute({grid: GRID, ...PARAM})

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createMaterial(){
        return new THREE.PointsMaterial({
            color: PARAM.color,
            size: PARAM.size
        })
    }


    // animate
    animate(){
        // this.mesh.rotation.x += 0.005
        this.mesh.rotation.y += PARAM.vel
    }
}