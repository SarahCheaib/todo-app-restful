define([
    'jquery',
    'underscore',
    'backbone',
    'app/collections/tasks',
    'text!templates/main-template.html' //load HTML Template with Require.js text! plugin
], function ($, _, Backbone, Tasks, template) {
    console.log('require main view');
    var MainView = Backbone.View.extend({
        el: $('#todo-app .list-container'),
        events: {
            'click .todo-list [type="checkbox"]': 'saveState'
        },
        initialize: function (options) {
            this.options = options;
            this.tasks = new Tasks();

            this.tasks.fetch({
                reset: true
            });

            this.listenTo(this.tasks, "change", this.render);
            this.listenTo(this.tasks, "add", this.render);
            this.listenTo(this.tasks, "reset", this.render);


            return this;
        },
        render: function () {
            var compiledTemplate = _.template(template);      //template is the loaded HTML template
            var t = compiledTemplate({tasks: this.tasks.models});
            this.$el.html(t);
            return this;
        },
        saveState: function (e) {
            var $targEl = $(e.currentTarget); //clicked checkbox
            var task = this.tasks.get($targEl.attr('id'));
            task.save({'done': $targEl[0].checked}); //save new checked state
            return false;
        },
        deleteDoneTasks: function () {
            var router = this.options.router;
            var numTasksToDestroy = this.tasks.where({done: true}).length;
            if (numTasksToDestroy == 0) {
                router.navigate('', {trigger: true});
                return;
            }
            this.listenTo(this.tasks, "destroy", function () {
                numTasksToDestroy--;
                if (numTasksToDestroy == 0) router.navigate('', {trigger: true});
            });

            this.tasks.destroyDoneTasks();
        },
        kill: function () {
            this.stopListening();
            this.undelegateEvents();
        }
    });
    return MainView;
});