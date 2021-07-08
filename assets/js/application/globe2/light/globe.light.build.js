import * as THREE from '../../../lib/three.module.js'
import BUILD_PARAM from '../globe.param.js'

export default class{
    constructor({group}){
        this.init()
        this.create()
        this.add(group)
    }


    // init
    init(){
        this.param = {
            count: 8,
            color: BUILD_PARAM.color,
            intensity: 3.5,
            dist: BUILD_PARAM.radius + 300,
            radius: BUILD_PARAM.radius + 420,
            step: 40
        }
    }


    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(){
        this.local = new THREE.Group()

        const degree = 360 / this.param.count
        const dist = this.createDistance()

        for(let i = 0; i < this.param.count; i++){
            const light = new THREE.PointLight(this.param.color, this.param.intensity, dist[i])

            const deg = degree * i * RADIAN
            const x = Math.cos(deg) * this.param.radius
            const y = Math.sin(deg) * this.param.radius

            light.position.set(x, y, 0)

            this.local.add(light)
        }
        
        this.local.rotation.z = 70 * RADIAN 
    }
    createDistance(){
        const dist = []

        for(let i = 0; i < this.param.count / 2; i++){
            const distance = this.param.dist - i * this.param.step
            dist[i] = distance < 0 ? 0 : distance
        }

        const reverse = [...dist].reverse()

        return [...dist, ...reverse]
    }


    // animate
    animate({camera}){
        // this.local.lookAt(camera.position)
    }
}