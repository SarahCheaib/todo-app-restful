define([
    'underscore',
    'backbone',
    'app/models/task'
], function (_, Backbone, TaskModel) {
    var Tasks = Backbone.Collection.extend({
        model: TaskModel,
        url: '/api/tasks',
        destroyDoneTasks: function () {
            this.where({done: true}).forEach(function (task) {
                task.destroy();
            });
        }
    });
    return Tasks;
});