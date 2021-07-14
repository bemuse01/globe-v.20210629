export default {
    createParticleData({count, velocity}){
        return Array.from({length: count}, () => ({
            position: {
                phi: Math.random() * 180,
                theta: Math.random() * 360                
            },
            velocity: {
                phi: this.getRandomVelocity(velocity),
                theta: this.getRandomVelocity(velocity)
            },
            connections: 0
        }))
    },
    getRandomVelocity(velocity){
        return Math.random() > 0.5 ? Math.random() * -velocity - velocity : Math.random() * velocity + velocity
    }
}