<template>
    <div>
        <table v-for="block in blocks" class="b-table">
            <field-panel v-for="field in block" :key="field.id" :field=field :settings=settings>
            </field-panel>
        </table>
    </div>
</template>

<script>
    import FieldPanel from "./FieldPanel";

    export default {
        components: {FieldPanel},
        name: 'block-panel',
        props: {
            settings: {
                export_columns: [],
            },
            blocks : {},
        },
    }
</script>
