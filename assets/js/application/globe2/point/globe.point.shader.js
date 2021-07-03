export default {
    draw: {
        vertex: `
            uniform float uSize;
            // uniform sampler2D uPosition;
            // uniform sampler2D uVelocity;
            
            // attribute vec2 aCoord;
            
            // varying float vOpacity;

            void main(){
                // ivec2 coord = ivec2(aCoord);
                // vec3 nPosition = position; 

                // vec4 pos = texelFetch(uPosition, coord, 0);
                // vec4 vel = texelFetch(uVelocity, coord, 0);

                gl_PointSize = uSize;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            uniform vec3 uColor;

            void main(){
                gl_FragColor = vec4(uColor, 1.0);
            }
        `
    }
}