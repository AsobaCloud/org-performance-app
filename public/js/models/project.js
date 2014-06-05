
(function () {

    window.APP.Models.ProjectModel = Backbone.Model.extend({

        initialize: function (raw, options) {
            // Initialize the virtual attributes with the correct context
            this._computed = this._computed();
        },

        // Virtual getter
        get: function (attr) {
            if (typeof this._computed[attr] === 'function') {
                return this._computed[attr]();
            }
            return Backbone.Model.prototype.get.call(this, attr);
        },

        toCompJSON: function () {
            var json = this.toJSON();
            _.each(this._computed, function (value, key) {
                json[key] = value();
            });
            return json;
        },

        // Computed model attributes
        _computed: function () {
            var self = this;
            return {

                formattedStartDate: function () {
                    var formatted = self.get('startDate');

                    return formatted ? moment(formatted).format('l') : '';
                }

            };
        }

    });
    
    window.APP.Models.ProjectCollection = Backbone.Collection.extend({

        model: window.APP.Models.ProjectModel,

        toCompJSON: function (options) {
            return this.map(function(model){ return model.toCompJSON(options); });
        }

    });

})();
