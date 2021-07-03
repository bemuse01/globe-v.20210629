import SHADER_METHOD from '../../../method/method.shader.js'

export default {
    draw: {
        vertex: `
            uniform float uSize;
            uniform sampler2D uPosition;
            // uniform sampler2D uVelocity;
            
            attribute vec2 aCoord;
            
            // varying float vOpacity;

            void main(){
                ivec2 coord = ivec2(aCoord);
                vec3 nPosition = position; 

                vec4 pos = texelFetch(uPosition, coord, 0);
                // vec4 vel = texelFetch(uVelocity, coord, 0);

                nPosition.xyz = pos.xyz;

                gl_PointSize = uSize;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(nPosition, 1.0);
            }
        `,
        fragment: `
            uniform vec3 uColor;

            void main(){
                gl_FragColor = vec4(uColor, 1.0);
            }
        `
    },
    position: `
        uniform float uRadius;
        uniform float uVelocity;

        ${SHADER_METHOD.getSphereCoord()}

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            // pos.x == position x
            // pos.y == position y
            // pos.z == position z
            vec4 pos = texture(tPosition, uv);

            // vel.x == latitude
            // vel.y == longitude
            vec4 vel = texture(tVelocity, uv);

            vec3 sphereCoord = getSphereCoord(vel.x, vel.y, uRadius);

            pos.xyz = sphereCoord;

            gl_FragColor = pos;
        }
    `,
    velocity: `
        uniform float uAcceleration;
        uniform float uLatVelocity;

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            // vel.x == latitude
            // vel.y == longitude
            vec4 vel = texture(tVelocity, uv);

            vel.y = mod((vel.y + uLatVelocity), 360.0);

            gl_FragColor = vel;
        }
    `
}