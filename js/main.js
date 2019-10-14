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
        _this.$rightBtn.on('click',function(){
            if(_this.isAnimate)return
            var liWidth = _this.$box.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width() / liWidth)
            if(!_this.isToEnd){
                _this.isAnimate = true
                _this.$ul.animate({
                left: '-=' + rowCount * liWidth
            },400,function(){
                _this.isAnimate = false
                _this.isToStart = false 
                if(parseFloat(_this.$box.width())-(parseFloat(_this.$ul.css('left')))>=parseFloat(_this.$ul.width())){
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
                    if( parseFloat(_this.$ul.css('left')) >=0){
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
        $.getJSON('//jirenguapi.applinzi.com/fm/getChannels.php') //jQuery中的$.getJSON( )方法函数主要用来从服务器加载json编码的数据
            .done(function (ret) {
                _this.renderFooter(ret.channels)
            })
            .fail(function () {
                console.log('error')
            })
    },
    renderFooter: function (channels) {
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
        this.$red = $('.selectorColor .red')
        this.$white = $('.selectorColor .white')
        this.$green = $('.selectorColor .green')
        this.$lyric = $('.lyric')
        this.$aquamarine = $('.selectorColor .aquamarine')
        this.barWidth = this.$container.find('.bar').width()
        this.isPlay = false
        

        this.bind()
        this.initSpeed()
        this.updateSpeed()
        this.setBlueColor()
        this.setRedColor()
        this.setWhiteColor()
        this.setGreenColor()

    },
    initSpeed:function(){
        var _this = this
        _this.$container.find('.time').text('0:00')
        _this.$container.find('.lyric p').text('')
        _this.$container.find('.insideBar').css({
            width: 0
        })
    },
    updateSpeed:function(){
        var _this= this
        _this.$container.find('.bar').on('click',function(){
        var jumpWidth = event.offsetX
        _this.audio.currentTime = _this.audio.duration *(jumpWidth/_this.barWidth)
        _this.$container.find('.insideBar').css({
            width: jumpWidth
        })
    })},
    bind:function(){
        var _this = this
        EventCenter.on('select-albumn',function(e,channelObj){
            _this.channelId = channelObj.channelId
            _this.channelName = channelObj.channelName
            _this.loadMusic(function(){
                _this.setMusic()
            })
        })
        _this.$container.find('.btn-play').on('click',function(){
            if($(this).hasClass('icon-play')){
                $(this).removeClass('icon-play').addClass('icon-pause')
                if(!this.isPlay){
                    console.log('111');
                    _this.loadMusic()
                    this.isPlay = true
                    
                }else{
                    _this.audio.play()
                }
            }else{
                $(this).removeClass('icon-pause').addClass('icon-play')
                _this.audio.pause()
            }
        })
/*
_this.$container.find('.btn-play').on('click',function(){
            if($(this).hasClass('icon-play')){
                $(this).removeClass('icon-play').addClass('icon-pause')
                _this.audio.play()
            }else{
                $(this).removeaClass('icon-pause').addClass('icon-play')
                _this.audio.pause()
            }
        })
*/
        this.$container.find('.btn-next').on('click',function(){
            _this.loadMusic()
        })
        this.audio.addEventListener('play',function(){
            clearInterval(_this.statusClock)
            _this.statusClock = setInterval(function(){
                _this.updataStatus()
            },1000)
        })
        this.audio.addEventListener('pause',function(){
            clearInterval(_this.statusClock)
        })
        this.audio.addEventListener('ended',function(){
            _this.loadMusic()
        })
    },
    loadMusic(){
        var _this = this
        _this.initSpeed()        
        $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php',{channel:_this.channelId?this.channelId:'public_tuijian_ktv'})
        .done(function(ret){
            _this.song = ret['song'][0]
            _this.setMusic()
            _this.loadLyric()
        })
    },
    loadLyric(){
        var _this = this
        $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php',{sid:this.song.sid})
        .done(function(ret){
            var lyric = ret.lyric
            var lyricObj = {}
            lyric.split('\n').forEach(function(line){
                var times = line.match(/\d{2}:\d{2}/g)
                var str = line.replace(/\[.+?\]/g,'')
                if(Array.isArray(times)){
                    times.forEach(function(time){
                        lyricObj[time] = str
                    })
                }
            })
            _this.lyricObj = lyricObj
        })
    },
    setMusic(){
        this.audio.src = this.song.url
        $('.bg').css('background-image','url('+this.song.picture+')')
        this.$container.find('.picture').css('background-image','url('+this.song.picture+')')
        this.$container.find('.right h1').text(this.song.title)
        this.$container.find('.right .name').text(this.song.artist)
        this.$container.find('.right .tag').text(this.channelName)
        this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-pause')
    },
    updataStatus(){
        var min = Math.floor(this.audio.currentTime/60)
        var second = Math.floor(this.audio.currentTime%60+1)+''
        second = second.length === 2?second:'0'+second
        this.$container.find('.time').text(min+':'+second)
        this.$container.find('.insideBar').css({width:this.audio.currentTime/this.audio.duration*100+'%'})
        var line = this.lyricObj['0'+min+':'+second]
        if(line){
        this.$container.find('.lyric p').text(line)
        }
    },
    setBlueColor(){
        this.$white.click(function(){
            this.$lyric.css({'color':'#ffffff'})
        }.bind(this))
    },
    setRedColor(){
        this.$red.click(function(){
            this.$lyric.css({'color':'#C20C0C'})
        }.bind(this))
    },
  
    setWhiteColor(){
        this.$green.click(function(){
            this.$lyric.css({'color':'#09e179'})
        }.bind(this))
    },
    setGreenColor(){
        this.$aquamarine.click(function(){
            this.$lyric.css({'color':'#01e5ff'})
        }.bind(this))
    }
}
footer.init(footer)
Fm.init()
