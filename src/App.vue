<template>
  <div id="app">
    <beamer-panel :settings=settings />
  </div>
</template>

<script>
  import {BeamerSettings} from './services/BeamerSettings.js';
  import BeamerPanel from './components/BeamerPanel.vue';

  export default {
    name: 'app',
    components: {
      BeamerPanel
    },
    data() {
      return {
        settings: {preset_name: 'aa'}
      };
    },
    async mounted() {
      const beamerSettings = new BeamerSettings('Uitslagen', 'http://localhost:8080');
      this.settings = await beamerSettings.getBeamerPreset()
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
