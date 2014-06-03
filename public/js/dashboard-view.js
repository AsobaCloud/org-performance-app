
(function () {

    window.APP.Views.DashboardView = Backbone.View.extend({
        // use variable option to avoid using "with"
        budgetTemplate: _.template($('#dashboardBudgetTmpl').html(), null, {variable: 'data'}),
        newsTemplate: _.template($('#dashboardNewsTmpl').html(), null, {variable: 'data'}),

        events: {

        },

        initialize: function () {
            // Must have a model and an element
            if (!this.el) { throw new Error('DashboardView must be instantiated with an element'); }
            if (!this.model) { throw new Error('DashboardView must be instantiated with a model'); }

            // attach options
            this.newsCollection = this.options && this.options.newsCollection;

            // select template containers for later
            this.bugdetCt = this.$('.dashboard-budget-ct');
            this.newsCt = this.$('.dashboard-news-ct');

            // attach listeners
        },

        render: function () {

            this.drawPlots();
            this.budgetCt.html(this.budgetTemplate(this.model.toJSON()));
            
            var news = this.newsCollection && this.newsCollection.toJSON();
            this.newsCt.html(this.newsTemplate(news));

            return this;
        },

        remove: function () {
            // Destory the plots and empty their containing elements
            this._setupPlots();
            
            return Backbone.View.prototype.remove.apply(this, arguments);
        },

        drawPlots: function () {
            // cleanup old plots and the container elements
            this._setupPlots();
            if (!this.plotOptions) {
                this.plotOptions = {
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
            }

            return this._drawPlots();
        },

        _setupPlots: function () {
            if (this.burnRatePlot) { this.burnRatePlot.destroy(); }
            if (this.resourcePlot) { this.resourcePlot.destroy(); }
        },

        _drawPlots: function () {
            var burnRate = [[1,3,4,7,9]];
            this.burnRatePlot = $.jqplot('overall-burn-rate',
                burnRate,
                _.extend({}, this.plotOptions, {title: 'Burn Rate'})
            );

            var resource = [[1,5,6,7.5,8,10]];
            this.resourcePlot = $.jqplot('overall-resource-util',
                resource,
                _.extend({}, this.plotOptions, {title: 'Resource Utilization'})
            );
        }

    });

})();
