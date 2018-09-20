var EventCenter = {
    on: function(type, handler){
      $(document).on(type, handler)
    },
    fire: function(type, data){
      $(document).trigger(type,data)
    }
  }
//   EventCenter.on('hello', function(e,data){
//     console.log(data)
//   })
//   EventCenter.fire('hello','你好')
  

  
var footer = {
    init: function(){
        this.$footer = $('footer')
        this.bind()
        this.render()
    },
    bind: function(){
        var _this = this
        $(window).resize(function(){   // jQuery .resize()方法统计窗口大小调整的次数
            _this.setStyle()  
        })
    },
    render(){
        var _this = this
        $.getJSON('http://api.jirengu.com/fm/getChannels.php')
        .done(function(ret){
            _this.renderFooter(ret.channels)
        })
        .fail(function(){console.log('error')})
    },
    renderFooter:function(channels){
        console.log(channels)
        var html= ''
        channels.forEach(function(channel){
            html += '<li data-channels-id='+channel.channel_id+'>'
                +'<div class="cover"style="background-image:url('+channel.cover_small+')"></div>'
                + '<h3>'+channel.name+'</h3>'
                + '</li>'
        })
        this.$footer.find('ul').html(html) //jQuery .find()查找元素 .html()重写内容
    }
}
footer.init (footer)