$(function () {

    //获取本地存储
    var loveMusic = JSON.parse(localStorage.getItem('loveMusic'));
    loveMusic = loveMusic == undefined ? [] : loveMusic;

    function move(e) {

        isTouch = true;
        //获取触碰屏幕的X坐标
        var x = e.targetTouches[0].pageX - twoWidth / 2;

        // 滑块移动范围
        var minLeft = 0;
        var maxLeft = progressWidth - twoWidth;

        //获取当前元素距离屏幕最左端的距离
        var offsetLeft = $(this).offset().left;

        //设置元素移动的距离
        var left = x - offsetLeft;

        left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;
        x0 = left;
        $two.css({
            left
        })

        //激活进度条的宽度
        var w = x - offsetLeft;

        w = w >= maxLeft ? maxLeft : w <= minLeft ? minLeft : w;

        $('.one').css({
            width: w
        })

        audio.currentTime = left / maxLeft * duration;
    }

    var audio = $('audio')[0];


    //获取音频标签
    var audio = $('audio')[0];

    //歌曲数据
    var songsDetail = [];

    //保存歌曲id
    var songsId = [];

    //歌曲播放总时间
    var duration = 0;

    //歌曲当前播放时间
    var currentTime = 0;

    var $two = $('.two');
    var twoWidth = $two.width();
    var progressWidth = $('.progress').width();
    //获取本地存储的歌曲
    var d = JSON.parse(localStorage.getItem('songs'));
    if (d) {
        songsDetail = d.playlist.tracks.concat();

        //保存歌曲id
        for (var i = 0; i < d.privileges.length; i++) {
            songsId.push(d.privileges[i].id);
        }

        $('.local-song').text(songsId.length + '首歌曲');
    } else {
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:3000/top/list?idx=1',
            success: function (data) {
                console.log(data);
                localStorage.setItem('songs', JSON.stringify(data));

                songsDetail = data.playlist.tracks.concat();

                //保存歌曲ID
                for (var i = 0; i < data.privileges.length; i++) {
                    songsId.push(data.privileges[i].id);
                }
                $('.local-song').text(songsId.length + '首歌曲');
            }
        })
    }

    $('.activate').on('click', function () {
        if ($(this).hasClass('active')) {
            return;
        } else {
            $.each($(this).siblings(), function (i, v) {
                $(v).removeClass('active');
            })
            $(this).addClass('active');
        }
    })

    audio.oncanplay = function () {
        duration = audio.duration;
        audio.play();
        $('.list-music>li.activeLi').attr('name', 1);
    }

    var musicWordHeight = parseInt($('.move-word').css('top'));
    // 监听当前歌曲的播放时间
    audio.ontimeupdate = function () {
        currentTime = audio.currentTime;
        $('.play-time>.ct').text(dealSongTime(currentTime));
        $('.play-time>.dt').text(dealSongTime(duration));
        if (!isTouch) {
            var minLeft = 0;
            var maxLeft = progressWidth - twoWidth;

            //滑块移动距离
            var x = currentTime / duration * maxLeft;

            var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
            $('.two').css({
                left
            })
            $('.one').css({
                width: x + 'px'
            })
        }

        var $ps = $('.move-word>p');

        var height = $ps.height();

        //移动歌词
        for (var i = 0; i < $ps.length; i++) {

            //获取当前p和下一个p元素
            var currentTimes = $ps.eq(i).data('time');
            var nextTime = $ps.eq(i + 1).data('time');

            if (i + 1 == $ps.length) {
                nextTime = Number.MAX_VALUE;
            }

            if (currentTime >= currentTimes && currentTime < nextTime) {
                console.log(i);
                $('.move-word').animate({
                    top: musicWordHeight - height * i + 'px'
                }, 150);

                if (i - 1 >= 0) {
                    $ps.siblings().removeClass('sactive');
                }

                $ps.eq(i).addClass('sactive');

                break;
            }

        }
    }

    //播放完成事件
    audio.onended = function () {
        var $Li = $('.list-music>li');
        console.log($Li);
        var $jihuoLi = $('.list-music>li.activeLi');
        $jihuoLi.removeClass('activeLi');
        $jihuoLi.attr('name', 0);
        var index = $jihuoLi.index();

        //更改歌曲名字信息
        $('.songName>h3').text($jihuoLi.find('span').eq(0).text());
        $('.songName>span').text($jihuoLi.find('span').eq(1).text());
        $('.headPhoto>img')[0].src = $jihuoLi.data('img');

        if ((index + 1) == $Li.length) {
            index = 0
        } else {
            index = index + 1;
        }
        $jihuoLi.find('i').css({
            background: 'url(./images/playButton.png) no-repeat',
            backgroundSize: 'cover'
        })
        $('.state').attr('src', './images/state.png');

        //播放下一首歌
        if (!$jihuoLi.hasClass('activeLi')) {
            var $nextLi = $('.list-music>li').eq(index);
            console.log($nextLi);
            var id = $nextLi.data('id');
            audio.src = 'https://music.163.com/song/media/outer/url?id=' + id;
            $('audio').attr('name', id);
            $nextLi.addClass('activeLi');
            $nextLi.find('i').css({
                background: 'url(./images/stateButton.png) no-repeat',
                backgroundSize: 'cover'
            })
            $('.state').attr('src', './images/play.png');
            audio.play();
            $nextLi.attr('name', 1);
            $('.songName>h3').text($nextLi.find('span').eq(0).text());
            $('.songName>span').text($nextLi.find('span').eq(1).text());
            $('.headPhoto>img')[0].src = $nextLi.data('img');
        }

    }

    //触碰进度条
    var isTouch = false;
    var x0 = 0;
    $('.three').on('touchstart', function (e) {
        isTouch = true;
        //获取触碰屏幕的X坐标
        var x = e.targetTouches[0].pageX;

        // 滑块移动范围
        var minLeft = 0;
        var maxLeft = progressWidth - twoWidth;


        //获取当前元素距离屏幕最左端的距离
        var offsetLeft = $(this).offset().left;

        //设置元素移动的距离
        var left = x - offsetLeft;

        left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;
        x0 = left;

        $two.css({
            left
        })

        //激活进度条的宽度
        var w = x - offsetLeft;

        w = w >= maxLeft ? maxLeft : w <= minLeft ? minLeft : w;

        $('.one').css({
            width: w
        })

        audio.currentTime = left / maxLeft * duration;
    })

    //移动进度条
    $('.three').on('touchmove', function (e) {
        //获取触碰屏幕的X坐标
        var x = e.targetTouches[0].pageX;

        // 滑块移动范围
        var minLeft = 0;
        var maxLeft = progressWidth - twoWidth;


        //获取当前元素距离屏幕最左端的距离
        var offsetLeft = $(this).offset().left;

        //设置元素移动的距离
        var left = x - offsetLeft;

        left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;
        x0 = left;

        $two.css({
            left
        })

        //激活进度条的宽度
        var w = x - offsetLeft;

        w = w >= maxLeft ? maxLeft : w <= minLeft ? minLeft : w;

        $('.one').css({
            width: w
        })
    })

    $('.three').on('touchend', function () {
        var left = x0;
        var minLeft = 0;
        var maxLeft = progressWidth - twoWidth;
        var left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;

        left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;
        x0 = left;
        $two.css({
            left
        })

        $('.one').css({
            width: left
        })

        audio.currentTime = left / maxLeft * duration;

        isTouch = false;

    })
    //保存用户可浏览的歌曲id
    var previewIds = [];
    var start = 0;
    var end = 15;


    $('.local').on('click', function (e) {

        e.stopPropagation();

        var parent = $(this).parents()[1];
        $(parent).hide();

        var $localMusic = $('.local-music');
        $localMusic.show();

        $('.songs').text(songsId.length + '首歌曲');

        if (previewIds == 0) {
            previewIds = previewIds.concat(songsId.slice(start, end))
            start = end;
            end += end;
        }

        for (var i = 0; i < previewIds.length; i++) {
            var sg = [];
            for (var j = 0; j < songsDetail[i].ar.length; j++) {
                sg.push(songsDetail[i].ar[j].name);
            }
            var $li = $(`<li data-id="${songsDetail[i].id}" data-img="${songsDetail[i].al.picUrl}" name='0'>
                            <span class="yichu">${songsDetail[i].name}</span>
                            <span class="yichu">${sg.join(' / ')}</span>
                            <i></i>
                        </li>`)

            $('.list-music').append($li);
        }
    })

    //给生成的li绑定事件
    $('.list-music').on('click', 'li', function () {

        //显示歌曲名字
        $('.songName>h3').text($(this).find('span').eq(0).text());
        $('.songName>span').text($(this).find('span').eq(1).text());
        $('.headPhoto>img')[0].src = $(this).data('img');

        if($(this).attr('data-lick') != undefined){
            $('.love')[0].src = './images/heart1.png';
        }else{
            $('.love')[0].src = './images/heart.png';
        }

        if ($(this).siblings().hasClass('activeLi')) {
            $(this).siblings().removeClass('activeLi').attr('name', 0);
            $(this).addClass('activeLi');
            $(this).siblings().find('i').css({
                background: 'url(./images/playButton.png) no-repeat',
                backgroundSize: 'cover'
            })
            $('.state').attr('src', './images/play.png');
            $(this).find('i').css({
                background: 'url(./images/stateButton.png)',
                backgroundSize: 'cover'
            })
        } else {
            $(this).addClass('activeLi');
            $(this).find('i').css({
                background: 'url(./images/stateButton.png)',
                backgroundSize: 'cover'
            })
            $('.state').attr('src', './images/play.png');
            $(this).find('i').css({
                background: 'url(./images/stateButton.png)',
                backgroundSize: 'cover'
            })
        }

        var id = $(this).data('id');
        if (id == $(audio).attr('name')) {
            if ($(this).attr('name') == 0) {
                //获取当前歌曲的ID
                audio.play();
                $(this).attr('name', 1);
                $('.state').attr('src', './images/play.png');
                $(this).find('i').css({
                    background: 'url(./images/stateButton.png)',
                    backgroundSize: 'cover'
                })
            } else {
                console.log(147)
                audio.pause();
                $(this).attr('name', 0);
                $('.state').attr('src', './images/state.png');
                $(this).find('i').css({
                    background: 'url(./images/playButton.png) no-repeat',
                    backgroundSize: 'cover'
                })
            }
        } else {
            $(audio).attr('name', id);
            audio.src = 'https://music.163.com/song/media/outer/url?id=' + id;
        }
    })

    $('.back-x').on('click', function () {
        var $x = $('.x');
        $x.show()
        var content = $('.content');
        content.hide();
    })

    $('.back').on('click', function () {
        $('.love-music').hide();
        $('.main-zinterface').show();
        $('.play-music').hide();
        if ($('.x').css('display') == 'block') {
            return;
        }
        $('.local-music').show();
    })


    $('.song-pattern').on('click', function () {
        var songs = $('.song-pattern');

        var $img1 = $(songs[0]).find('img');
        var $img2 = $(songs[1]).find('img');

        var min = $img1.data('min');
        var value = $img1.data('value');

        if (value == 3) {
            value = min;
            $img1.data('value', min);
            $img2.data('value', min);
        } else {
            x = ++value
            $img1.data('value', x);
            $img2.data('value', x);
        }

        $img1.attr('data-sign', value);
        $img2.attr('data-sign', value);
        $img1[0].src = `./images/${value}.png`;
        $img2[0].src = `./images/${value}.png`;
    })

    //上一首和下一首函数
    function lastOrnext(index) {
        var $newSong = $('.list-music>li').eq(index);
        var id = $newSong.data('id');

        //显示歌曲名字
        $('.songName>h3').text($newSong.find('span').eq(0).text());
        $('.songName>span').text($newSong.find('span').eq(1).text());
        $('.headPhoto>img')[0].src = $newSong.data('img');

        audio.src = 'https://music.163.com/song/media/outer/url?id=' + id;
        $('audio').attr('name', id);
        if ($newSong.siblings().hasClass('activeLi')) {
            $newSong.siblings().removeClass('activeLi').attr('name', 0);
            $newSong.addClass('activeLi');
            $newSong.siblings().find('i').css({
                background: 'url(./images/playButton.png) no-repeat',
                backgroundSize: 'cover'
            })
            $('.state').attr('src', './images/play.png');
            $newSong.find('i').css({
                background: 'url(./images/stateButton.png)',
                backgroundSize: 'cover'
            })
        } else {

        }
    }

    //切换歌曲也切换歌词函数
    function changeSongWord(select, id) {
        //显示歌曲名字
        $('.songName>h3').text(select.find('span').eq(0).text());
        $('.songName>span').text(select.find('span').eq(1).text());
        $('.icon')[0].src = select.data('img');

        if (select.length != 0) {
            $.ajax({
                type: 'GET',
                url: 'http://www.arthurdon.top:3000/lyric?id=' + id,
                success: function (data) {
                    console.log(111);
                    //移除歌词
                    $('.move-word').empty();
                    var lyric = data.lrc.lyric.split(/[\n\r]+/);

                    for (var i = 0; i < lyric.length; i++) {
                        var lrc = lyric[i].split(']');

                        var text = lrc[1];
                        if (text) {
                            //歌词时刻
                            var time = lrc[0].slice(1).split(':');

                            var second = Number(time[0]) * 60 + Number(time[1]);

                            var $p = $(`<p data-time="${second}">${text}</p>`)

                            $('.move-word').append($p);
                        }
                    }
                }
            })
        }
    }
    $('.next').on('click', function () {
        if ($('.list-music>li').length == 0) {
            return;
        }
        var sign = $('.song-pattern>img').data('value');
        if (sign == 1 || sign == 2) {
            var index = $('.list-music>li.activeLi').index();

            var $Li = $('.list-music>li');

            if ((index + 1) == $Li.length) {
                index = 0
            } else {
                index = index + 1;
            }
        } else {
            var index = $('.list-music>li.activeLi').index();
            var $Li = $('.list-music>li');
            if (index != Math.floor($Li.length * Math.random())) {
                index = Math.floor($Li.length * Math.random());
            }
        }
        lastOrnext(index);

        //获取激活类
        var $activeLi = $('.list-music>li.activeLi');
        var id = $activeLi.data('id');

        changeSongWord($activeLi, id)
    })

    $('.last').on('click', function () {
        if ($('.list-music>li').length == 0) {
            return;
        }
        var sign = $('.song-pattern>img').data('value');
        if (sign == 1 || sign == 2) {
            var index = $('.list-music>li.activeLi').index();

            var $Li = $('.list-music>li');

            if (index == 0) {
                index = $Li.length - 1;
            } else {
                index = index - 1;
            }
        } else {
            var index = $('.list-music>li.activeLi').index();
            var $Li = $('.list-music>li');
            if (index != Math.floor($Li.length * Math.random())) {
                index = Math.floor($Li.length * Math.random());
            }
        }
        lastOrnext(index);

        //获取激活类
        var $activeLi = $('.list-music>li.activeLi');
        var id = $activeLi.data('id');

        changeSongWord($activeLi, id)
    })

    $('.state').on('click', function () {
        // 如果没有激活的默认播放第一首
        if ($('.list-music>li').length == 0) {
            return;
        }
        var $activeLi = $('.list-music>li.activeLi');
        var index = 0;

        if ($activeLi.length == 0) {
            index = 0;
            var $newSong = $('.list-music>li').eq(index);
            var id = $newSong.data('id');

            //显示歌曲名字
            $('.songName>h3').text($newSong.find('span').eq(0).text());
            $('.songName>span').text($newSong.find('span').eq(1).text());
            $('.headPhoto>img')[0].src = $newSong.data('img');

            audio.src = 'https://music.163.com/song/media/outer/url?id=' + id;
            $('audio').attr('name', id);

            $newSong.addClass('activeLi');

            $('.state').attr('src', './images/play.png');
            $newSong.find('i').css({
                background: 'url(./images/stateButton.png)',
                backgroundSize: 'cover'
            })
        } else {
            if ($activeLi.attr('name') == 0) {
                audio.play()
                $activeLi.attr('name', 1);
                $activeLi.find('i').css({
                    background: 'url(./images/stateButton.png)',
                    backgroundSize: 'cover'
                })
                $(this).attr('src', './images/play.png');
            } else {
                audio.pause()
                $activeLi.attr('name', 0);
                $activeLi.find('i').css({
                    background: 'url(./images/playButton.png)',
                    backgroundSize: 'cover'
                })
                $(this).attr('src', './images/state.png');
            }
        }
    })

    function dealSongTime(time) {
        var second = Math.floor(time % 60);
        second = second >= 10 ? second : '0' + second;
        var minute = Math.floor(time / 60);
        minute = minute >= 10 ? minute : '0' + minute;

        return minute + ':' + second;
    }
    $('.homePage').on('click', function () {

        $('.main-zinterface').hide();
        $('.play-music').show();
        $('.local-music').hide();
        //获取激活类
        var $activeLi = $('.list-music>li.activeLi');
        var id = $activeLi.data('id');

        if ($activeLi.length != 0) {
            //显示歌曲名字
            $('.songName>h3').text($activeLi.find('span').eq(0).text());
            $('.songName>span').text($activeLi.find('span').eq(1).text());
            $('.icon')[0].src = $activeLi.data('img');
        }

        if ($activeLi.length != 0) {
            $.ajax({
                type: 'GET',
                url: 'http://www.arthurdon.top:3000/lyric?id=' + id,
                success: function (data) {

                    //移除歌词
                    $('.move-word').empty();
                    var lyric = data.lrc.lyric.split(/[\n\r]+/);

                    for (var i = 0; i < lyric.length; i++) {
                        var lrc = lyric[i].split(']');

                        var text = lrc[1];
                        if (text) {
                            //歌词时刻
                            var time = lrc[0].slice(1).split(':');

                            var second = Number(time[0]) * 60 + Number(time[1]);

                            var $p = $(`<p data-time="${second}">${text}</p>`)

                            $('.move-word').append($p);
                        }
                    }
                }
            })
        }
    })
    
    $('.love').on('click',function (){
        if ($('.list-music>li').length == 0) {
            return;
        }
        //获取正在播放的歌曲；
        var $activeLi = $('.list-music>li.activeLi');
        
        if($activeLi.length == 0){
            return;
        }
        if($activeLi.attr('data-lick') == undefined || $activeLi.attr('data-lick') == ''){
           $activeLi.attr('data-lick', 'lick');
            this.src = './images/heart1.png';

            var id = $activeLi.data('id');
            var img = $activeLi.data('img');
            var musicName = $activeLi.find('span').eq(0).text();
            var singer = $activeLi.find('span').eq(1).text();

            var o = {
                id,
                img,
                musicName,
                singer
            }

            loveMusic.push(o);
        }else{
            $activeLi.attr('data-lick','');
            this.src = './images/heart.png';

            for(var i = 0; i < loveMusic.length; i++){
                if($activeLi.data('id') == loveMusic[i].id){
                    loveMusic.splice(i, 1);
                }
            }
        }
        localStorage.setItem('loveMusic', JSON.stringify(loveMusic));
    })


    $('.lick').on('click', function () {
        var parent = $(this).parents()[1];
        $(parent).hide();
        var $loveMusic = $('.love-music');
        $loveMusic.show();
        
        $('.like-list-music').html('');

        for(var i = 0; i < loveMusic.length; i++){
            var $li = $(`<li data-id="${loveMusic[i].id}" data-img="${loveMusic[i].img}">
                            <span>${loveMusic[i].musicName}</span>
                            <span>${loveMusic[i].singer}</span>
                            <i></i>
                        </li> `)
            $('.like-list-music').append($li);
        }
    });
})