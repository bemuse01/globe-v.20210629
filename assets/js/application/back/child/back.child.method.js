export default {
    fillDelayTexture(texture){
        const {data, width, height} = texture.image

        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                // x === opacity
                data[index] = 0.0

                // y === opacity velocity
                data[index + 1] = 0.006
                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    },
    fillTimeTexture(texture, size){
        const {data, width, height} = texture.image
        
        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                // x === each texel start time
                data[index] = height * 2 - i * 2

                // y === update old time to start again
                data[index + 1] = 0

                // z === enable start (boolean)
                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    }
}