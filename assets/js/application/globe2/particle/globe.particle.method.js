import {DataTexture, RGFormat, FloatType} from '../../../lib/three.module.js'

export default {
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
                data[index + 3] = 0
            }
        }
    },
    fillVelocityTexture(texture){
        const {data, width, height} = texture.image
        
        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                // life (opacity)
                data[index] = 0.0
                // life velocity
                data[index + 1] = Math.random() * 0.01 + 0.01
                // velocity
                data[index + 2] = 1
                // accelarator
                data[index + 3] = 0.1
            }
        }
    },
    createCoordTexture(grid){
        const len = grid.length
        const arr = new Float32Array(len * 2)

        for(let i = 0; i < len; i++){
            const index = i * 2

            const {lat, lon} = grid[i]

            // latitude
            arr[index] = lat
            // longitude 
            arr[index + 1] = lon 
        }

        return new DataTexture(data, 1, len, RGFormat, FloatType)
    }
}