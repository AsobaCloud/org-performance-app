
(function () {

    window.APP.Views.SettingsView = Backbone.View.extend({
        projectTemplate: _.template($('#setttingsProjectTmpl').html(), null, {variable: 'data'}),
        userTemplate: _.template($('#settingsUserTmpl').html(), null, {variable: 'data'}),

        events: {

        },

        initialize: function (options) {
            if (!this.el) { throw new Error('SettingsView must be instantiated with an element'); }
            if (!options.projectCollection) {
                throw new Error('SettingsView must be instantiated with a projectCollection');
            }
            if (!options.userCollection) {
                throw new Error('SettingsView must be instantiated with a userCollection');
            }

            this.projectCollection = options.projectCollection;
            this.userCollection = options.userCollection;

            // select containers on init, so they can be accessed quickly during render
            this.projectCt = this.$('.settings-project-ct');
            this.userCt = this.$('.settings-user-ct');
        },

        render: function () {

            this.projectCt.html(this.projectTemplate(this.projectCollection.toCompJSON()));
            this.userCt.html(this.userTemplate(this.userCollection.toJSON()));

            return this;
        }

    });

})();
