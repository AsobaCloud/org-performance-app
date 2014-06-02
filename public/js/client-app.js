(function ($) {
    $(function () {

        // single point of connection between css selectors and router
        var viewMappings = {
            kanban: '#kanban-container',
            orgchart: '#orgchart-container',
            settings: '#settings-container',
            dashboard: '#dashboard-container',
            profile: '#profile-container',
            news: '#news-container'
        }

        var allViewSelector = _.map(viewMappings, function (selector) { return selector; }).join(',');

        var showView = function (selector) {
            return function () {
                // hide current view
                $(allViewSelector).hide();
                return $(selector).show();
            };
        };

        var routerOptions = {
            routes: {
                '': 'home',
                'settings/users': 'users',
                'settings/projects': 'projects'
            }
        };

        // construct routes based off of view mappings
        _.each(viewMappings, function (viewSelector, viewName, mappings) {
            routerOptions.routes[viewName] = viewName;
            routerOptions[viewName] = showView(viewSelector);
        });

        var MainRouter = Backbone.Router.extend(_.extend(routerOptions, {
            home: function () {
                // redirect to dashboard
                this.navigate('/dashboard', {trigger: true});
            },
            // TODO: we are going to want to do this with specific data, i.e. with the id of model(s)
            orgchart: function () {
                showView(viewMappings.orgchart)();
                // TODO: this will be handled by BB View, e.g. needs teardown
                buildOrgChart();
            },

            projects: function () {
                showView(viewMappings.settings)()
                    .find('.nav-tabs [data-target="#projects-container"]')
                    .tab('show');
            },

            users: function () {
                showView(viewMappings.settings)()
                    .find('.nav-tabs [data-target="#users-container"]')
                    .tab('show');
            },

            dashboard: function () {
                showView(viewMappings.dashboard)();

                buildDashboardPlots();
            },

            profile: function () {
                showView(viewMappings.profile)();

                buildProfilePlots();
            }

        }));


        // setup jquery plugins
        $('nav-tabs a').on('click', 'body', function (e) {
            // notice we don't use data-* attributes because bootstrap
            // calls Event#preventDefault and that messes up the Backbone routing
            $(this).tab('show');
        });


        new MainRouter();

        Backbone.history.start();

    });

    var buildOrgChart = (function () {
        var called;
        return function () {
            if (called) { return; }
            called = true;

            jsPlumb.ready(function() {

                var orgchart = jsPlumb.getInstance({
                    conatainer: '#js-plumb-container',
                    MaxConnections: 10,
                    Connector: 'Flowchart'
                });

                var commonBottom = {
                    isSource: true,
                    isTarget: false,
                    anchor: 'BottomCenter'
                };

                var commonTop = {
                    isSource: false,
                    isTarget: true,
                    anchor: 'TopCenter'
                };

                var executiveTeam = orgchart.addEndpoint('element1', commonBottom);

                var itTeam = orgchart.addEndpoints('element2', [commonTop, commonBottom]);
                var itTeam1 = orgchart.addEndpoints('element2-sub1', [commonTop, commonBottom]);
                var itTeam2 = orgchart.addEndpoints('element2-sub2', [commonTop, commonBottom]);

                var financingTeam = orgchart.addEndpoints('element3', [commonTop, commonBottom]);
                var marketingTeam = orgchart.addEndpoints('element4', [commonTop, commonBottom]);

                orgchart.connect({
                    source: executiveTeam,
                    target: itTeam[0]
                });
                orgchart.connect({
                    source: itTeam[1],
                    target: itTeam1[0],
                });
                orgchart.connect({
                    source: itTeam[1],
                    target: itTeam2[0],
                });
                

                orgchart.connect({
                    source: executiveTeam,
                    target: marketingTeam[0]
                });

                orgchart.connect({
                    source: executiveTeam,
                    target: financingTeam[0]
                });

            });
        };

    })();

    var buildDashboardPlots = (function () {
        var called;
        return function () {
            if (called) { return; }
            called = true;

            // TODO: move to backbone view and handle resizing, and setup + teardown
            var options = {

                axes: {
                    // options for each axis are specified in seperate option objects.
                    xaxis: {
                        label: '',
                        pad: 0,
                        tickOptions: {
                            showLabel: false
                        }
                    },
                    yaxis: {
                        label: '',
                        tickOptions: {
                            showLabel: false
                        }
                    }
                }
            };

            $.jqplot('overall-burn-rate',
                [[1,3,4,7,9]],
                _.extend({}, options, {title: 'Burn Rate'})
            );
            $.jqplot('overall-resource-util',
                [[1,5,6,7.5,8,10]],
                _.extend({}, options, {title: 'Resource Utilization'})
            );
        };

    })();

    var buildProfilePlots = (function () {
        var called;
        return function () {
            if (called) { return; }
            called = true;

            // TODO: move to backbone view and handle resizing, and setup + teardown
            var options = {

                axes: {
                    // options for each axis are specified in seperate option objects.
                    xaxis: {
                        label: '',
                        pad: 0,
                        tickOptions: {
                            showLabel: false
                        }
                    },
                    yaxis: {
                        label: '',
                        tickOptions: {
                            showLabel: false
                        }
                    }
                }
            };

            $.jqplot('profile-burn-rate',
                [[1,3,4,7,9]],
                _.extend({}, options, {title: 'Burn Rate'})
            );
            $.jqplot('profile-resource-util',
                [[1,5,6,7.5,8,10]],
                _.extend({}, options, {title: 'Utilization'})
            );
        };

    })();

})(jQuery);