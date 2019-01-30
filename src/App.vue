<template>
  <div id="app">
    <BeamerPanel :settings={settings} />
  </div>
</template>

<script>
import BeamerPanel from './components/BeamerPanel.vue'
import {BeamerSettings} from './services/BeamerSettings.js';

const beamerSettings = new BeamerSettings('test', 'http://localhost:8080');

const settings = beamerSettings.getBeamerPreset();

export default {
  name: 'app',
  components: {
      BeamerPanel
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
