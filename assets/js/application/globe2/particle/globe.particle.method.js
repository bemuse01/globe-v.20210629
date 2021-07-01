import {DataTexture, RGFormat, FloatType} from '../../../lib/three.module.js'

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
    fillPositionTexture(texture){
        const {data, width, height} = texture.image
        
        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                // position x
                data[index] = 0
                // position y
                data[index + 1] = 0
                // position z
                data[index + 2] = 0
                // radius
                data[index + 3] = 0
            }
        }
    },
    fillVelocityTexture(texture, grid){
        const {data, width, height} = texture.image
        
        for(let j = 0; j < height; j++){
            const {lat, lon} = grid[j]

            for(let i = 0; i < width; i++){
                const index = (i * width + j) * 4

                // life (opacity)
                data[index] = 1
                // latitude
                data[index + 1] = lat
                // longitude
                data[index + 2] = lon
                data[index + 3] = 0
            }
        }
    }
}