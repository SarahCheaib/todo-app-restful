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
            if (doneTasks == 0) {        //if all tasks destroyed
                _this.trigger('destroyedDoneComplete');  //trigger custom event
            }
            completedTasks.forEach(function (task) {
                task.destroy({
                    success: function () {
                        doneTasks--;
                        console.log('task destroyed successfully');
                        if (doneTasks == 0) {        //if all tasks destroyed
                            _this.trigger('destroyedDoneComplete');  //trigger custom event
                        }
                    },
                    error: function () {
                        doneTasks--;
                        console.log('task destroy error');
                        if (doneTasks == 0) {        //if all tasks destroyed
                            _this.trigger('destroyedDoneComplete');  //trigger custom event
                        }
                    }
                });
            });
        }
    });
    return Tasks;
});