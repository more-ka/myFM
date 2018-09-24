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
        this.isAnimate = false //动画加载过程中,不响应

        this.bind()
        this.render()
    },
    bind: function () {
        var _this = this
        _this.$rightBtn.on('click', function () {
            if(_this.isAnimate)return
            var liWidth = _this.$box.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width() / liWidth)
            if (!_this.isToEnd) {
                _this.isAnimate = true
                _this.$ul.animate({
                    left: '-=' + rowCount * liWidth
                }, 400,function(){
                    _this.isAnimate = false
                    _this.isToStart = false
                    if( parseFloat(_this.$box.width())-parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.css('width')) ){
                        _this.isToEnd = true
                    }
                })
            }
        })

        _this.$leftBtn.on('click',function(){
            if(_this.isAnimate)return
            var liWidth = _this.$box.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width() / liWidth)
            if (!_this.isToStart) {
                _this.isAnimate = true
                _this.$ul.animate({
                    left: '+=' + rowCount * liWidth
                }, 400,function(){
                    _this.isAnimate = false
                    _this.isToEnd = false
                    if( parseFloat(_this.$ul.css('left')) >=50){
                        _this.isToStart = true
                    }
                })
            }
        })

        _this.$footer.on('click','li',function(){
            $(this).addClass('active')
            .siblings().removeClass('active')
            EventCenter.fire('select-albumn',{
                channelId:$(this).attr('data-channels-id'),
                channelName:$(this).attr('data-channels-name')
            })
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
            html += '<li data-channels-id=' + channel.channel_id + ' data-channels-name='+ channel.name +'>' +
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

var Fm = {
    init: function(){
        this.$container = $('.page-music')
        this.audio = new Audio()
        this.audio.autoplay = true

        this.bind()
    },
    bind:function(){
        var _this = this
        EventCenter.on('select-albumn',function(e,channelObj){
            _this.channelId = channelObj.channelId
            _this.channelName = channelObj.channelName
            _this.loadMusic(function(){
                _this.setMusic()
            })
        })
    },
    loadMusic(callback){
        var _this = this
        $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php',{channel:this.channelId})
        .done(function(ret){
            _this.song = ret['song'][0]
            callback()
            console.log(_this.song)
        })
    },
    setMusic(){
        this.audio.src = this.song.url
        $('.bg').css('background-image','url('+this.song.picture+')')
        this.$container.find('.picture').css('background-image','url('+this.song.picture+')')
        this.$container.find('.right h1').text(this.song.title)
        this.$container.find('.right .name').text(this.song.artist)
        this.$container.find('.right .tag').text(this.channelName)
    }
}
footer.init(footer)
Fm.init()

