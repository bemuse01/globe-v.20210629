import PUBLIC_METHOD from '../../../method/method.js'

export default {
    createAttribute({grid, radius, range}){
        const halfRange = range / 2
        const position = []
        const len = grid.length

        for(let i = 0; i < len * 5; i++){
            const {lat, lon} = grid[i % len]

            const r1 = Math.random() * halfRange - halfRange
            const r2 = Math.random() * halfRange - halfRange
            
            const {x, y, z} = PUBLIC_METHOD.getSphereCoord(-lat + r1, lon + r2, radius)
            position.push(x, y, z)
        }
        
        return {position: new Float32Array(position)}
    }
}