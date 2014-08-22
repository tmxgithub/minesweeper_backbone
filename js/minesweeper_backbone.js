(function(){

    var Cell = Backbone.Model.extend({
        defaults: {
            isMine: false,
            isOpend: false,
            value: 0,
        },
        inc: function(){
            this.set({value: this.get('value') + 1});
        },
        reveal: function(){
            this.set({isOpend: true});
            if (this.get('isMine')) {
                return Cells.validate();
            }
            if (!this.get('value')) {
                _.each(this.get('neighbors'), function(cell) {
                    if (!cell.get('isOpend') && !cell.get('isMine')) {
                        cell.reveal();
                    }
                });
            }
            if (Cells.remaining().length == Cells.isMine().length) { Cells.validate(); }
        },
    });

    var Cells = Backbone.Collection.extend({
        model: Cell,
        defaults: function(){
            this.x = 9;
            this.y = 9;
            this.mines = 10;
            this.gameover = false;

            var cells = [];
            for (var y = 0; y < this.y; y++) {
                var cellRow = [];
                for (var x = 0; x < this.x; x++) {
                    cellRow.push(new Cell({x: x, y: y}));
                }
                cells.push(cellRow);
            }

            for (var y = 0; y < this.y; y++) {
                for (var x = 0; x < this.x; x++) {
                    var neighbors = [];
                    for (var dy = -1; dy <= 1; dy++) {
                        for (var dx = -1; dx <= 1; dx++) {
                            if (cells[x+dx] && cells[x+dx][y+dy]) {
                                neighbors.push(cells[x+dx][y+dy]);
                            }
                        }
                    }
                    cells[x][y].set({neighbors: neighbors});
                }
            }
            var mines = this.mines;
            while (mines) {
                var x = Math.floor(this.x * Math.random());
                var y = Math.floor(this.y * Math.random());

                if (!cells[x][y].get('isMine')) {
                    cells[x][y].set({isMine: true});
                    _.each(cells[x][y].get('neighbors'), function(cell) { cell.inc() });
                    mines--;
                }
            }
            for (var length = cells.length; 0 < length; length--) {
                var row = cells.shift();
                _.each(row, function(cell) { cells.push(cell); });
            }
            return cells;
        },
        initialize: function(){
            this.add(this.defaults());
        },
        isOpend: function(){
            return this.filter(function(cell) {return cell.get('isOpend');});
        },
        remaining: function(){
            return this.without.apply(this, this.isOpend());
        },
        isMine: function(){
            return this.filter(function(cell) { return cell.get('isMine') });
        },
        row: function(row) {
            return this.filter(function(cell) { return cell.get('y') == row; });
        },
        validate: function(clicked) {
            if (this.gameover) { return; }
            var remaining = this.remaining();
            var isMine = this.isMine();

            if (
                (remaining.length == isMine.length) &&
                (remaining.every(function(f,i){return f == isMine[i]}))
            ) {
                notify('You win!');
            }  else {
                notify('You lose!');
            }
            this.revealMines();
            this.gameover = true;
        },
        revealMines: function(){
            $.each(this.isMine(), function(){this.set({isOpend: true})});
        },
    });

    function notify(message) {
        setTimeout(function(){ alert(message) }, 100);
    }

    var Cells = new Cells;

    var CellView = Backbone.View.extend({
        tagName: 'b',
        template: _.template('<% if (isOpend && !isMine && value) { return value } %>'),
        events: {
            'click': 'reveal',
        },
        initialize: function(){
            this.model.bind('change', this.render, this);
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('opened', this.model.get('isOpend'));
            this.$el.toggleClass('bomb',
                (this.model.get('isOpend')) && this.model.get('isMine'));
            return this;
        },
        reveal: function(){
            this.model.reveal();
        },
    });

    // var TimeStatusView = Backbone.View.extend({
    //     el: $('#time'),
    //     properties: {
    //         min: 0,
    //         sec: 0,
    //         timerId: undefined,
    //     },
    //     initialize: function(){
    //         this.startTime();
    //     },
    //     startTime: function(){
    //         var self = this;
    //         setTimeout(function(){
    //             self.countUp();
    //         }, 1000);
    //     },
    //     stopTime: function(){
    //     },
    //     countUp: function(){
    //         var prop = this.properties;
    //         prop.sec++;
    //         if(prop.sec == 60) {
    //             prop.min++;
    //             prop.sec = 0;
    //         }
    //         this.render();
    //     },
    //     render: function(){
    //         this.$el.append();
    //     }
    // });

    var GameView = Backbone.View.extend({
        el: $('#game'),
        events: {
            // 'click #validate': 'validate',
            'click #new': 'new_game',
        },
        initialize: function(){
            Cells.bind('all', this.render, this);
            Cells.bind('reset', this.reset, this);
            this.addAll();
            this.render();
        },
        reset: function(){
            this.removeAll();
            this.addAll();
            this.render();
        },
        render: function(){
            var isOpend = Cells.isOpend().length;
            var remaining = Cells.remaining().length;
            var isMine = Cells.mines;
        },
        new_game: function(){
            Cells.reset( Cells.defaults() );
        },
        addCell: function(cell) {
            var cellView = new CellView({model: cell});
            this.$('#board').append(cellView.render().el);
        },
        addRow: function(row) {
            _.each(Cells.row(row), this.addCell);
        },
        addAll: function(){
            for (var row = 0; row < Cells.y; row++) {
                this.addRow(row);
            }
        },
        removeAll: function(){
            this.$('#board b').remove();
        },
        // validate: function(){
        //     Cells.validate(true);
        // },
    });

    var Game = new GameView();

})(this);
