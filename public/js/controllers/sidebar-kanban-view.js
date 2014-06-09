
(function () {

    window.APP.Views.SidebarKanbanView = Backbone.View.extend({
        template: _.template($('#sidebarKanbanTmpl').html(), null, {variable: 'data'}),

        events: {

        },

        initialize: function (options) {
            if (!this.el) { throw new Error('SidebarKanbanView must be instantiated with an element'); }
            if (!options.teamCollection) {
                throw new Error('SidebarKanbanView must be instantiated with a teamCollection');
            }
            if (!options.userCollection) {
                throw new Error('SidebarKanbanView must be instantiated with a userCollection');
            }

            this.teamCollection = options.teamCollection;
            this.userCollection = options.userCollection;
        },

        render: function () {

            var json = this.teamCollection.toCompJSON();

            // build a hashMap of the models so we don't have to repeatedly call underscore#find
            // and populate the members array with related models
            var idMap = {}, model, member;
            for (var k = 0; k < json.length; k++) {
                model = json[k]
                idMap[model.id] = model;
                if (!model.members) { continue; }
                for (var l = 0; l < model.members.length; l++) {
                    member = model.members[l];
                    member = this.userCollection.get(member);
                }
            }

            // Build a tree structure from the teams collection based on which teams are contained by which
            var contains;
            for (var i = 0; i < json.length; i++) {
                contains = json[i].contains || [];
                for (var j = 0; j < contains.length; j++) {
                    id = contains[j];
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
