import * as THREE from '../../../lib/three.module.js'
import BUILD_PARAM from '../back.param.js'
import SHADER from './back.line.shader.js'

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
            size: 0.4,
            strength: 1.0,
            color: BUILD_PARAM.color
        }
    }


    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(){
        this.local = new THREE.Group()
        
        const mesh = this.createMesh()

        this.local.add(mesh)
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        return new THREE.LineSegments(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const position = new Float32Array(2 * 3)
        const h = this.size.h * 0.4

        for(let i = 0; i < 2; i++){
            const index = i * 3
            position[index] = 0
            position[index + 1] = i === 0 ? -h / 2 : h / 2 
            position[index + 2] = 0
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.vertex,
            fragmentShader: SHADER.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)},
                uStrength: {value: this.param.strength}
            }
        })
    }
}