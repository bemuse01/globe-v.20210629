import SHADER_METHOD from '../../../method/method.shader.js'

export default {
    draw: {
        vertex: `
            uniform float uSize;
            uniform sampler2D uPosition;
            uniform sampler2D uVelocity;
            
            attribute vec2 aCoord;
            
            varying float vOpacity;

            void main(){
                vec3 nPosition = position; 

                vec4 pos = texelFetch(uPosition, coord, 0);
                vec4 vel = texelFetch(uVelocity, coord, 0);

                nPosition.xyz = pos.xyz;
                vOpacity = vel.x;

                gl_PointSize = uSize;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(nPosition, 1.0);
            }
        `,
        fragment: `
            uniform vec3 uColor;

            varying float vOpacity;

            void main(){
                gl_FragColor = vec4(uColor, vOpacity);
            }
        `
    },
    position: `
        uniform float uRadius;
        uniform float uVelocity;

        ${SHADER_METHOD.getSphereCoord()}

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            // ivec2 coord = ivec2(gl_FragCoord.xy);

            // pos.x == position x
            // pos.y == position y
            // pos.z == position z
            // pos.w == current radius
            vec4 pos = texture(position, uv);

            // vel.y == latitude
            // vel.z == longitude
            vec2 vel = texture(velocity, uv);

            pos.w += uVelocity;

            vec3 sphereCoord = getSphereCoord(vel.y, vel.z, pos.w);

            pos.xyz = sphereCoord;

            gl_FragColor = pos;
        }
    `,
    velocity: `
        uniform float uAcceleration;
        uniform float uLifeVelocity;

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            // vel.x == current life
            vec4 vel = texture(velocity, uv);

            if(vel.x <= 0.0) vel.x = 1.0;
            else vel.x -= uLifeVelocity;

            gl_FragColor = vel;
        }
    `
}