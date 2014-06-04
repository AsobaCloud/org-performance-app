
Backbone.CreateSubCollection = function (subCollection) {
    if (!(subCollection instanceof Array)) {
        subCollection = [subCollection];
    }

    Backbone.Model.extend({

        parse: function (resp, options) {
          return this._nestColl(resp);
        },

        // We have to override Model.set so that backbone internals don't replace the item collection instance
        // with another collection instance, which would require re-attaching some event listeners to views
        set: function(key, val, options) {
          // Borrow argument parsing from backbone.js
          var attrs;
          if (key == null) { return this; }

          if (typeof key === 'object') {
            attrs = key;
            options = val;
          } else {
            (attrs = {})[key] = val;
          }

          options || (options = {});
          // Make sure the items collection is updated not replaced.
          attrs = this._nestColl(attrs, options);
          return Backbone.Model.prototype.set.call(this, attrs, options);
        },

        // Make sure this model's items attribute is a collection, and potentially update that
        // collection if the provided attrs object has an items field.
        _nestColl: function (attrs, options) {
          var items = this.get('items');
          if (!(items instanceof Backbone.Collection)) {
            // Make sure to use native Backbone.set since this is called by this model's overridden set
            Backbone.Model.prototype.set.call(this, 'items', new SIMPLIST.models.ItemsCollection((items || []), {
              model: SIMPLIST.models.Item,
              parentModel: this
            }), options);
          }
          if (attrs) {
            if (attrs.items instanceof Array) {
              attrs.items = this.get('items').set(attrs.items, options);
            } else if (attrs.items instanceof Backbone.Collection) {
              // Make sure to update the current collection, so that bound views stay bound
              attrs.items = this.get('items').set(attrs.items.toJSON(), options);
            }
          }
          return attrs;
        }

    });

};
