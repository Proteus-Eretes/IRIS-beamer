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
    import {ParseParams} from "../helpers/ParseParams";


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
            const url = new ParseParams(window.location.href);
            const resultService = new ResultService(url.getKey(), url.getUrl(), this.regatta.id, this.settings.id);
            this.blocks = await resultService.getData();
        }
    }
</script>

