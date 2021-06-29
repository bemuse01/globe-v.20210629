import * as THREE from '../../../lib/three.module.js'
import POINT_PARAM from '../point/globe.point.param.js'
import SHADER from './globe.bloom.shader.js'

export default class{
    constructor({group}){
        this.init()
        this.create()
        this.add(group)
    }


    // init
    init(){
        this.param = {
            // radius: CHILD_PARAM.radius + 5,
            radius: POINT_PARAM.radius + 25,
            seg: 128,
            layers: PROCESS,
            // color: 0x1f9eff,
            color: POINT_PARAM.color,
            size: 0.9,
            strength: 20.0,
            brightness: 0.1
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
        // this.mesh.layers.set(this.param.layers)
        // this.mesh.position.set(-3, 4)
        this.mesh.position.set(6, 6)
    }
    createGeometry(){
        return new THREE.CircleGeometry(this.param.radius, this.param.seg)
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.vertex,
            fragmentShader: SHADER.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)},
                uSize: {value: this.param.size},
                uStrength: {value: this.param.strength},
                uBrightness: {value: this.param.brightness}
            }
        })
        // return new THREE.MeshBasicMaterial({
        //     color: this.param.color
        // })
    }
}