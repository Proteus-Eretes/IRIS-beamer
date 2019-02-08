<template>
    <div id="app">
        <beamer-panel v-if="loaded" :settings=settings :regatta=regatta />
    </div>
</template>

<script>
    import {BeamerSettings} from './services/BeamerSettings';
    import BeamerPanel from './components/BeamerPanel.vue';

    export default {
        name: 'app',
        components: {
            BeamerPanel
        },
        data() {
            return {
                settings: {},
                regatta: {},
                loaded: false,
            };
        },
        async mounted() {
            const beamerSettings = new BeamerSettings('app', 'http://localhost:8080', 'Uitslagen');
            this.settings = await beamerSettings.getBeamerPreset();
            const css = document.createElement("style");
            css.type = "text/css";
            css.innerHTML = this.settings.css;
            document.body.appendChild(css);
            this.regatta = await beamerSettings.getRegattaInformation();
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
