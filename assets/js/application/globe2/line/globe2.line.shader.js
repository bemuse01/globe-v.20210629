import SHADER_METHOD from '../../../method/method.shader.js'

export default {
    draw: {
        vertex: `
            varying vec3 vPosition;

            void main(){
                vPosition = position;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            uniform vec3 uColor;
            // uniform sampler2D uDelay;
            // uniform int uIndex;

            varying vec3 vPosition;

            ${SHADER_METHOD.executeNormalizing()}

            void main(){
                // float dist = length(vPosition) / length(uOrigin);
                // float opacity = executeNormalizing(dist, 0.0, 1.0, 1.0, length(uLimit) / length(uOrigin));
                // vec4 delay = texelFetch(uDelay, ivec2(0, uIndex), 0);

                // gl_FragColor = vec4(uColor, delay.x);
                gl_FragColor = vec4(uColor, 1.0);
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
        uniform int uRand;
        uniform float uOldTime;
        uniform float uCurrentTime;

        void main(){
            ivec2 coord = ivec2(gl_FragCoord.xy);

            // time.x == each texel start time
            // time.y == update old time to start again
            // time.z == enable start (1: start, 0: stop)
            vec4 time = texelFetch(tTime, coord, 0);

            if(uRand == coord.y){
                time.y = uOldTime;
                time.z = 1.0;
            }

            if(time.x < uCurrentTime - time.y && time.z == 1.0) time.z = 0.0;

            gl_FragColor = time;
        }
    `
}