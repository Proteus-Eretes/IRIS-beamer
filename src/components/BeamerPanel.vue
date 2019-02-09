<template>
    <div>
        <h1> {{ settings.preset_name }}</h1>
        <block-panel :blocks=blocks :settings=settings> </block-panel>
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
            const url = new ParseParams(window.location.href);
            return {
                blocks: [],
                resultService: new ResultService(url.getKey(), url.getUrl(), this.regatta.id, this.settings.id),
            };
        },
        async mounted() {
            this.blocks = await this.resultService.getData();
            this.refreshData();
        },
        methods: {
            refreshData() {
                setInterval(async () => {
                    this.blocks = await this.resultService.update();
                }, 5000)
            }
        }
    }
</script>

