
(function () {

    var commonChartOptions = {
        bottom: {
            isSource: true,
            isTarget: false,
            anchor: 'BottomCenter',
            enabled: false
        },
        top: {
            isSource: false,
            isTarget: true,
            anchor: 'TopCenter',
            enabled: false
        }
    };

    window.APP.Views.OrgChartView = Backbone.View.extend({
        template: _.template($('#orgChartTmpl').html(), null, {variable: 'data'}),

        events: {
            'click .orgchart-edit': 'editChart',
            'click .edit-cancel': 'buildChart',
            'click .edit-save': 'saveChart',
            'click .edit-add-node': 'addNode'
        },

        initialize: function () {
            if (!this.el) { throw new Error('OrgChartView must be instantiated with an element'); }
            if (!this.collection) { throw new Error('OrgChartView must be instantiated with a collection'); }

            // select containers on init, so they can be accessed quickly during render
            this.chartCt = this.$('.js-plumb-container');
        },

        render: function () {
            // add nodes and remove old listeners
            this.buildChart();

            return this;
        },

        buildChart: function () {
            // bind drawing to jsPlumb's "ready" event
            // notice: that the provided function is called immediately if "ready" has already fired
            jsPlumb.ready(_.bind(this._buildChart(commonChartOptions), this));

            this.$('.edit-bar').slideUp();
            this.$('.orgchart-edit').show();
        },

        editChart: function () {
            var options = {
                bottom: _.extend({}, commonChartOptions.bottom, {
                    enabled: true
                }),
                top: _.extend({}, commonChartOptions.top, {
                    enabled: true
                }),
                edit: true
            };

            jsPlumb.ready(_.bind(this._buildChart(options), this));

            this.$('.edit-bar').slideDown();
            this.$('.orgchart-edit').hide();
        },

        _buildChart: function (options) {
            return function () {
                if (this.orgchart) {
                    this.orgchart.remove();
                }

                this.chartCt.html(this.template(this.collection.toCompJSON()));

                 // instantial the chart
                this.orgchart = jsPlumb.getInstance({
                    conatainer: this.chartCt.get(0),
                    MaxConnections: 10,
                    Connector: 'Flowchart'
                });

                var nodes = this.collection

                var self = this;
                nodes.each(function (node) {
                    // Make node draggable if in edit mode
                    if (options.edit) {
                        self.orgchart.draggable('nodeid-' + node.cid, {
                            containment: true,
                            grid: [5, 150]
                        });
                    }
                    _.each(node.get('contains'), function (childId) {
                        var child = nodes.get(childId);
                        self.orgchart.connect({
                            source: self.orgchart.addEndpoint('nodeid-' + node.cid, options.bottom),
                            target: self.orgchart.addEndpoint('nodeid-' + child.cid, options.top)
                        });

                        // Make draggable if in edit mode
                        if (options.edit) {
                            self.orgchart.draggable('nodeid-' + child.cid, {
                                containment: true,
                                grid: [5, 150]
                            });
                        }
                    });
                });

            };
        },

        saveChart: function () {
            console.log('saving !!! ');
            this.buildChart();
        },

        addNode: function () {
            console.log('add node !! ');
            var model = new window.APP.Models.TeamModel();
            this.chartCt.append(this.template([model.toCompJSON()]));

            this.orgchart.draggable('nodeid-' + model.cid, {
                containment: true,
                grid: [5, 150]
            });

            var options = {
                bottom: _.extend({}, commonChartOptions.bottom, {
                    enabled: true
                }),
                top: _.extend({}, commonChartOptions.top, {
                    enabled: true
                }),
                edit: true
            };

            this.orgchart.addEndpoint('nodeid-' + model.cid, options.bottom),
            this.orgchart.addEndpoint('nodeid-' + model.cid, options.top)
        }


    });

})();
