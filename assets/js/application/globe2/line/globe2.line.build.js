import GRID from '../../../data/grid.js'
import * as THREE from '../../../lib/three.module.js'
import METHOD from './globe2.line.method.js'
import BUILD_PARAM from '../globe2.param.js'
import SHADER from './globe2.line.shader.js'

export default class{
    constructor({group, size}){
        this.init(size)
        this.create()
        this.add(group)
    }


    // init
    init(size){
        this.param = {
            count: 60,
            w: BUILD_PARAM.w,
            h: BUILD_PARAM.h,
            div: BUILD_PARAM.div,
            color: BUILD_PARAM.color
        }

        const {w, h} = size.obj
        this.radius = Math.max(w, h) / this.param.div
    }


    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(){
        this.local = new THREE.Group()
        this.transform = new THREE.Group()

        for(let i = 0; i < this.param.count; i++){
            const mesh = this.createMesh()

            this.transform.add(mesh)
        }

        this.local.add(this.transform)
        this.local.rotation.z = -BUILD_PARAM.rotation * RADIAN
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial(geometry.attributes.position.array)
        return new THREE.LineSegments(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const {position} = METHOD.createAttribute(GRID, this.radius)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createMaterial(array){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.vertex,
            fragmentShader: SHADER.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)},
                uOrigin: {value: new THREE.Vector3(array[0], array[1], array[2])},
                uLimit: {value: new THREE.Vector3(array[3], array[4], array[5])}
            },
            // depthTest: false
        })
    }


    // animate
    animate(){
        this.transform.rotation.y += BUILD_PARAM.vel * RADIAN
    }
}