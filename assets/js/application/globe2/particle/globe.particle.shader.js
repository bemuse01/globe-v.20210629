import SHADER_METHOD from '../../../method/method.shader.js'

export default {
    draw: {
        vertex: `
            uniform float uSize;
            uniform sampler2D uPosition;
            uniform sampler2D uVelocity;
            
            attribute vec2 aCoord;
            
            varying float vOpacity;
            varying vec3 vPosition;

            void main(){
                ivec2 coord = ivec2(aCoord);
                vec3 nPosition = position; 

                vec4 pos = texelFetch(uPosition, coord, 0);
                vec4 vel = texelFetch(uVelocity, coord, 0);

                nPosition.xyz = pos.xyz;
                vOpacity = vel.x;
                vPosition = nPosition;

                gl_PointSize = uSize;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(nPosition, 1.0);
            }
        `,
        fragment: `
            uniform vec3 uColor;
            uniform float uMaxDist;
            uniform float uReduce;

            varying float vOpacity;
            varying vec3 vPosition;

            void main(){
                float dist = distance(vPosition, vec3(vPosition.xy, 0.0)) / uMaxDist;

                gl_FragColor = vec4(uColor, vOpacity * (1.0 - dist * uReduce));
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
            vec4 pos = texture(tPosition, uv);

            // vel.y == latitude
            // vel.z == longitude
            vec4 vel = texture(tVelocity, uv);

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
        uniform float uLatVelocity;
        uniform float uTime;
        uniform sampler2D uSphereCoord;

        out vec4 outColor;

        ${SHADER_METHOD.rand()}

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            // vel.x == current life
            // vel.y == current latitude
            // vel.z == current longitude
            // vel.w == life velocity
            vec4 vel = texture(tVelocity, uv);
            
            // usc == origin latitude
            float usc = float(texture(uSphereCoord, uv));

            vel.z = mod((vel.z + uLatVelocity), 360.0);

            if(vel.x <= 0.0) {
                vel.x = 1.0;
                vel.y = usc + (rand(uv * uTime) * 2.0 - 1.0);
            }
            else vel.x -= vel.w;

            outColor = vel;
        }
    `
}