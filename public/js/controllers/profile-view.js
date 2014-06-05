
(function () {

    window.APP.Views.ProfileView = Backbone.View.extend({
        taskTemplate: _.template($('#profileTaskTmpl').html(), null, {variable: 'data'}),

        events: {

        },

        initialize: function (options) {
            if (!this.el) { throw new Error('ProfileView must be instantiated with an element'); }
            if (!this.model) { throw new Error('ProfileView must be instantiated with a model'); }
            if (!options.cardCollection) {
                throw new Error('ProfileView must be instantiated with a cardCollection');
            }

            this.cardCollection = options.cardCollection;

            // select containers on init, so they can be accessed quickly during render
            this.workingCt = this.$('.task-working');
            this.completeCt = this.$('.task-complete');
        },

        render: function () {

            this.drawPlots();
            _.each(this.model.get('cards'), this.appendCard, this);

            return this;
        },

        appendCard: function (card) {
            // get card model
            if (typeof card === 'number') {
                card = this.cardCollection.get(card);
            }
            card = card.toJSON ? card.toJSON() : card;
            // bail if no card was passed in
            if (!card) { return; }

            var el = this.$('[data-id="' + card.id + '"]');
            el = el.length ? el[0] : this.taskTemplate(card);
            switch (card.status) {
                case 'backlog':
                case 'pending':
                case 'doing':
                case 'blocked':
                    this.workingCt.append(el);
                    break;
                case 'done':
                    this.completeCt.append(el);
                    break;
            }
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
            var burnRate = this.model.get('burnrate');
            this.burnRatePlot = $.jqplot('profile-burn-rate',
                burnRate,
                _.extend({}, this.plotOptions, {title: 'Burn Rate'})
            );

            var resource = this.model.get('resourceutil');
            this.resourcePlot = $.jqplot('profile-resource-util',
                resource,
                _.extend({}, this.plotOptions, {title: 'Resource Utilization'})
            );
        }

    });

})();
