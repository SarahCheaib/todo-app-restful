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
            var _this = this;

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
            console.log("render task?", this.task);
            var t = compiledTemplate({task: this.task});
            this.$el.html(t);

            var $input = this.$el.find(".todo-list li input[type='text']");

            $input.focus();

            //workaround to set cursor to end of word
            var tmpStr = $input.val();
            $input.val('');
            $input.val(tmpStr);
        },
        saveTODO: function (e) {
            var details = $(e.currentTarget).serializeObject();
            details.done = details.done == "true" ? true : false; //fix to save done property as a boolean, not a string
            var _this = this;
            if (!this.task) {
                this.tasks.create(details, {
                    success: function () {
                        _this.options.router.navigate('', {trigger: true});
                    }
                });
            } else {
                this.task.save(details, {
                    success: function () {
                        _this.options.router.navigate('', {trigger: true});
                    }
                });
            }

            return false;
        },
        deleteTODO: function (e) {
            var _this = this;
            this.task.destroy();
            _this.options.router.navigate('', {trigger: true});
        },
        kill: function () {
            this.stopListening();
            this.undelegateEvents();
        }
    });
    return EditView;
});