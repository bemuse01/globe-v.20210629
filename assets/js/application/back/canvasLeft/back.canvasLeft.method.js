export default {
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
    createTextureFromCanvas({w, h, fontSize, text, gap, color, font}){
        const ctx = document.createElement('canvas').getContext('2d')
        ctx.canvas.width = w
        ctx.canvas.height = h

        const width = Math.ceil(w / fontSize)
        const height = Math.ceil(h / fontSize)

        ctx.fillStyle = `rgba(${color}, 1.0)`
        ctx.font = `${fontSize}px ${font}`

        for(let i = 0; i < height; i++){
            for(let j = 0; j < width; j++){
                const letter = text[~~(Math.random() * text.length)]

                const x = j * fontSize + gap / 2 * j
                const y = i * fontSize + gap * i

                ctx.fillText(letter, x, y)
            }
        }

        return ctx.canvas
    }
}