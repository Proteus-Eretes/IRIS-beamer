<template>
    <div id="app">
        <beamer-panel v-if="loaded" :settings=settings :regatta=regatta />
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

</style>
