export default {
    vertex: `
        varying vec2 vUv;

        void main(){
            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragment: `
        uniform vec3 uColor;
        
        varying vec2 vUv;

        void main(){
            float dist = distance(vUv, vec2(0.0));

            gl_FragColor = vec4(uColor, dist);
        }
    `
}