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
    }
}