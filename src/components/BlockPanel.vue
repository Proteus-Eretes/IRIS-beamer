<template>
    <div class="table-responsive">
        <div v-for="block in blocks">
            <field-panel v-for="field in block" :key="field.id" :field=field :settings=settings>
            </field-panel>
        </div>
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
