require.def("sampleapp/appui/components/simple",
    [
        "antie/widgets/component",
        "antie/widgets/button",
        "antie/widgets/label",
        "antie/widgets/container"
    ],
    function (Component, Button, Label, Container) {
        'use strict';
        var start = 80, end = 800, duration = 2000, states = [
            'start',
            'out',
            'end',
            'back'
        ];

        var state = 0;

        // All components extend Component
        return Component.extend({

            init: function () {
                var self, label, i, j, inner, numButtons, nest, outer;
                numButtons = window.DOM_COUNT;
                nest = window.NEST_COUNT;
                this._device = this.getCurrentApplication().getDevice();
                self = this;
                // It is important to call the constructor of the superclass
                this._super("simplecomponent");
                
                // Hello World

                this.container = new Container('outerDiv');

                this.buttons = [];
                for (i = 0; i !== numButtons; i += 1) {
                    label = new Label(i.toString());
                    inner = new Button();
                    inner.appendChildWidget(label);
                    for (j = 0; j !== window.NEST_COUNT; j += 1) {
                        outer = new Container('button_' + i + '_nest_' + j);
                        outer.appendChildWidget(inner);
                        outer.addClass('nest');
                        inner = outer;
                    }

                    this.container.appendChildWidget(inner);
                    this.buttons.push(inner);
                }

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
                        el: self.container.outputElement,
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
                        el: self.container.outputElement,
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
                        el: self.container.outputElement,
                        to: {
                            left: start
                        },
                        skipAnim: true
                    });

                    for (i = 0; i !== self.buttons.length; i += 1) {
                        self.buttons[i].addEventListener('select', tween);
                    }


                });
            },

            // Appending widgets on beforerender ensures they're still displayed
            // if the component is hidden and subsequently reinstated.
            _onBeforeRender: function () {
                this.appendChildWidget(this.container);
            }
        });
    }
);