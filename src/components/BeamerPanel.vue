<template>
    <div>
        <h1> {{ settings.preset_name }}</h1>
        <block-panel :blocks=blocks :settings=settings>
        </block-panel>
    </div>
</template>

<script>
    import {ResultService} from "../services/ResultService";
    import BlockPanel from "./BlockPanel";


    export default {
        components: {BlockPanel},
        name: 'BeamerPanel',
        props: {
            settings: {
                export_columns: [],
            },
            regatta: {},
        },
        data() {
            return {
                blocks: []
            };
        },
        async mounted() {
            const resultService = new ResultService(0, 'http://localhost:8080', this.regatta.id, this.settings.id);
            this.blocks = await resultService.getData();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
