export default {
    createRadius({count, radius, rd}){
        const min = radius * rd.min
        const max = radius * rd.max
        return Array.from({length: count}, () => Math.random() * max + min)
    },
    createDegree({count, vel}){
        return Array.from({length: count}, () => ({
            phi: Math.random() * 180, 
            theta: Math.random() * 360, 
            vel: Math.random() * (vel / 2) - (vel / 2)
        }))
    }
}