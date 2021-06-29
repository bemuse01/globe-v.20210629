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
            vel: POINT_PARAM.vel,
            size: 2.0
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

        const {sphereGeometry, pointGeometry} = this.createGeometry()
        const {sphereMaterial, pointMaterial} = this.createMaterial()

        // sphere
        const sphere = new THREE.LineSegments(sphereGeometry, sphereMaterial)

        // point
        const point = new THREE.Points(pointGeometry, pointMaterial)

        this.local.add(sphere)
        this.local.add(point)
    }
    createGeometry(){
        // sphere
        const sphere = new THREE.SphereGeometry(this.param.radius, this.param.seg.w, this.param.seg.h)
        const sphereGeometry = new THREE.EdgesGeometry(sphere)


        // point
        const pointPosition = new Float32Array([...sphere.attributes.position.array])
        const pointGeometry = new THREE.BufferGeometry()

        pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPosition, 3))

        return {sphereGeometry, pointGeometry}
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
                color: this.param.color,
                transparent: true,
                opacity: 0.6,
                size: this.param.size
            })
        }
    }


    animate(){
        this.local.rotation.y += this.param.vel
    }
}