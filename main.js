var EventCenter = {
    on: function (type, headler) {
        $(document).on(type, headler)
    },
    fire: function (type, headler) {
        $(document).trigger(type, headler)
    }
}
//   EventCenter.on('hello', function(e,data){
//     console.log(data)
//   })
//   EventCenter.fire('hello','你好')



var footer = {
    init: function () {
        this.$footer = $('footer')
        this.$ul = this.$footer.find('ul')
        this.$box = this.$footer.find('.box')
        this.$leftBtn = this.$footer.find('.buttonLeft')
        this.$rightBtn = this.$footer.find('.buttonRight')
        this.isToEnd = false
        this.isToStart = true
        this.bind()
        this.render()
    },
    bind: function () {
        var _this = this
        this.$rightBtn.on('click', function () {
            var liWidth = _this.$box.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width() / liWidth)
            if (!_this.isToEnd) {
                _this.$ul.animate({
                    left: '-=' + rowCount * liWidth
                }, 400,function(){
                    _this.isToStart = false
                    if( parseFloat(_this.$box.width())-parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.css('width')) ){
                        _this.isToEnd = true
                    }
                })
            }
        })

        this.$leftBtn.on('click',function(){
            var liWidth = _this.$box.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width() / liWidth)
            if (!_this.isToStart) {
                _this.$ul.animate({
                    left: '+=' + rowCount * liWidth
                }, 400,function(){
                    _this.isToEnd = false
                    if( parseFloat(_this.$ul.css('left')) >=50){
                        _this.isToStart = true
                    }
                })
            }
        })

        this.$footer.on('click','li',function(){
            $(this).addClass('active')
            .siblings().removeClass('active')
            EventCenter.fire('select-albumn',$(this).attr('data-channels-id'))
        })
    },
    render() {
        var _this = this
        $.getJSON('http://api.jirengu.com/fm/getChannels.php') //jQuery中的$.getJSON( )方法函数主要用来从服务器加载json编码的数据
            .done(function (ret) {
                _this.renderFooter(ret.channels)
            })
            .fail(function () {
                console.log('error')
            })
    },
    renderFooter: function (channels) {
        console.log(channels)
        var html = ''

        channels.forEach(function (channel) {
            html += '<li data-channels-id=' + channel.channel_id + '>' +
                '<div class="cover" style="background-image:url(' + channel.cover_small + ')"></div>' +
                '<h3>' + channel.name + '</h3>' +
                '</li>'
        })
        this.$ul.html(html) //jQuery .find()查找元素 .html()重写内容
        this.setStyle()
    },
    setStyle: function () {
        var count = this.$footer.find('li').length
        var width = this.$footer.find('li').outerWidth(true)
        this.$ul.css({
            width: count * width + 'px'
        })
    }
}

var app = {
    init: function(){
        this.bind()
    },
    bind:function(){
        EventCenter.on('select-albumn',function(e,data){
            console.log('select',data)
        })
    }
}
footer.init(footer)
app.init()

