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
