import PUBLIC_METHOD from '../../../method/method.js'

export default {
    createAttribute({grid, radius, range, w}){
        const halfRange = range / 2
        const position = []
        const len = grid.length

        for(let i = 0; i < len * w; i++){
            const {lat, lon} = grid[i % len]

            const r1 = Math.random() * halfRange - halfRange
            const r2 = Math.random() * halfRange - halfRange
            
            const {x, y, z} = PUBLIC_METHOD.getSphereCoord(-lat + r1, lon + r2, radius)
            position.push(x, y, z)
        }
        
        return {position: new Float32Array(position)}
    },
    fillPositionTexture(texture, {grid, radius, range, dup}){
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
}