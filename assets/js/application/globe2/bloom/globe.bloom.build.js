import * as THREE from '../../../lib/three.module.js'
import BUILD_PARAM from '../globe.param.js'
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
            radius: BUILD_PARAM.radius + 45,
            seg: 128,
            layers: PROCESS,
            // color: 0x95fcff,
            color: BUILD_PARAM.color,
            size: 0.95,
            strength: 20.0,
            brightness: 0.1
        }
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
        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.z = 45 * RADIAN

        this.local.add(mesh)
    }
    createGeometry(){
        return new THREE.CircleGeometry(this.param.radius, this.param.seg)
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.vertex,
            fragmentShader: SHADER.fragment,
            transparent: true,
            depthTest: false,
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

    animate(){
    }
}