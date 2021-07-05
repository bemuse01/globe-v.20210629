export default {
    draw: {
        vertex: `
            varying vec2 vUv;

            void main(){
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

                vUv = uv;
            }
        `,
        fragment: `
            uniform vec3 uColor;
            uniform sampler2D uDelay;

            varying vec2 vUv;

            void main(){
                vec4 delay = texture(uDelay, vUv);
                
                gl_FragColor = vec4(uColor, delay.x);
            }
        `
    },
    delay: `
        uniform float uCurrentTime;
        uniform float uOpacityMin;
        uniform float uOpacityMax;

        void main(){
            ivec2 coord = ivec2(gl_FragCoord.xy);

            // delay.x == opacity
            // delay.y == opacity velocity
            vec4 delay = texelFetch(tDelay, coord, 0);

            // time.x == each texel start time
            // time.y == update old time to start again
            // time.z == enable start (1: start, 0: stop)
            vec4 time = texelFetch(tTime, coord, 0);
            
            if(time.x < uCurrentTime - time.y && time.z == 1.0) delay.x = uOpacityMax;

            delay.x = clamp(delay.x - delay.y, uOpacityMin, uOpacityMax);

            gl_FragColor = delay;
        }
    `,
    time: `
        uniform int uR1;
        uniform float uR2;
        uniform float uOldTime;
        uniform float uCurrentTime;

        void main(){
            ivec2 coord = ivec2(gl_FragCoord.xy);

            // time.x == each texel start time
            // time.y == update old time to start again
            // time.z == enable start (1: start, 0: stop)
            vec4 time = texelFetch(tTime, coord, 0);

            if(uR1 == coord.x && uR2 > 0.8){
                time.y = uOldTime;
                time.z = 1.0;
            }

            if(time.x < uCurrentTime - time.y && time.z == 1.0) time.z = 0.0;

            gl_FragColor = time;
        }
    `
}