
(function () {

    window.APP.Models.DashboardModel = Backbone.Model.extend({

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

                budgetTextClass: function () {
                    return self.get('budget') < 0 ? 'text-danger' : '';
                },

                budgetText: function () {
                    // get budget to two decimals
                    var budget = Math.round(self.get('budget') * 100) / 100;
                    return budget < 0 ? Math.abs(budget) + ' over budget' : budget;
                }

            };
        }

    });

})();
