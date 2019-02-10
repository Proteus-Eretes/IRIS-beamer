<template>
    <div>
        <h1> {{ settings.preset_name }}</h1>
        <div class="row">
            <block-panel v-for="panel in panels" :class=panelWidth :settings=settings :regatta="regatta" :panel-type=panel :key=panel> </block-panel>
        </div>
    </div>
</template>

<script>
    import BlockPanel from "./BlockPanel";

    export default {
        components: {BlockPanel},
        name: 'BeamerPanel',
        props: {
            settings: {
                export_columns: [],
            },
            regatta: {},
            panels: Array,
        },
        computed: {
            panelWidth() {
                return 'col-' + (12 / this.panels.length);
            }
        }
    }
</script>

