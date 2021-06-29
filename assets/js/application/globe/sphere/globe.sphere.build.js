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
            seg: {
                w: 36,
                h: 20
            },
            vel: POINT_PARAM.vel
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

        const {sphereGeometry} = this.createGeometry()
        const {sphereMaterial} = this.createMaterial()

        // sphere
        const sphere = new THREE.LineSegments(sphereGeometry, sphereMaterial)

        this.local.add(sphere)
    }
    createGeometry(){
        // sphere
        const sphere = new THREE.SphereGeometry(this.param.radius, this.param.seg.w, this.param.seg.h)
        const sphereGeometry = new THREE.EdgesGeometry(sphere)

        // point
        const pointGeometry = new THREE.BufferGeometry()

        return {sphereGeometry}
    }
    createMaterial(){
        return {
            // sphere
            sphereMaterial: new THREE.LineBasicMaterial({
                color: this.param.color,
                transparent: true,
                opacity: 0.125
            }),
            pointMaterial: new THREE.PointsMaterial({

            })
        }
    }


    animate(){
        this.local.rotation.y += this.param.vel
    }
}