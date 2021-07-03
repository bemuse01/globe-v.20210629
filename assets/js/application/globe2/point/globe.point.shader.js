import SHADER_METHOD from '../../../method/method.shader.js'

export default {
    draw: {
        vertex: `
            uniform float uSize;
            uniform sampler2D uPosition;
            
            attribute vec2 aCoord;
            
            varying vec3 vPosition;

            void main(){
                ivec2 coord = ivec2(aCoord);
                vec3 nPosition = position; 

                vec4 pos = texelFetch(uPosition, coord, 0);

                nPosition.xyz = pos.xyz;
                vPosition = nPosition;

                gl_PointSize = uSize;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(nPosition, 1.0);
            }
        `,
        fragment: `
            uniform vec3 uColor;
            uniform float uMaxDist;

            varying vec3 vPosition;

            void main(){
                float dist = distance(vPosition, vec3(vPosition.xy, 0.0)) / uMaxDist;

                gl_FragColor = vec4(uColor, 1.0 - dist * 0.9);
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