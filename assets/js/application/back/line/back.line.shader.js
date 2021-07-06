import SHADER_METHOD from '../../../method/method.shader.js'

export default {
    vertex: `
        varying vec3 vPosition;

        void main(){
            vPosition = position;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragment: `
        uniform vec3 uColor;
        uniform vec3 uOrigin;
        uniform float uMaxDist;
        
        varying vec3 vPosition;

        ${SHADER_METHOD.executeNormalizing()}

        void main(){
            float dist = executeNormalizing(distance(vPosition, uOrigin), 0.0, 1.0, 0.0, uMaxDist);

            gl_FragColor = vec4(uColor, dist);
        }
    `
}