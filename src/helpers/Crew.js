import moment from "moment";
import {ResultStatus} from "./ResultStatus";


export class Crew {

    constructor(crew) {
        this.crew = crew;
    }

    /**
     * @param {string} column
     * @return {string}
     */
    getCrewField(column) {
        const pathElements = column.path.split('-');
        if (pathElements[0] === 'time') {
            const round = Math.min(pathElements[1], this.crew.times.length - 1);
            if (ResultStatus.isValid(+this.crew.times[round].status)) {
                const index = this.crew.times[round].times.length - 1;
                const time = this.crew.times[round].times[index];
                if (round === +pathElements[1] && pathElements[2] === 'finish') {
                    return this._formatTime(time.time + this.crew.times[round].bonussecond);
                } else if (pathElements[2] === 'results') {
                    return this._formatTime(time.time);
                }
                else {
                    return '00:00.0';
                }
            } else {
                return ResultStatus.getLabel(this.crew.times[round].status);
            }
        }
        let element = this.crew;
        for (let i = 0; i < pathElements.length; i++) {
            if (element[pathElements[i]]) {
                element = element[pathElements[i]];
            } else {
                return '';
            }
        }
        return element;
    };

    /**
     * Get the current rank of the crew
     * @return {int}
     */
    getCrewRank() {
        return this.crew.times[this.crew.times.length - 1].rank;
    };

    /**
     * formatTime a of format [h:]mm:ss.n
     * @param {string} time
     */
    _formatTime(time) {
        const momentTime = moment.unix(time).utc();
        if (momentTime.hours()) {
            return momentTime.format('HH:mm:ss.S');
        }
        return momentTime.format('mm:ss.S');
    };
}
