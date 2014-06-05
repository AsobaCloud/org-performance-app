
(function () {

    window.APP.Views.SidebarKanbanView = Backbone.View.extend({
        template: _.template($('#sidebarKanbanTmpl').html(), null, {variable: 'data'}),

        events: {

        },

        initialize: function () {
            if (!this.el) { throw new Error('SidebarKanbanView must be instantiated with an element'); }
            if (!this.collection) { throw new Error('SidebarKanbanView must be instantiated with a collection'); }

        },

        render: function () {

            var json = this.collection.toCompJSON();

            // build a hashMap of the models so we don't have to repeatedly call underscore#find
            var idMap = {};
            _.each(json, function (m) {
                idMap[m.id.toString()] = m;
            });

            var contains, id;
            for (var i = 0; i < json.length; i++) {
                contains = json[i].contains || [];
                for (var j = 0; j < contains.length; j++) {
                    id = contains[j].toString();
                    contains[j] = idMap[contains[j]];
                    idMap[id].isContained = true;
                }
            }

            var trees = _.filter(json, function (m) { return !m.isContained; });

            this.$el.html(this.template(trees));

            return this;
        }

    });

})();
