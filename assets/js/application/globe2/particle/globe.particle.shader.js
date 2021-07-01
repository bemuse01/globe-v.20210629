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
                ivec2 coord = ivec2(aCoord);
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
            vec4 vel = texture(velocity, uv);

            vec3 sphereCoord = vec3(0);

            if(vel.x <= 0.0){
                pos.w = uRadius;
                sphereCoord = getSphereCoord(vel.y, vel.z, uRadius);
            }else{
                sphereCoord = getSphereCoord(vel.y, vel.z, pos.w);
            }

            pos.xyz = sphereCoord;
            pos.w += uVelocity;

            gl_FragColor = pos;
        }
    `,
    velocity: `
        uniform float uAcceleration;

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            // vel.x == current life
            vec4 vel = texture(velocity, uv);

            if(vel.x <= 0.0) vel.x = 1.0;
            else vel.x -= vel.w;

            gl_FragColor = vel;
        }
    `
}