<template>
    <tbody>
    <tr v-for="crew in field.crews.teams" :key="crew.id">
        <th v-for="column in settings.export_columns" :key="column.id">
            {{getCrewField(crew, column)}}
        </th>
    </tr>
    </tbody>
</template>

<script>
    import {ResultStatus} from "../helpers/ResultStatus";
    import moment from "moment";

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
                const pathElements = column.path.split('-');
                if (pathElements[0] === 'time') {
                    const round = Math.min(pathElements[1], crew.times.length - 1);
                    if (ResultStatus.isValid(+crew.times[round].status)) {
                        const index = crew.times[round].times.length - 1;
                        const time = crew.times[round].times[index];
                        if (round === +pathElements[1] && pathElements[2] === 'finish') {
                            const momentTime = moment.unix(time.time).utc();
                            if (momentTime.hours()) {
                                return momentTime.format('HH:mm:ss.S');
                            }
                            return momentTime.format('mm:ss.S');
                        } else if (pathElements[2] === 'results') {
                            const momentTime = moment.unix(time.time).utc();
                            if (momentTime.hours()) {
                                return momentTime.format('HH:mm:ss.S');
                            }
                            return momentTime.format('mm:ss.S');
                        }
                        else {
                            return '00:00.0'
                        }
                    } else {
                        return ResultStatus.getLabel(crew.times[round].status);
                    }
                }
                for (let i = 0; i < pathElements.length; i++) {
                    if (crew[pathElements[i]]) {
                        crew = crew[pathElements[i]];
                    } else {
                        return '';
                    }
                }
                return crew;
            }
        }
    }
</script>
