import PUBLIC_METHOD from '../../../method/method.js'

export default {
    createAttribute({grid, radius, w, reduce}){
        const position = new Float32Array(w * 3)
        const coord = new Float32Array(w)

        const {lat, lon} = grid[~~(Math.random() * grid.length)]

        const reducedDist = radius * reduce
        const dist = (radius - reducedDist) / w

        for(let i = 0; i < w; i++){
            const index = i * 3
            // const rad = i === 0 ? radius * 0.6 : radius
            const rad = (i + 1) * dist + reducedDist
            const {x, y, z} = PUBLIC_METHOD.getSphereCoord(-lat, lon, rad)

            position[index] = x
            position[index + 1] = y
            position[index + 2] = z

            coord[i] = i
        }

        return {position, coord}
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
                data[index] = width * timeVel - j * timeVel

                // y === update old time to start again
                data[index + 1] = 0

                // z === enable start (boolean)
                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    },
}