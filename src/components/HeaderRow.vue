<template>
    <thead>
    <tr>
        <th class="rank fieldname">
            {{fieldname}}
        </th>
        <th :class="[column.path]" v-for="column in settings.export_columns" :key="column.id">
            {{column.header}}
        </th>
    </tr>
    </thead>
</template>

<script>
    export default {
        name: "header-row",
        props: {
            settings: {
                export_columns: [],
            },
            fieldname: '',
        }
    }
</script>

