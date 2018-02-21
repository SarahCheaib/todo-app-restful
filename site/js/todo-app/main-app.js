define([
        'jquery',
        'underscore',
        'backbone'
    ],
    function ($, _, Backbone) {
        var init = function () {
            require(['app/router'], function (Router) {
                //init Router, which takes care of the views and navigating subpages
                Router.init();
            })
        };

        /*Plugins / Helpers */
        $.fn.serializeObject = function () {
            var object = {};
            $.each(this.serializeArray(), function () {
                if (object[this.name] !== undefined) {
                    if (!object[this.name].push) {
                        object[this.name] = [object[this.name]];
                    }
                    object[this.name].push(this.value || '');
                } else {
                    object[this.name] = this.value || '';
                }
            });
            return object;
        };


        return {
            init: init
        };
    });