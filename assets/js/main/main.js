import APP from '../application/app/app.build.js'
import GLOBE from '../application/globe/globe.build.js'
import GLOBE2 from '../application/globe2/globe.build.js'
import BACK from '../application/back/back.build.js'

new Vue({
    el: '#wrap',
    data(){
        return{
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.initThree()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
            document.addEventListener('mousemove', this.onMouseMove, false)
        },


        // three
        initThree(){
            OBJECT.app = new APP()

            this.createObject(OBJECT.app)
        },
        resizeThree(){
            const {app} = OBJECT

            for(let i in OBJECT){
                if(!OBJECT[i].resize) continue
                OBJECT[i].resize({app})
            }
        },
        renderThree(){
            const {app} = OBJECT
            
            for(let i in OBJECT){
                if(!OBJECT[i].animate) continue
                OBJECT[i].animate({app})
            }
        },
        createObject(app){
            // this.createGlobe()
            this.createGlobe2(app)
            this.createBack(app)
        },
        createGlobe(){
            OBJECT.globe = new GLOBE()
        },
        createGlobe2(app){
            OBJECT.globe2 = new GLOBE2(app)
        },
        createBack(app){
            OBJECT.back = new BACK(app)
        },


        // event
        onWindowResize(){
            this.resizeThree()
        },
        onMouseMove(e){
            const {app} = OBJECT
            const {width, height} = app
            const {clientX, clientY} = e

            for(let i in OBJECT){
                if(!OBJECT[i].mouseMove) continue
                OBJECT[i].mouseMove({clientX, clientY, width, height})
            }
        },


        // render
        render(){
            this.renderThree()
        },
        animate(){
            this.render()
            requestAnimationFrame(this.animate)
        }
    }
})