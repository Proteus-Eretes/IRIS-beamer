<template>
    <div id="app">
        <b-img v-if="hasImage" fluid :src="imgUrl"></b-img>
        <beamer-panel v-if="loaded" :settings=settings :regatta=regatta :panels=panels></beamer-panel>
        <footer>
            <div class="container-fluid fixed-bottom text-center text-white bg-dark">
                IRIS - hoesnelwasik.nl
            </div>
        </footer>
    </div>
</template>

<script>
    import {BeamerSettings} from './services/BeamerSettings';
    import BeamerPanel from './components/BeamerPanel.vue';
    import {ParseParams} from "./helpers/ParseParams";

    export default {
        name: 'app',
        components: {
            BeamerPanel
        },
        data() {
            const url = new ParseParams(window.location.href);
            return {
                settings: {},
                regatta: {},
                loaded: false,
                beamerSettings: new BeamerSettings(url.getKey(), url.getUrl(), url.getPreset()),
                panels: url.getPanels(),
            };
        },
        async mounted() {
            this.settings = await this.beamerSettings.getBeamerPreset();
            const css = document.createElement("style");
            css.type = "text/css";
            css.innerHTML = this.settings.css;
            document.body.appendChild(css);
            this.regatta = await this.beamerSettings.getRegattaInformation();
            this.loaded = true;
        },
        computed: {
            hasImage() {
                if (this.settings) {
                    return this.settings['background'] !== '';
                }
                return false;
            },
            imgUrl() {
                const url = new ParseParams(window.location.href);
                return `${url.getUrl()}/files/image/${this.settings['background']}`
            },
        }
    };

</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    body {
        overflow: hidden;
    }
</style>
