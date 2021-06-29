import PUBLIC_METHOD from '../../../method/method.js'

export default {
    createAttribute({grid, radius}){
        const position = []

        for(let i = 0; i < grid.length; i++){
            const {lat, lon} = grid[i]
            const {x, y, z} = PUBLIC_METHOD.getSphereCoord(-lat, lon, radius)
            position.push(x, y, z)
        }
        
        return {position: new Float32Array(position)}
    }
}