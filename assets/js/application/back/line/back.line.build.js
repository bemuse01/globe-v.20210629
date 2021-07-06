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
        this.h = this.size.h / 2
        this.len = this.size.h * 0.75 / 2

        this.param = {
            size: 0.4,
            strength: 1.0,
            count: 30,
            color: BUILD_PARAM.color,
            velocity: -20,
            chance: 0.975,
            opacity: 0.15
        }


    }


    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(){
        this.local = new THREE.Group()
        const w = this.size.w
        
        for(let i = 0; i < this.param.count; i++){
            const mesh = this.createMesh()

            mesh.position.x = Math.random() * this.size.w - this.size.w / 2
            mesh.position.y = this.h + this.len
            mesh.play = false

            this.local.add(mesh)
        }

    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        return new THREE.LineSegments(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const position = new Float32Array(2 * 3)

        for(let i = 0; i < 2; i++){
            const index = i * 3
            position[index] = 0
            position[index + 1] = i === 0 ? -this.len : this.len 
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
                uStrength: {value: this.param.strength},
                uMaxDist: {value: this.len},
                uOrigin: {value: new THREE.Vector3(0, this.len, 0)},
                uOpacity: {value: this.param.opacity}
            }
        })
    }


    // animate
    animate(){
        this.local.children.forEach(mesh => {
            if(Math.random() > this.param.chance && mesh.play === false) mesh.play = true
            if(mesh.play) mesh.position.y += this.param.velocity
            if(mesh.position.y <= -(this.h + this.len)){
                mesh.position.x = Math.random() * this.size.w - this.size.w / 2
                mesh.position.y = this.h + this.len
                mesh.play = false
            }
        })
    }
}