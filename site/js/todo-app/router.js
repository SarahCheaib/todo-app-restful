define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/mainView',
    'app/views/editView'

], function ($, _, Backbone, MainView, EditView) {
    var mainView,
        editView;
    var Router = Backbone.Router.extend({
        routes: {
            // Define your routes
            '': 'main',
            'new': 'editTodo',
            'edit/:id': 'editTodo',
            'deleteDone': 'deleteDone'
        }
    });

    var init = function () {
        var router = new Router();

        router.on('route:main', function () {
            console.log('Backbone routed to MainView - template');
            if (mainView) mainView.kill();
            mainView = new MainView({router: router});
        });

        router.on('route:editTodo', function (id) {
            console.log('Backbone routed to EditView - template');
            if (editView)  editView.kill();
            editView = new EditView({router: router, id: id});
        });

        router.on('route:deleteDone', function () {
            if (mainView)  mainView.deleteDoneTasks();
        });
        Backbone.history.start();
    };

    return {
        init: init
    };
});