
(function () {

    window.APP.Views.SettingsView = Backbone.View.extend({
        projectTemplate: _.template($('#setttingsProjectTmpl').html(), null, {variable: 'data'}),
        usersTemplate: _.template($('#kanbanTeamnameTmpl').html(), null, {variable: 'data'}),

        events: {

        },

        initialize: function (options) {
            if (!this.el) { throw new Error('SettingsView must be instantiated with an element'); }
            if (!options.projectCollection) {
                throw new Error('SettingsView must be instantiated with a projectCollection');
            }

            this.projectCollection = options.projectCollection;

            // select containers on init, so they can be accessed quickly during render
            this.projectCt = this.$('.settings-project-ct');
            this.usersCt = this.$('.settings-users-ct');
        },

        render: function () {

            this.projectCt.html(this.projectTemplate(this.projectCollection.toCompJSON()));
            

            return this;
        }

    });

})();
