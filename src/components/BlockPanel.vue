<template>
    <table class="table">
        <template v-for="block in blocks">
            <template v-for="field in block" :field=field :settings=settings>
                <header-row :fieldname=field.fieldnameshort :settings=settings>
                </header-row>
                <field-panel :key="field.id" :field=field :settings=settings>
                </field-panel>
            </template>

        </template>
    </table>
</template>

<script>
    import FieldPanel from "./FieldPanel";
    import HeaderRow from "./HeaderRow";

    export default {
        components: {
            HeaderRow,
            FieldPanel},
        name: 'block-panel',
        props: {
            settings: {
                export_columns: [],
            },
            blocks : {},
        },
    }
</script>
