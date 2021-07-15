export default {
    line: {
        vertex: `
            attribute float aOpacity;
            varying float vOpacity;

            void main(){
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vOpacity = aOpacity;
            }
        `,
        fragment: `
            uniform vec3 uColor;
            varying float vOpacity;

            void main(){
                gl_FragColor = vec4(uColor, vOpacity);
            }
        `
    }
}