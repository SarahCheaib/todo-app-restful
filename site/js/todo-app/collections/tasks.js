define([
    'underscore',
    'backbone',
    'app/models/task'
], function (_, Backbone, TaskModel) {
    var Tasks = Backbone.Collection.extend({
        model: TaskModel,
        url: '/api/tasks',
        destroyDoneTasks: function () {
            var _this = this;
            var completedTasks = this.where({done: true});   //returns array of completed tasks
            var doneTasks = completedTasks.length;  //number of completed tasks to destroy
            completedTasks.forEach(function (task) {
                task.destroy();
                doneTasks--;
                console.log('task destroyed successfully');
                if (doneTasks == 0) {        //if all tasks destroyed
                    _this.trigger('destroyedComplete');  //trigger custom event
                }
            });
        }
    });
    return Tasks;
});