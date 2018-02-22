define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Task = Backbone.Model.extend({
        parse: function( response ) {
            response.id = response._id;
            //console.log("parse response: ");
            //console.log(response);
            return response;
        }
    });

    return Task;
});