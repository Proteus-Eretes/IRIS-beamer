<template>
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
</template>

<script>
    import {Crew} from "../helpers/Crew";
    import HeaderRow from "./HeaderRow";

    export default {
        components: {HeaderRow},
        name: 'field-panel',
        props: {
            settings: {
                export_columns: [],
            },
            field: {
                crews: {
                    teams: []
                }
            },
            rowsAllowed: 0,
        },
        methods: {
            getCrewField(crew, column) {
                return Crew.getCrewField(crew, column);
            },
            getCrewRank(crew) {
                return Crew.getCrewRank(crew);
            },
        }
    }
</script>
