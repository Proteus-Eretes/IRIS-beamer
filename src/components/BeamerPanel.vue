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
            const resultService = new ResultService('app', 'http://localhost:8080', this.regatta.id, this.settings.id);
            this.blocks = await resultService.getData();
        }
    }
</script>

