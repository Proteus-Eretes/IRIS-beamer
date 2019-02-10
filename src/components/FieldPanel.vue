<template>
    <tbody>
    <tr v-for="crew in field.crews.teams" :key="crew.id" :class=getWinnerClass(crew)>
        <td class="rank">
            {{getCrewRank(crew)}}
        </td>
        <td :class="[column.path]" v-for="column in settings.export_columns" :key="column.id">
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
            getWinnerClass(crew) {
                if (crew.times[crew.times.length - 1].rank === 1) {
                    return 'winner';
                }
                if (crew.times[crew.times.length - 1].subrank === 1) {
                    return 'sub-winner';
                }
            }
        }
    }
</script>
<style>
    .winner {
       font-weight: bolder;
    }
    .sub-winner {
        font-weight: bold;
    }
</style>
