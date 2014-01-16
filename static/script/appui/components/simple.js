require.def("sampleapp/appui/components/simple",
    [
        "antie/widgets/component",
        "antie/widgets/button",
        "antie/widgets/label"
    ],
    function (Component, Button, Label) {
        'use strict';
        var start = 80, end = 1000, duration = 2000, states = [
            'start',
            'out',
            'end',
            'back'
        ];

        var state = 0;

        // All components extend Component
        return Component.extend({

            init: function () {
                var self, label;
                this._device = this.getCurrentApplication().getDevice();
                self = this;
                // It is important to call the constructor of the superclass
                this._super("simplecomponent");
                
                // Hello World
                label = new Label("Hello World");
                this._button = new Button();
                this._button.appendChildWidget(label);
                
                this.addEventListener("beforerender", function (ev) {
                    self._onBeforeRender(ev);
                });

                function nextState() {
                    state += 1;
                    if (state === states.length) {
                        state = 0;
                    }
                }



                function tweenOut() {
                    nextState();
                    self._device.moveElementTo({
                        el: self._button.outputElement,
                        from: {
                            left: start
                        },
                        to: {
                            left: end
                        },
                        onComplete: nextState,
                        duration: duration
                    });
                }

                function tweenBack() {
                    nextState();
                    self._device.moveElementTo({
                        el: self._button.outputElement,
                        from: {
                            left: end
                        },
                        to: {
                            left: start
                        },
                        onComplete: nextState,
                        duration: duration
                    });
                }

                function tween() {
                    switch (states[state]) {
                    case 'start':
                        tweenOut();
                        break;
                    case 'end':
                        tweenBack();
                        break;
                    }
                }

                // calls Application.ready() the first time the component is shown
                // the callback removes itself once it's fired to avoid multiple calls.
                this.addEventListener("aftershow", function appReady() {
                    self.getCurrentApplication().ready();
                    self.removeEventListener('aftershow', appReady);
                    self._device.moveElementTo({
                        el: self._button.outputElement,
                        to: {
                            left: start
                        },
                        skipAnim: true
                    });
                    self._button.addEventListener('select', tween);
                });
            },

            // Appending widgets on beforerender ensures they're still displayed
            // if the component is hidden and subsequently reinstated.
            _onBeforeRender: function () {
                this.appendChildWidget(this._button);
            }
        });
    }
);