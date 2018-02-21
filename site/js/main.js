//Load common code that includes config, then load the app logic for this page.
require(['./common'], function() {
    require(['app/main-app'], function(app) {
         app.init();
    });
});