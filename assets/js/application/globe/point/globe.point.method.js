import PUBLIC_METHOD from '../../../method/method.js'

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

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

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
    fillVelocityTexture(texture, {grid, range}){
        const {data, width, height} = texture.image
        const halfRange = range / 2
        
        for(let j = 0; j < height; j++){
            const {lat, lon} = grid[j]

            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                const r1 = Math.random() * halfRange - halfRange
                const r2 = Math.random() * halfRange - halfRange
                
                // latitude
                data[index] = -lat + r1
                // longitude
                data[index + 1] = lon + r2
                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    }
}