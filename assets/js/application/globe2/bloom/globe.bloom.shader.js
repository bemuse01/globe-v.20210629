import SHADER_METHOD from '../../../method/method.shader.js'

export default {
    vertex: `
        varying vec2 vUv;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vUv = uv;
        }
    `,
    fragment: `
        uniform vec3 uColor;
        uniform float uSize;
        uniform float uStrength;
        uniform float uBrightness;

        varying vec2 vUv;

        const float RADIAN = ${RADIAN};

        ${SHADER_METHOD.executeNormalizing()}
        ${SHADER_METHOD.getTheta()}

        void main(){
            float dist = distance(vUv, vec2(0.5)) / 0.5;
            vec2 pos = vec2(vUv - vec2(0.5));
            float theta = getTheta(pos);

            // float depth = executeNormalizing(theta * sign(theta), 1.005, 0.97, 0.0, 180.0 * RADIAN);
            float depth = executeNormalizing(theta < 0.0 ? theta : -theta, 0.97, 1.005, -180.0 * RADIAN, 0.0);
            float strength = uStrength - executeNormalizing(theta * sign(theta), 0.0, uStrength, 0.0, 180.0 * RADIAN);

            float opacity = dist <= uSize ? 0.0 : (1.0 * depth - dist) * strength;

            gl_FragColor = vec4(uColor + uBrightness, opacity);
        }
    `
}