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
            uniform sampler2D uDelay;
            uniform sampler2D uTexture;

            varying vec2 vUv;

            void main(){
                vec4 delay = texture(uDelay, vUv);
                vec4 tex = texture(uTexture, vUv);
                float opacity = tex.x != 0.0 ? delay.x : 0.0;
                
                gl_FragColor = vec4(tex.xyz, opacity);
                // gl_FragColor = vec4(tex.xyz, 1.0);
            }
        `
    },
    delay: `
        uniform float uCurrentTime;
        uniform float uOpacityMin;
        uniform float uOpacityMax;
        uniform float uMaxWidth;
        uniform float uStrength;

        void main(){
            ivec2 coord = ivec2(gl_FragCoord.xy);

            // delay.x == opacity
            // delay.y == opacity velocity
            vec4 delay = texelFetch(tDelay, coord, 0);

            // time.x == each texel start time
            // time.y == update old time to start again
            // time.z == enable start (1: start, 0: stop)
            vec4 time = texelFetch(tTime, coord, 0);
            
            if(time.x < uCurrentTime - time.y && time.z == 1.0){
                delay.x = uOpacityMax * (1.0 - float(coord.x) / uMaxWidth) * uStrength;
            }

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