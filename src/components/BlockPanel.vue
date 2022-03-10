<template>
    <div>
        <progress-bar ref="topProgress" :fn=refreshData></progress-bar>
        <table v-if="panelType==='last'" class="table">
            <thead>
            <tr class="header-row">
                <th colspan="5">Laatst gefinishte ploegen</th>
            </tr>
            <tr>
                <th style="max-width: 50px">Pos</th>
                <th>Veld</th>
                <th>Rug#</th>
                <th>Ploeg</th>
                <th>Finishtijd</th>
            </tr>
            </thead>
            <tr v-for="row in fields" :key="row.raceid">
                <td>{{ row.rank }} / {{ row.participants }}</td>
                <td>
                    <template v-if="row.fieldnameshortsub !== '0'">
                        {{ row.fieldnameshortsub }}
                    </template>
                    <template v-if="row.fieldnameshortsub === '0'">
                        {{ row.fieldnameshort }}
                    </template>
                </td>
                <td>{{ row.backnumber }}</td>
                <td class="team"> {{ row.teamname }}</td>
                <td>
                    {{ getTime(row) }}
                    <small v-if="row.bonussecond > 0">
                        (+{{ row.bonussecond }})
                    </small>
                </td>
            </tr>
        </table>
        <table v-else class="table">
            <thead>
            <tr class="header-row">
                <th :colspan=colspan>{{ displayTitle }}</th>
            </tr>
            </thead>
            <template v-for="block in fields">
                <template v-for="field in block" :field=field :settings=settings>
                    <header-row :fieldname=field.fieldnameshort :settings=settings :title=panelType>
                    </header-row>
                    <field-panel :key="field.id" :field=field :settings=settings>
                    </field-panel>
                </template>
            </template>
        </table>
    </div>
</template>

<script>
import moment from 'moment';
import FieldPanel from './FieldPanel';
import HeaderRow from './HeaderRow';
import { ResultService } from '../services/ResultService';
import { ParseParams } from '../helpers/ParseParams';
import ProgressBar from './ProgressBar.vue';
import { ResultStatus } from '../helpers/ResultStatus';
import { Crew } from '../helpers/Crew';

export default {
  components: {
    ProgressBar,
    HeaderRow,
    FieldPanel,
  },
  name: 'block-panel',
  props: {
    settings: {
      export_columns: [],
    },
    regatta: {},
    panelType: String,
  },
  data() {
    const url = new ParseParams(window.location.href);
    return {
      fields: {},
      resultService: new ResultService(
        url.getKey(),
        url.getUrl(),
        this.regatta.id,
        this.settings.id,
        this.panelType,
      ),
    };
  },
  methods: {
    async refreshData() {
      if (this.panelType !== 'last') {
        try {
          const blocks = await this.resultService.update();
          this.updateFields(blocks);
        } catch (e) {
          console.log(e);
          this.updateFields(this.resultService.getLastRegattaData());
          return false;
        }
      } else {
        try {
          this.fields = await this.resultService.getUpdatedLastResults();
        } catch (e) {
          this.fields = this.resultService.getLastResults();
          return false;
        }
      }
      return true;
    },
    updateFields(blocks) {
      if (this.panelType === 'all') {
        this.fields = this.resultService.getNextPage(blocks, this._rows());
      } else if (this.panelType === 'block') {
        const lastBlock = blocks.reduce((block, testBlock) => {
          const startMoment = moment(`${testBlock[0].daydate} ${testBlock[0].starttime}`)
            .unix();
          const currentMoment = moment()
            .unix();
          const startMomentBlock = moment(`${block[0].daydate} ${block[0].starttime}`)
            .unix();
          if (currentMoment - startMoment > 0) { // testBlock has begun
            if (currentMoment - startMomentBlock > 0) { // Block has begun
              if (startMomentBlock - startMoment > 0) {
                return block;
              }
              return testBlock;
            }
            return testBlock;
          }
          return block;
        });
        this.fields = this.resultService.getNextPage([lastBlock], this._rows());
      } else if (this.panelType === 'day') {
        const lastBlocks = blocks
          .filter(block => (moment(block[0].daydate)
            .isSame(moment(), 'd')));
        this.fields = this.resultService.getNextPage(lastBlocks, this._rows());
      }
    },
    getTime(crew) {
      if (ResultStatus.isValid(+crew.status)) {
        return Crew.formatTime(crew.totaltime + crew.bonussecond);
      }
      return ResultStatus.getLabel(+crew.status);
    },
    _rows() {
      const height = (window.innerHeight - document.getElementsByClassName('beamer-title')[0].offsetHeight - document.getElementsByTagName('footer')[0].offsetHeight);
      return Math.floor(height / 51) - 1;
    },
  },
  async mounted() {
    const blocks = await this.resultService.update();
    this.updateFields(blocks);
    this.$refs.topProgress.start();
  },
  computed: {
    colspan() {
      return 1 + this.settings.export_columns.length;
    },
    displayTitle() {
      switch (this.panelType) {
        case 'all':
          return 'Volledige wedstrijd';
        case 'block':
          return 'Huidig block';
        case 'day':
          return 'Huidig dag';
      }
    },
  },
};
</script>
