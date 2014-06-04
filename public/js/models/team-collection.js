
(function () {

    window.APP.Models.TeamCollection = Backbone.Collection.extend({

        model: window.APP.Models.TeamModel,

        toCompJSON: function (options) {
            return this.map(function(model){ return model.toCompJSON(options); });
        }

    });

})();
