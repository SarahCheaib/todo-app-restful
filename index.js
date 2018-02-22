// Module dependencies.
var application_root = __dirname,
    express = require('express'), //Web framework
    bodyParser = require('body-parser'), //Parser for reading request bodysudo service mongodb stopsudo service mongodb stop
    path = require('path'), //Utilities for dealing with file paths,
    mongoose = require('mongoose'); //MongoDB integration

//Create server
var app = express();

//Where to serve static content
app.use(express.static(path.join(application_root, './', 'site')));
app.use(bodyParser());

//Start server
var port = 4711;

app.listen(port, function () {
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});

// Routes
app.get('/api', function (request, response) {
    response.send('TODO API is running');
});

//Connect to database
mongoose.connect('mongodb://127.0.0.1/todo_app');

//Schemas
var Task = new mongoose.Schema({
    name: String,
    done: Boolean,
    date: Date
});

//Models
var TaskModel = mongoose.model('Task', Task);

//Configure Server
app.configure(function () {
    //parses request body and populates request.body
    app.use(express.bodyParser());

    //checks request.body for HTTP method overrides
    app.use(express.methodOverride());

    //perform route lookup
    app.use(app.router);

    //Where to serve static content
    app.use(express.static(path.join(application_root, './', 'site')));

    //Show all errors in development
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});


//get all TODOs
app.get('/api/tasks', function (request, response) {
    return TaskModel.find(function (err, tasks) {
        if (!err) {
            return response.send(tasks);
        } else {
            return console.log(err);
        }
    });
});

//add task items to database
app.post('/api/tasks', function (request, response) {
    var task = new TaskModel({
        name: request.body.name,
        done: request.body.done,
        date: request.body.date
    });

    return task.save(function (err) {
        if (!err) {
            console.log('Task in DB created');
            return response.send(task);
        } else {
            console.log(err);
        }
    });
});


//get a single Task by ID
app.get('/api/tasks/:id', function (request, response) {
    return TaskModel.findById(request.params.id, function (err, task) {
        if (!err) {
            return response.send(task);
        } else {
            return console.log(err);
        }
    });
});


//update a single Task
app.put('/api/tasks/:id', function (request, response) {
    console.log('Lets update a Task' + request.body.name);
    return TaskModel.findById(request.params.id, function (err, task) {
        task.name = request.body.name;
        task.done = request.body.done;
        task.date = request.body.date;

        return task.save(function (err) {
            if (!err) {
                console.log('task updated');
                return response.send(task);
            } else {
                console.log(err);
            }
        });
    });
});

app.delete('/api/tasks/:id', function (request, response) {
    console.log('Deleting the Task with ID: ' + request.params.id);
    return TaskModel.findById(request.params.id, function (err, task) {
        return task.remove(function () {
            if (!err) {
                console.log('Task removed');
                return response.send('');
            } else {
                console.log(err);
            }
        });
    });
});


//REST API TEST CALLS FROM CONSOLE
/*
Call Rest API with jQuery

//get all task records
jQuery.get( '/api/tasks/', function( data, textStatus, jqXHR ) {
    console.log( 'Get response:' );
    console.dir( data );
    console.log( textStatus );
    console.dir( jqXHR );
});

//ADD NEW TASKS via POST
jQuery.post('/api/tasks/', {
        name: "mein erstes TOPO",
        done: 0,
        date: new Date(2016, 6, 17).getTime() //MongoDB expects dates in UNIX time format (milliseconds from the start of Jan 1st 1970 UTC)

    },
    function (data, textStatus, jqXHR) {
        console.log( 'Post response:' );
        console.dir( data );
        console.log( textStatus );
        console.dir( jqXHR );
    }
);


//GET ONE TASK BY ID
jQuery.get( '/api/tasks/5a8aebab91548a6005000001', function( data, textStatus, jqXHR ) {
    console.log( 'Get response:' );
    console.dir( data );
    console.log( textStatus );
    console.dir( jqXHR );
});


//TEST TASK UPDATE WITH AJAX
jQuery.ajax({
    url: '/api/tasks/5a8aebab91548a6005000001',
    type: 'PUT',
    data: {
        'name': 'JavaScript The good parts',
        'done': 0,
        'date': new Date( 2008, 4, 1 ).getTime()
    },
    success: function( data, textStatus, jqXHR ) {
        console.log( 'Put response:' );
        console.dir( data );
        console.log( textStatus );
        console.dir( jqXHR );
    }
});

//DELETE A TASK
jQuery.ajax({
    url: '/api/tasks/5a8aebab91548a6005000001',
    type: 'DELETE',
    success: function( data, textStatus, jqXHR ) {
        console.log( 'Delete response:' );
        console.dir( data );
        console.log( textStatus );
        console.dir( jqXHR );
    }
});


*/