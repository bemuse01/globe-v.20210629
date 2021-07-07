export default {
    createRadius({count, radius, dist}){
        return Array.from({length: count}, () => Math.random() * radius / 2 + radius / 2)
    },
    createDegree({count, vel}){
        return Array.from({length: count}, () => ({
            phi: Math.random() * 180, 
            theta: Math.random() * 360, 
            vel: Math.random() * (vel / 2) - (vel / 2)
        }))
    }
}