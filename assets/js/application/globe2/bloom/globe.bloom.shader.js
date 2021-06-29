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

        void main(){
            float dist = distance(vUv, vec2(0.5)) / 0.5;

            float opacity = dist <= uSize ? 1.0 : (1.0 - dist) * uStrength;

            gl_FragColor = vec4(uColor + uBrightness, opacity);
        }
    `
}