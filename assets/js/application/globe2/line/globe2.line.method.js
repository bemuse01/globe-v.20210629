import PUBLIC_METHOD from '../../../method/method.js'

export default {
    createAttribute(grid, radius){
        const position = new Float32Array(2 * 3)

        const {lat, lon} = grid[~~(Math.random() * grid.length)]

        for(let i = 0; i < 2; i++){
            const index = i * 3
            const rad = i === 0 ? radius * 0.6 : radius
            const {x, y, z} = PUBLIC_METHOD.getSphereCoord(-lat, lon, rad)

            position[index] = x
            position[index + 1] = y
            position[index + 2] = z
        }

        return {position}
    },
    fillDelayTexture(texture, {opacityVel}){
        const {data, width, height} = texture.image

        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                // x === opacity
                data[index] = 0.0

                // y === opacity velocity
                data[index + 1] = opacityVel
                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    },
    fillTimeTexture(texture, {timeVel}){
        const {data, width, height} = texture.image
        
        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                // x === each texel start time
                data[index] = j * timeVel

                // y === update old time to start again
                data[index + 1] = 0

                // z === enable start (boolean)
                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    },
}