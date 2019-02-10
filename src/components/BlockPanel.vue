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
        },
        data() {
            const url = new ParseParams(window.location.href);
            return {
                fields: {},
                beginCount: 0,
                endCount: 0,
                resultService: new ResultService(url.getKey(), url.getUrl(), this.regatta.id, this.settings.id),
            }
        },
        methods: {
            async refreshData() {
                let blocks = await this.resultService.update();
                this.updateFields(blocks);
            },
            updateFields(blocks) {
                this.beginCount = this.endCount;
                this.endCount += 20;
                this.fields = [];
                let count = 0;
                blocks = blocks.map(block => {
                    block = block.map((field) => {
                        field.crewCount = field.crews.teams.length;
                        return field;
                    });
                    block.crewCount = block.reduce((sum, field) => {
                        return sum + field.crewCount;
                    }, 0);
                    return block;
                });
                blocks.forEach((block) => {
                    if (count + block.crewCount > this.beginCount && count < this.endCount) {
                        this.fields.push(block);
                        this.fields[this.fields.length - 1].forEach(field => {

                            console.log(`Count: ${count} begin: ${this.beginCount} end: ${this.endCount}: crew ${field.crewCount}`);
                            if (count > this.endCount) {
                                field.crews.teams.length = 0;
                            }
                            if (count < this.beginCount) {
                                if (count + field.crewCount > this.beginCount) {
                                    field.crews.teams.splice(0, this.beginCount - count - 1);
                                } else {
                                    field.crews.teams.length = 0;
                                }

                            }
                            if (count + field.crews.teams.length > this.endCount) {
                                field.crews.teams.length = Math.max(0, this.endCount - count - 1);
                            }

                            count += field.crewCount;

                        });
                        this.fields[this.fields.length - 1] = this.fields[this.fields.length - 1].filter(field => {
                            return field.crews.teams.length > 0;
                        })
                    } else {
                        count += block.crewCount;
                    }
                });

                if (count < this.endCount) {
                    this.endCount = 0;
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
