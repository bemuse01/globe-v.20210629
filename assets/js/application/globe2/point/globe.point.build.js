import * as THREE from '../../../lib/three.module.js'
import GRID from '../../../data/grid.js'
import METHOD from './globe.point.method.js'
import PARAM from './globe.point.param.js'
import SHADER from './globe.point.shader.js'

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
        // mesh.layers.set(PARAM.layers)
        
        this.local.add(mesh)
        this.local.rotation.z = -PARAM.rotation * RADIAN
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const {position} = METHOD.createAttribute({grid: GRID, ...PARAM})

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                uSize: {value: PARAM.size},
                uColor: {value: new THREE.Color(PARAM.color)},
                uPosition: {value: null}
            }
        })
    }


    // animate
    animate(){
        // this.local.children[0].rotation.y += PARAM.vel
    }
}