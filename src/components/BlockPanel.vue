<template>
    <div>
        <progress-bar ref="topProgress" :fn=refreshData ></progress-bar>
        <table class="table">
            <template v-for="block in fields">
                <template v-for="field in block" :field=field :settings=settings>
                    <header-row :fieldname=field.fieldnameshort :settings=settings>
                    </header-row>
                    <field-panel :key="field.id" :field=field :settings=settings>
                    </field-panel>
                </template>
            </template>
        </table>
    </div>
</template>

<script>
    import FieldPanel from "./FieldPanel";
    import HeaderRow from "./HeaderRow";
    import {ResultService} from "../services/ResultService";
    import {ParseParams} from "../helpers/ParseParams";
    import ProgressBar from "./ProgressBar";
    import moment from "moment";

    export default {
        components: {
            ProgressBar,
            HeaderRow,
            FieldPanel
        },
        name: 'block-panel',
        props: {
            settings: {
                export_columns: [],
            },
            regatta: {},
            panelType: String
        },
        data() {
            const url = new ParseParams(window.location.href);
            return {
                fields: {},
                resultService: new ResultService(url.getKey(), url.getUrl(), this.regatta.id, this.settings.id),
            }
        },
        methods: {
            async refreshData() {
                let blocks = await this.resultService.update();
                this.updateFields(blocks);
            },
            updateFields(blocks) {
                if (this.panelType === 'all') {
                    this.fields = this.resultService.getNextPage(blocks);
                } else if (this.panelType === 'block') {
                    const lastBlock = blocks.reduce((block, testBlock) => {
                        if (moment().diff(testBlock[0].daydate + ' ' + testBlock[0].starttime) < 0) {
                            if (moment().diff(block.daydate + ' ' + block.endtime) > 0) {
                                return block;
                            } else {
                                return testBlock;
                            }
                        }
                        return block;
                    });
                    this.fields =  this.resultService.getNextPage([lastBlock]);
                } else if (this.panelType === 'day') {
                    const lastBlocks = blocks.filter((block) => {
                        return (moment(block[0].daydate).isSame(moment(), 'd'));
                    });
                    this.fields =  this.resultService.getNextPage(lastBlocks);
                }
            }
        },
        async mounted() {
            let blocks = await this.resultService.update();
            this.updateFields(blocks);
            this.$refs.topProgress.start();
        },
    }
</script>
