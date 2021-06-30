import PUBLIC_METHOD from '../../../method/method.js'

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

        ${PUBLIC_METHOD.shaderNormalize()}

        float getTheta(vec2 pos){
            return atan(pos.y, pos.x);
        }

        void main(){
            float dist = distance(vUv, vec2(0.5)) / 0.5;
            vec2 pos = vec2(vUv - vec2(0.5));
            float theta = getTheta(pos);

            float depth = shaderNormalize(theta * sign(theta), 0.0, 1.05, 0.0, 180.0 * RADIAN);
            float strength = uStrength - shaderNormalize(theta * sign(theta), 0.0, uStrength, 0.0, 180.0 * RADIAN);

            float opacity = dist <= uSize ? 0.0 : (1.0 - dist) * strength;

            gl_FragColor = vec4(uColor + uBrightness, opacity);
        }
    `
}