/**
 *
 * セルの設置
 * 爆弾の設置
 *
 * セルをクリック
 * 99bomb!! => gameover
 * 1-8個爆弾あり
 * 0なにもない
 *
 */

/**
 * CellのModel
 *
 */
(function() {
    var Cell = Backbone.Model.extend({
        defaults: {
            cellType: 0,
            group: 0,
            isOpened: false,
            isMine: false,
        },
        opened: function(){
            this.set({isOpened: !this.get('isOpened')});
        }
    });

    var Cells = Backbone.Collection.extend({
        model: Cell,
        properties: {
            cellX: 9,
            cellY: 9,
            numMines: 10,
        },
        // defaults: function(){
        // },
        initialize: function(){
            this.models = this.createCellModels();
        },
        createCellModels: function(){
            this.setMines();
            this.setCells();
        },
        setMines: function(){
            var nummines = this.properties.numMines;
            // <b class="bomb"></b>
            // if(this.model.get('isMine')){
            //     this.model.set({isMine: !this.get('isMine')});
            // }
        },
        setCells: function(){
            // for(var i=0; i<cellx * celly; i++) {
            //     var cellview = new CellView();
            //     $(this.el).append(cellview.render().el);
            // }
        }
    });
/**
 * CellのView
 *
 */
    var CellView = Backbone.View.extend({
        tagName: 'b',
        initialize: function() {
            this.render();
        },
        events: {
            'click': 'clickHandler',
        },
        clickHandler: function(){
            this.$el.addClass('opened', !this.model.get('isOpened'));
        },
        render: function() {
            return this;
        }
    });
/**
 * CellsのView
 *
 * CellsのDOM生成とイベント設定、表示変更
 */
    var CellsView = Backbone.View.extend({
        el: $('#board'),
        initialize: function(){
            this.cells = new Cells();
            this.render();
            this.addCell();
        },
        addCell: function() {
            // for(var i=0; i < cellx * celly; i++) {
            //     var cellview = new CellView();
            //     $(this.el).append(cellview.render().el);
            // }
        },
        render: function() {
            var cellx = this.cells.properties.cellX;
            var celly = this.cells.properties.cellY;
            var cellcol = [];
            for(var x = 0; x < cellx; x++){
                var cellrow = [];
                for(var y = 0; y < celly; y++){
                    cellrow.push(new Cell({x: x, y: y}));
                }
                cellcol.push(cellrow);
            }
            return this;
        }
    });
    // $('#board').append(cellsview.render().el);
    // console.log(cellsview.$el);

    var GameView = Backbone.View.extend({
        initialize: function(){
            var cellsview = new CellsView();
        },
        render: function(){
        }

    });
    var game = new GameView();
})(this);


