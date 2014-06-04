
(function ($) {

    window.APP = {
        Views: {},
        Models: {}
    };

    $(function () {

        // single point of connection between css selectors and router
        var viewMappings = {
            kanban: '#kanban-container',
            orgchart: '#orgchart-container',
            settings: '#settings-container',
            dashboard: '#dashboard-container',
            profile: '#profile-container'
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

        var initalizedViews = {};

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

            orgchart: function () {
                var $el = showView(viewMappings.orgchart)();

                if (!initalizedViews.orgchart) {
                    initalizedViews.orgchart = new window.APP.Views.OrgChartView({
                        el: $el.get(0),
                        collection: new window.APP.Models.TeamCollection([
                            {
                                name: 'Executive Team',
                                id: 12345670, // Fake the ids until server is done
                                y: 10,
                                x: 150,
                                contains: ['12345675', '12345673', '12345674']
                            }, {
                                name: 'IT',
                                id: 12345675, // Fake the ids until server is done
                                y: 160,
                                x: 75,
                                contains: ['12345671', '12345672']
                            }, {
                                name: 'IT Team 1',
                                id: 12345671, // Fake the ids until server is done
                                y: 310,
                                x: 25,
                                contains: []
                            }, {
                                name: 'IT Team 2',
                                id: 12345672, // Fake the ids until server is done
                                y: 310,
                                x: 125,
                                contains: []
                            }, {
                                name: 'Financing',
                                id: 12345673, // Fake the ids until server is done
                                y: 160,
                                x: 265,
                                contains: []
                            }, {
                                name: 'Marketing',
                                id: 12345674, // Fake the ids until server is done
                                y: 160,
                                x: 365,
                                contains: []
                            }
                        ])
                    });
                }

                initalizedViews.orgchart.render();
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
                var $el = showView(viewMappings.dashboard)();

                if (!initalizedViews.dashboard) {
                    initalizedViews.dashboard = new window.APP.Views.DashboardView({
                        el: $el.get(0),
                        // TODO: connect models to server instead of hard coding
                        model: new window.APP.Models.DashboardModel({
                            burnrate: [[1,3,4,7,9]],
                            resourceutil: [[1,5,6,7.5,8,10]],
                            budget: -3600.00
                        }),
                        newsCollection: new Backbone.Collection([
                            {
                                heading: 'Teammate #5 add a new task to Team 1 from Project 3',
                                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, mi sed viverra pe'
                            }, {
                                heading: 'Teammate #6 added task "Work Faster"',
                                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, mi sed viverra pe'
                            }, {
                                heading: 'Teammate #3 commented on the task "Jump Higher"',
                                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, mi sed viverra pe'
                            }, {
                                heading: 'Team X Deleted',
                                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, mi sed viverra pe'
                            }, {
                                heading: 'Team 2 Created',
                                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, mi sed viverra pe'
                            }
                        ])
                    });
                }

                initalizedViews.dashboard.render();
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

        // TODO: this is view code, just here as a reminder
        $('#news-filter').on('change', function (e) {
            console.log('news filter is ' + $(this).val())
        })


        new MainRouter();

        Backbone.history.start();

    });

    


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
