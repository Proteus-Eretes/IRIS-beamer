<template>
    <table class="table">
    <thead>
    <tr>
        <th class="rank fieldname">
            {{field.fieldnameshort}}
        </th>
        <th :class="[column.path]" v-for="column in settings.export_columns" :key="column.id">
            {{column.header}}
        </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="crew in field.crews.teams" :key="crew.id">
        <td>
            {{getCrewRank(crew)}}
        </td>
        <td v-for="column in settings.export_columns" :key="column.id">
            {{getCrewField(crew, column)}}
        </td>
    </tr>
    </tbody>
    </table>
</template>

<script>
    import {Crew} from "../helpers/Crew";

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
        methods: {
            getCrewField(crew, column) {
                return (new Crew(crew)).getCrewField(column);
            },
            getCrewRank(crew) {
                return (new Crew(crew)).getCrewRank();
            }
        }
    }
</script>
