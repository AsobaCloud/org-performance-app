
(function () {

    window.APP.Views.KanbanView = Backbone.View.extend({
        cardTemplate: _.template($('#kanbanCardTmpl').html(), null, {variable: 'data'}),
        teamnameTemplate: _.template($('#kanbanTeamnameTmpl').html(), null, {variable: 'data'}),

        events: {

        },

        initialize: function (options) {
            if (!this.el) { throw new Error('KanbanView must be instantiated with an element'); }
            if (!this.model) { throw new Error('KanbanView must be instantiated with a model'); }
            if (!options.cardCollection) {
                throw new Error('KanbanView must be instantiated with a cardCollection');
            }
            if (!options.userCollection) {
                throw new Error('KanbanView must be instantiated with a userCollection');
            }

            this.cardCollection = options.cardCollection;
            this.userCollection = options.userCollection;

            // select containers on init, so they can be accessed quickly during render
            this.teamnameCt = this.$('.kanban-teamname-ct');
            this.backlogCt = this.$('.kanban-backlog-ct');
            this.pendingCt = this.$('.kanban-pending-ct');
            this.doingCt = this.$('.kanban-doing-ct');
            this.blockedCt = this.$('.kanban-blocked-ct');
            this.doneCt = this.$('.kanban-done-ct');
        },

        render: function () {

            this.teamnameCt.html(this.teamnameTemplate({ name: this.model.get('name') }));

            // empty existing card containers
            this.backlogCt.empty();
            this.pendingCt.empty();
            this.doingCt.empty();
            this.blockedCt.empty();
            this.doneCt.empty();

            _.each(this.model.get('cards'), this.appendCard, this);

            return this;
        },

        appendCard: function (card) {
            if (typeof card === 'number') {
                card = this.cardCollection.get(card);
            }
            // bail if theres no card
            if (!card) { return; }

            card = card.toJSON ? card.toJSON() : card;
            var el = this.$('[data-id="' + card.id + '"]');
            el = el.length ? el[0] : this.cardTemplate(card);
            switch (card.status) {
                case 'backlog':
                    this.backlogCt.append(el);
                    break;
                case 'pending':
                    this.pendingCt.append(el);
                    break;
                case 'doing':
                    this.doingCt.append(el);
                    break;
                case 'blocked':
                    this.blockedCt.append(el);
                    break;
                case 'done':
                    this.doneCt.append(el);
                    break;
            }

        },

        // override #remove since the view is being created with an element that should not be removed
        remove: function () {
            this.stopListening();
        }

    });

})();
