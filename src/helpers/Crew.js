import moment from "moment";
import {ResultStatus} from "./ResultStatus";


export class Crew {

    /**
     * @param {object} crew
     * @param {string} column
     * @return {string}
     */
    static getCrewField(crew, column) {
        const pathElements = column.path.split('-');
        if (pathElements[0] === 'time') {
            const round = Math.min(pathElements[1], crew.times.length - 1);
            if (ResultStatus.isValid(+crew.times[round].status)) {
                const index = crew.times[round].times.length - 1;
                const time = crew.times[round].times[index];
                if (round === +pathElements[1] && pathElements[2] === 'finish') {
                    return Crew.formatTime(time.time + crew.times[round].bonussecond);
                } else if (pathElements[2] === 'results') {
                    return Crew.formatTime(time.time);
                } else {
                    return '00:00.0';
                }
            } else {
                return ResultStatus.getLabel(crew.times[round].status);
            }
        }
        let element = crew;
        for (let i = 0; i < pathElements.length; i++) {
            if (element[pathElements[i]] !== undefined) {
                element = element[pathElements[i]];
            } else {
                return '';
            }
        }
        if (pathElements[0] === 'times' && pathElements[2].includes('splash')) {
            return Crew.formatTime(element);
        }
        return element;
    };

    /**
     * Get the current rank of the crew
     * @param {object} crew
     * @return {int}
     */
    static getCrewRank(crew) {
        return crew.times[crew.times.length - 1].rank;
    };

    /**
     * formatTime a of format [h:]mm:ss.n
     * @param {float} time
     */
    static formatTime(time) {
        const momentTime = moment.unix(Math.round(time * 10) / 10).utc();
        if (momentTime.hours()) {
            return momentTime.format('HH:mm:ss.S');
        }
        return momentTime.format('mm:ss.S');
    };
}
