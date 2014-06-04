
(function () {

    var commonChartOptions = {
        bottom: {
            isSource: true,
            isTarget: false,
            anchor: 'BottomCenter'
        },
        top: {
            isSource: false,
            isTarget: true,
            anchor: 'TopCenter'
        }
    };

    window.APP.Views.OrgChartView = Backbone.View.extend({
        template: _.template($('#orgChartTmpl').html(), null, {variable: 'data'}),

        events: {

        },

        initialize: function () {
            if (!this.el) { throw new Error('OrgChartView must be instantiated with an element'); }
            if (!this.collection) { throw new Error('OrgChartView must be instantiated with a collection'); }

            // select containers on init, so they can be accessed quickly during render
            this.chartCt = this.$('.js-plumb-container');
        },

        render: function () {
            // add nodes and remove old listeners
            this.chartCt.html(this.template(this.collection.toCompJSON()));
            this.buildChart();

            return this;
        },

        buildChart: function () {
            if (this.orgchart) { this.orgchart.remove(); }

            // bind drawing to jsPlumb's "ready" event
            // notice: that the provided function is called immediately if "ready" has already fired
            jsPlumb.ready(_.bind(this._buildChart, this));
        },

        _buildChart: function () {
            var self = this;

             // instantial the chart
            this.orgchart = jsPlumb.getInstance({
                conatainer: this.chartCt.get(0),
                MaxConnections: 10,
                Connector: 'Flowchart'
            });

            var nodes = this.collection
            var endpoints = [];
            nodes.each(function (node) {
                _.each(node.get('contains'), function (childId) {
                    var child = nodes.get(childId);
                    self.orgchart.connect({
                        source: self.orgchart.addEndpoint('nodeid-' + node.cid, commonChartOptions.bottom),
                        target: self.orgchart.addEndpoint('nodeid-' + child.cid, commonChartOptions.top)
                    });
                });
            });

        }


    });

})();
