define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/task',
    'app/collections/tasks',
    'text!templates/edit-template.html'
], function ($, _, Backbone, Task, Tasks, template) {
    var EditView = Backbone.View.extend({
        el: $('#todo-app .list-container'),
        events: {
            'submit .edit-todo': 'saveTODO',
            'click button.delete-btn': 'deleteTODO'
        },
        initialize: function (options) {
            this.options = options;
            this.tasks = new Tasks();

            this.listenTo(this.tasks, "reset", this.render);
            this.listenTo(this.tasks, "change", this.render);

            this.tasks.fetch({reset: true});

            return this;
        },
        render: function () {
            if (this.options.id) {
                console.log("edit the task with id: ", this.options.id);
                //edit task, get task by id
                this.task = this.tasks.get(this.options.id);
                console.log("get task?", this.task);
            }

            var compiledTemplate = _.template(template);
            var t = compiledTemplate({task: this.task});
            this.$el.html(t);

            var $input = this.$el.find(".todo-list li input[type='text']");

            $input.focus();

            //hack to set cursor to end of word
            var tmpStr = $input.val();
            $input.val('');
            $input.val(tmpStr);
        },
        saveTODO: function (e) {
            var details = $(e.currentTarget).serializeObject();
            details.done = details.done == "true" ? true : false; //fix to save done property as a boolean, not a string

            var router = this.options.router;
            if (!this.task) {   //create new task
                this.tasks.create(details, {
                    success: function () {
                        router.navigate('', {trigger: true});
                    }
                });
            } else { //save task changes
                this.task.save(details, {
                    success: function () {
                        router.navigate('', {trigger: true});
                    }
                });
            }

            return false;
        },
        deleteTODO: function (e) {
            var router = this.options.router;
            this.task.destroy({
                success: function (model, response) {
                    router.navigate('', {trigger: true});
                }
            });
        },
        kill: function () {
            this.stopListening();
            this.undelegateEvents();
        }
    });
    return EditView;
});