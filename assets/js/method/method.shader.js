export default {
    executeNormalizing(){
        return `
            float executeNormalizing(float x, float a, float b, float min, float max){
                return (b - a) * (x - min) / (max - min) + a;
            }
        `
    },
    getTheta(){
        return `
            float getTheta(vec2 pos){
                return atan(pos.y, pos.x);
            }
        `
    },
    getSphereCoord(){
        return `
            vec3 getSphereCoord(float p, float t, float radius){
                float phi = p * ${RADIAN};
                float theta = t * ${RADIAN};
                float x = radius * sin(phi) * cos(theta);
                float y = radius * cos(phi);
                float z = radius * sin(phi) * sin(theta);
                return vec3(x, y, z);
            }
        `
    }
}