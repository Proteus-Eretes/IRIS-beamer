<template>
    <div>
        <h1> {{ settings.preset_name }}</h1>
        <block-panel :settings=settings :regatta="regatta"> </block-panel>
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
        },
    }
</script>

