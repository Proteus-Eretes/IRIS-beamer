<template>
    <div>
        <tr v-for="crew in field.crews.teams" :key="crew.id">
            <th v-for="column in settings.export_columns" :key="column.id">
                {{ column.header }} {{ crew.clubname }}
            </th>
        </tr>
    </div>
</template>

<script>
    export default {
        name: 'field-panel',
        props: {
            settings: {
                export_columns: [],
            },
            field: {
                crews: {
                    teams: []
                }
            }
        },
    }
</script>
