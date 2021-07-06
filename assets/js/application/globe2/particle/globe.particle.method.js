import * as THREE from '../../../lib/three.module.js'

export default {
    createAttributeCoord({w, h}){
        const coord = []

        for(let i = 0; i < h; i++){
            for(let j = 0; j < w; j++){
                const u = j
                const v = i

                coord.push(u, v)
            }
        }

        return new Float32Array(coord)
    },
    fillPositionTexture(texture, radius){
        const {data, width, height} = texture.image

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                // position x
                data[index] = 0
                // position y
                data[index + 1] = 0
                // position z
                data[index + 2] = 0
                // radius
                data[index + 3] = radius
            }
        }
    },
    fillVelocityTexture(texture, grid){
        const {data, width, height} = texture.image
        
        for(let j = 0; j < height; j++){
            const {lat, lon} = grid[j]

            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                // life (opacity)
                data[index] = Math.random()
                // current latitude
                data[index + 1] = -lat
                // current longitude
                data[index + 2] = lon
                // life velocity
                data[index + 3] = Math.random() * 0.035 + 0.005
            }
        }
    },
    createSphereCoordTexture({w, h, grid}){
        const data = new Float32Array(w * h)

        for(let j = 0; j < h; j++){
            const {lat, lon} = grid[j]

            for(let i = 0; i < w; i++){
                const index = (j * w + i)

                // origin latitude
                data[index] = -lat
            }
        }

        return new THREE.DataTexture(data, w, h, THREE.RedFormat, THREE.FloatType)
    }
}