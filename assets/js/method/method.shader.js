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
            vec3 getSphereCoord(float lat, float lon, float radius){
                float phi = (90.0 - lat) * ${RADIAN};
                float theta = (180.0 - lon) * ${RADIAN};
                float x = radius * sin(phi) * cos(theta);
                float y = radius * cos(phi);
                float z = radius * sin(phi) * sin(theta);
                return vec3(x, y, z);
            }
        `
    }
}