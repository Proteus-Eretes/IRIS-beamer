export class ResultStatus {

    /**
     * @param {int} status
     * @return boolean
     */
    static isValid(status) {
        return status === 0 || status === 16;
    }

    /**
     * @param {int} status
     * @return boolean
     */
    static isExcluded(status) {
        return (status & 1) === 1;
    }

    /**
     * @param {int} status
     * @return boolean
     */
    static isDisqualified(status) {
        return (status & 2) === 2;
    }

    /**
     * @param {int} status
     * @return boolean
     */
    static isOutsideCompetition(status) {
        return (status & 4) === 4;
    }

    /**
     * @param {int} status
     * @return boolean
     */
    static isDidNotStart(status) {
        return (status & 8) === 8;
    }

    /**
     * @param {int} status
     * @return boolean
     */
    static isDidNotFinish(status) {
        return (status & 16) === 16;
    }

    static getLabel(status) {
        if (ResultStatus.isExcluded(status)) {
            return 'Excluded';
        }

        if (ResultStatus.isDisqualified(status)) {
            return 'DQ';
        }

        if (ResultStatus.isDidNotFinish(status)) {
            return 'DNF';
        }

        if (ResultStatus.isDidNotStart(status)) {
            return 'DNS';
        }
    }

}
