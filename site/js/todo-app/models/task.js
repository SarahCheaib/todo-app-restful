define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Task = Backbone.Model.extend({
        parse: function( response ) {
            response.id = response._id;
            return response;
        }
    });

    return Task;
});