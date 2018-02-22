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
            var _this = this;

            this.tasks.fetch({
                reset:true
            });

            this.listenTo(this.tasks, "change", this.render);
            this.listenTo(this.tasks, "add", this.render);
            this.listenTo(this.tasks, "reset", this.render);
            this.listenTo(this.tasks, "destroy", this.render);

            return this;
        },
        render: function () {
            var compiledTemplate = _.template(template);      //template is the loaded HTML template
            var t = compiledTemplate({tasks: this.tasks.models});
            this.$el.html(t);
            return this;
        },
        saveState: function (e) {
            var task = this.tasks.get($(e.currentTarget).attr('id'));
            var checked = $(e.currentTarget)[0].checked;

            task.save({'done': checked});
            return false;
        },
        deleteDoneTasks: function () {
            var _this = this;
          /*  this.listenTo(this.tasks, 'destroyedComplete', function () {
                _this.options.router.navigate('', {trigger: true});
            });*/

            this.tasks.destroyDoneTasks();
        },
        kill: function () {
            this.stopListening();
            this.undelegateEvents();
        }
    });
    return MainView;
});