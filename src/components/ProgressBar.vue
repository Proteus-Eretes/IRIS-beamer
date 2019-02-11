<template>
    <transition
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
        v-bind:css="false">
        <div class="top-progress" :style="barStyle" v-if="show">
            <div class="peg" :style="pegStyle">
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'progress-bar',

        data() {
            return {
                error: false,
                show: false,
                progress: 0,
                opacity: 1,
                status: null,
                isPaused: false
            }
        },

        props: {
            speed: {
                type: Number,
                default: 1000
            },
            color: {
                type: String,
                default: '#29d'
            },
            colorShadow: String,
            errorColor: {
                type: String,
                default: '#f44336'
            },
            trickleSpeed: {
                type: Number,
                default: 1000
            },
            easing: {
                type: String,
                default: 'linear'
            },
            height: {
                type: Number,
                default: 3
            },
            zIndex: {
                type: Number,
                default: 9999
            },
            fn: {
                type: Function,
                default: function () {}
            }
        },

        computed: {
            progressColor() {
                return this.error ? this.errorColor : this.color
            },

            isStarted() {
                return typeof this.status === 'number'
            },

            barStyle() {
                return {
                    position: 'relative',
                    top: '0',
                    left: '0',
                    right: '0',
                    width: `${this.progress}%`,
                    height: `${this.height}px`,
                    backgroundColor: this.progressColor,
                    transition: `all ${this.speed}ms ${this.easing}`,
                    opacity: `${this.opacity}`,
                    zIndex: `${this.zIndex}`
                }
            },

            pegStyle() {
                return {
                    display: 'block',
                    position: 'absolute',
                    right: '0',
                    width: '100px',
                    height: '100%',
                    opacity: this.progress ? '1' : '0',
                }
            }
        },

        methods: {
            beforeEnter(el) {
                this.opacity = 0;
                this.progress = 0;
                this.width = 0;
            },

            enter(el, done) {
                this.opacity = 1;
                done()
            },

            afterEnter(el) {
                this._runStart()
            },

            _work() {
                setTimeout(() => {
                    if (!this.isStarted || this.isPaused) {
                        return
                    }
                    this.set(this.progress + 10);

                    this._work()
                }, this.trickleSpeed)
            },

            _runStart() {
                this.status = (this.progress === 100 ? null : this.progress);

                this._work()
            },

            start() {
                if (this.show) {
                    this._runStart()
                } else {
                    this.show = true;
                }
            },

            set(amount) {
                const o = (this.isStarted) ? amount: 0;

                this.status = (o === 100 ? null : o);
                this.progress = Math.min(amount, 99);
                if (this.progress >= 99) {
                    this._execute();
                    this.set(1);
                }
            },

            async _execute() {
                try {
                    this.error = !(await this.fn());
                } catch (e) {
                    this.error = true;
                }
            }
        }
    }
</script>
