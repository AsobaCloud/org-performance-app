
(function ($) {

    window.APP = {
        Views: {},
        Models: {}
    };

    $(function () {

        // TODO: Create users model and collection
        var userCollection = new Backbone.Collection([
            {
                id: 1231,
                name: 'Teammate 1',
                description: 'Cats are the Best!',
                cards: [1234, 1233, 1231, 1232]
            }, {
                id: 1232,
                name: 'Teammate 2',
                description: 'Run anywhere cloud Platform as a Service, SoMoLo...'
            }, {
                id: 1233,
                name: 'Teammate 3',
                description: 'I think it\'s a bit more runny than you like it' 
            }, {
                id: 1234,
                name: 'Teammate 4',
                description: '... then you go and totally redeem yourself!'
            }, {
                id: 1235,
                name: 'Teammate 5',
                description: ''
            }, {
                id: 1236,
                name: 'Teammate 6',
                description: ''
            }, {
                id: 1237,
                name: 'Teammate 7',
                description: ''
            }, {
                id: 1238,
                name: 'Teammate 8',
                description: ''
            }
        ]);

        // TODO: Create card model and colletion
        var cards = new Backbone.Collection([
            {
                title: 'Do stuff...',
                status: 'pending',
                id: 1234
            }, {
                title: 'Foo',
                status: 'doing',
                id: 1231
            }, {
                title: 'Bar',
                status: 'doing',
                id: 1232
            }, {
                title: 'Baz',
                status: 'done',
                id: 1233
            }, {
                title: 'Work on sales',
                status: 'doing',
                id: 1235
            }, {
                title: 'Payrole for May',
                status: 'doing',
                id: 1236
            }, {
                title: 'Payrole for April',
                status: 'done',
                id: 1237
            }
        ]);

        var teamCollection = new window.APP.Models.TeamCollection([
            {
                name: 'Executive Team',
                id: 12345670, // Fake the ids until server is done
                y: 0,
                x: 150,
                contains: [12345675, 12345673, 12345674]
            }, {
                name: 'IT',
                id: 12345675, // Fake the ids until server is done
                y: 150,
                x: 75,
                contains: [12345671, 12345672]
            }, {
                name: 'IT Team 1',
                id: 12345671, // Fake the ids until server is done
                y: 300,
                x: 25,
                cards: [1231, 1233],
                members: [1231, 1232]
            }, {
                name: 'IT Team 2',
                id: 12345672, // Fake the ids until server is done
                y: 300,
                x: 125,
                cards: [1232, 1234],
                members: [1233,1234]
            }, {
                name: 'Financing',
                id: 12345673, // Fake the ids until server is done
                y: 150,
                x: 265,
                cards: [1236, 1237],
                members: [1235, 1236]
            }, {
                name: 'Marketing',
                id: 12345674, // Fake the ids until server is done
                y: 150,
                x: 365,
                cards: [1235],
                members: [1237, 1238]
            }
        ]);

        // TODO: create projects colleciton
        var projectCollection = new window.APP.Models.ProjectCollection([
            {
                name: 'Project 1',
                startDate: moment().subtract(10, 'days').toDate(),
                active: true
            }, {
                name: 'Project 2',
                startDate: moment().subtract(1, 'day').toDate(),
                active: true
            }, {
                name: 'Project 3',
                startDate: moment().add(1, 'day').toDate(),
                active: false
            }, {
                name: 'Project 4',
                startDate: moment().add(5, 'days').toDate(),
                active: false
            }
        ]);

        // Build the sidebar on init
        var sidebarKanbanView = new window.APP.Views.SidebarKanbanView({
            el: $('#collapseKanban').get(0),
            teamCollection: teamCollection,
            userCollection: userCollection
        });

        sidebarKanbanView.render();

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
                // hide any alerts shown by previously active views
                $('.alert-no-model').hide()
                // show the view
                return $(selector).show();
            };
        };

        var routerOptions = {
            routes: {
                '': 'home',
                'kanban/:id': 'kanban',
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
                        collection: teamCollection
                    });
                }

                initalizedViews.orgchart.render();
            },

            settings: function () {
                var $el = showView(viewMappings.settings)();

                if (!initalizedViews.settings) {
                    initalizedViews.settings = new window.APP.Views.SettingsView({
                        el: $el.get(0),
                        projectCollection: projectCollection,
                        userCollection: userCollection
                    });
                }

                // return the element so sub view routes can use it
                return initalizedViews.settings.render().$el;
            },

            projects: function () {
                this.settings()
                    .find('.nav-tabs [data-target="#projects-container"]')
                    .tab('show');
            },

            users: function () {
                this.settings()
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

            kanban: function (teamid) {
                var $el = showView(viewMappings.kanban)();

                // TODO: replace this with ajax call to get the team's kanban board
                var model = teamCollection.get(teamid);
                if (!model) {
                    return $el.find('.alert-no-model').fadeIn();
                }

                initalizedViews.kanban && initalizedViews.kanban.remove();

                initalizedViews.kanban = new window.APP.Views.KanbanView({
                    el: $el.get(0),
                    model: model,
                    cardCollection: cards,
                    userCollection: userCollection
                });

                initalizedViews.kanban.render();
            },

            profile: function () {
                var $el = showView(viewMappings.profile)();

                if (!initalizedViews.profile) {
                    // TODO: the user should have a specific model for their profile, potentially
                    //       containing data that isn't available to the public user's collection
                    var user = new Backbone.Model(_.extend(userCollection.first().toJSON(), {
                        burnrate: [[1,3,4,7,9]],
                        resourceutil: [[6,5,6,7.5,8,10]]
                    }));

                    initalizedViews.profile = new window.APP.Views.ProfileView({
                        el: $el.get(0),
                        model: user,
                        cardCollection: cards
                    });
                }

                // return the element so sub view routes can use it
                return initalizedViews.profile.render();
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

})(jQuery);
