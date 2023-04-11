function createVideo(source,format,platform,roomid) {       
  const controls = [
    'play-large', // The large play button in the center
    // 'restart', // Restart playback
    'rewind', // Rewind by the seek time (default 10 seconds)
    'play', // Play/pause playback
    'fast-forward', // Fast forward by the seek time (default 10 seconds)
    'progress', // The progress bar and scrubber for playback and buffering
    'current-time', // The current time of playback
    'duration', // The full duration of the media
    'mute', // Toggle mute
    'volume', // Volume control
    'captions', // Toggle captions
    'settings', // Settings menu
    // 'pip', // Picture-in-picture (currently Safari only)
    'airplay', // Airplay (currently Safari only)
    // 'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
    'fullscreen' // Toggle fullscreen
  ];

  const i18n =  {
    restart: '重播',
    rewind: 'Rewind {seektime}s',
    play: '播放',
    pause: '暂停',
    fastForward: 'Forward {seektime}s',
    seek: 'Seek',
    seekLabel: '{currentTime} of {duration}',
    played: 'Played',
    buffered: 'Buffered',
    currentTime: 'Current time',
    duration: 'Duration',
    volume: 'Volume',
    mute: 'Mute',
    unmute: 'Unmute',
    enableCaptions: '开启',
    disableCaptions: '关闭',
    download: '下载',
    enterFullscreen: 'Enter fullscreen',
    exitFullscreen: 'Exit fullscreen',
    frameTitle: 'Player for {title}',
    captions: '字幕',
    settings: '设置',
    pip: '旋转',
    menuBack: 'Go back to previous menu',
    speed: '速度',
    normal: '正常',
    quality: '画质',
    loop: '循环',
    start: '开始',
    end: '结束',
    all: '全部',
    reset: 'Reset',
    disabled: '关闭',
    enabled: '开启',
    advertisement: 'Ad',
    qualityBadge: {
      2160: '4K',
      1440: 'HD',
      1080: 'HD',
      720: '',
      576: '',
      480: '',
    },
  };
  const speed = { selected: 1, options: [0.5, 1, 1.5 , 2, 4] };
  const settings = ['captions', 'quality', 'speed', 'loop'];
  const autoplay = true;
  const captions = { active: true, language: 'auto', update: true }
  const ratio = '16:9';
  const fullscreen = { enabled: true, fallback: true, iosNative: true, container: null }
  // const keyboard = {  focused: true, global: true  }
  const player = new Plyr('#player', { controls,settings,autoplay,ratio,i18n,speed,captions,fullscreen});
  // var a =  parent.document.getElementById('progress')
  // a.style='opacity:0;'
  player.on('error',(event) => {
    initVideo();
  });
  player.on('stalled',(event)=>{
    initVideo();
  });
  var video = document.querySelector('#player');
  console.log(format)
  switch (true) {
    case format =='m3u':
      // For more Hls.js options, see https://github.com/dailymotion/hls.js
      var hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
      break;
    case format =='flv':
      console.log("flv播放器")
      const flvPlayer = flvjs.createPlayer(
      {
        type: 'flv',
        url: source,
      },
      {
        enableStashBuffer:false,
        enableWorker:false,
        autoCleanupSourceBuffer:true,
        autoCleanupMaxBackwardDuration:10800, //60*60*3
        autoCleanupMinBackwardDuration:7200, //60*60*2
      }
      );
      flvPlayer.attachMediaElement(video);
      flvPlayer.load();
      // buttonSeeking = document.getElementById('seeking')
      // buttonSeeking.addEventListener('click',function()
      // {
      //   console.log("后退")
      //   flvPlayer.currentTime = (player.currentTime-10);
      //   console.log("后退")
      // })
     
      // rewind = document.querySelector('[data-plyr="rewind"]')
      // rewind.addEventListener('click', () => {
      //   flvPlayer.currentTime -= 10;
      // });
      // forward = document.querySelector('[data-plyr="fast-forward"]')
      // forward.addEventListener('click', () => {
      //   flvPlayer.currentTime += 10;
      // });
      flvPlayer.on(flvjs.Events.ERROR, (e) => {
        // destroy
        flvPlayer.pause();
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();      
        // 进行重建的逻辑，这里不再展开
        initVideo();
      });
      break;
    default:
      video.src = source;
      break;
  }
//   console.log(source)
  // if(flvjs.isSupported())
  // {
  //   const flvPlayer = flvjs.createPlayer(
  //   {
  //     type: 'flv',
  //     isLive: true,
  //     url: source,
  //     hasAudio: true,
  //     hasVideo:true,
  //   },
  //   {
  //       enableStashBuffer: true,
  //       fixAudioTimestampGap:false,
  //   }
  //   );
  //   flvPlayer.attachMediaElement(video);
  //   flvPlayer.load();
  // }
  // else
  // {
  //   video.src = source;
  // }
  // if (!Hls.isSupported()) {
  //       video.src = source;
  // } 
  // else{
  //       // For more Hls.js options, see https://github.com/dailymotion/hls.js
  //       var hls = new Hls();
  //       hls.loadSource(source);
  //       hls.attachMedia(video);
  // }]
  // -----------全局变量-------------------------
  const track = video.addTextTrack('subtitles', '中文', 'zh');
  var socket = io();
  dmList = []
  // ------------------------------------
  // -----------心跳包-----------
  window.setInterval(function() {
    socket.emit('my_ping');
}, 1000);
socket.on('my_pong', function() { });
// ------------------------------------

  window.onunload=()=>{
    var msg = makeData({"roomid":String(v)})
    socket.emit('stopDm', msg);
    return false;
  }
  
  socket.on('getDm response', function(msg) {
      // console.log(msg.data)
      retMsg = receviceData(msg)
        if(retMsg.status==503)
        {
            return
        }
        if(retMsg.status==404)
        {
          // console.log(retMsg.data)
            return
        }
        costTime = (Date.now()/1000 - sendTime)
        retMsg.data['costTime'] = costTime
        dmList.push(retMsg.data)
    });
  player.on('loadeddata', (event) => {
          // console.log("load")
          const instance = event.detail.plyr;
          if(platform!="douyin")
          {
            updatedanmmu(instance,socket,platform,roomid)
          }
          videoStartTime =Date.now()/1000
  });
      
  player.on('pause', (event) => {
      clearInterval(window.timer)
      clearInterval(window.showTracktimer)
  });
  player.on('play', (event) => {
      const instance = event.detail.plyr;
      // 更新字幕
      if(platform!='douyin')
      {
        window.timer = setInterval(function() {
          updatetrack(instance,socket,track,roomid);
        },500) 
        window.showTracktimer = setInterval(function() {
          showTrack(dmList,player,track)
        },300)
      }
  }); 
 

  player.on('timeupdate', (event) => {
      try {
        const instance = event.detail.plyr;
        duration = Date.now()/1000 - videoStartTime
        instance.setduration=duration
        if(duration - instance.currentTime < 0.1)
        {
          instance.speed = 1
        }
      } catch (error) {
        console.log(error)
      }  
    
  });
}
function showTrack(dmList,player,track)
{
  showNum = 0
  for (let index = 0; index < dmList.length; index++) {
    var element = dmList[showNum];
    if(dmList.length>0)//显示
    {
      showNum+=1
    }
    else
    {
      //未显示 不处理
      break
    }
    if(showNum>8)
    {
      dmList.shift();
      showNum -= 1;
    }
  }
  // 清空轨道
  for (let index = 0; 0!=track.cues.length; index++) {
    var element = track.cues[0];
    track.removeCue(element)
  }
  for (let index = 0; index < showNum; index++)
  { 
    var element = dmList[index];
    track.addCue(new VTTCue(player.currentTime, 3600, element['content']));
  }

  // if(showNum==0)
  // {
  //   for (let index = 0; index < dmList.length; index++)
  //   {
  //     var element = dmList[index];
  //     track.addCue(new VTTCue(element['from']-element['costTime'], 3600, element['content']));
  //   }
  // }
  // else
  // {
    
  // }
}
function updatedanmmu(instance,socket,platform,roomid)
      {
        timestamp = Date.now()/1000
        switch (true) {
        case platform =='huya'||platform =='douyu':
          targeturl = "https://www."+platform+".com/"+roomid
          break;
        case platform =='cc':
          targeturl = "https://cc.163.com/"+roomid+"/"
          break;
        default:
          return;
      }
        
        senddata = [instance.currentTime,timestamp,targeturl]
        var msg = makeData({"data":senddata})
        socket.emit('startDm', msg);
        return false;
        // $.post("/startdm",msg,function(data){    
        //     retMsg = receviceData(data)
        //     if(retMsg.status==503)
        //     {
        //         return
        //     }
        //     if(retMsg.status==404)
        //     {
        //         alert(data.msg)
        //         return
        //     }
        //   })
        // getJson('d'+String(data).length+data)
}

function updatetrack(instance,socket,track,roomid)
      {
        
        // video = document.querySelector('video');
        // const track = document.createElement('track');
        // Object.assign(track, {
        //   label: '中文',
        //   srclang: 'zh',
        //   default: true,
        //   src: "static/vtt/"+roomid+'.vtt',
        //   id : "new"
        // });
        // video.appendChild(track);
        // const oldtracks = document.getElementsByTagName('track');  
        // if(oldtracks.length > 2)
        //   video.removeChild(oldtracks[0])
        // var msg = makeData({"roomid":roomid,'currentTime':instance.currentTime})
        // $.post("/getdm",msg,function(data){    
        //     retMsg = receviceData(data)
        //     if(retMsg.status==503)
        //     {
        //         return
        //     }
        //     if(retMsg.status==404)
        //     {
        //       console.log(data.msg)
        //         return
        //     }
        //     // console.log("更新",retMsg.msg['content'].length,retMsg.msg['from'], retMsg.msg['to'])
        //     $.each(retMsg.msg['content'],function(infoIndex,info){
        //       track.addCue(new VTTCue(retMsg.msg['from'], retMsg.msg['to'], info));
        //     })
        // })
        sendTime = Date.now()/1000
        var msg = makeData({"roomid":roomid,'currentTime':instance.currentTime,'sendTime':sendTime})
        socket.emit('getDm', msg);
        return false;
      }
function downVideo (url){
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.responseType = 'arraybuffer';    // 返回类型blob
xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
                alert('ok')
    }
    else
    {
    alert('false')
    }
};
}
function NetPing(videoUrl) {
    $.ajax({
    type: 'get',
    cache: false,//true的话会读缓存,第二次的时候得到的是上次访问的结果，而不是重新到服务器获取。false的话会在url后面加一个时间缀，让它跑到服务器获取结果。cache只有GET方式的时候有效。
    url: videoUrl, //url地址
    dataType: "jsonp", //跨域采用jsonp方式
    processData: false,//processData 默认为true，当设置为true的时候,jquery ajax 提交的时候不会序列化 data，而是直接使用data，false会序列化。
    timeout:3000,//设置超时 ‘0’：为永不超时，当请求超时后会进入error，可以在error中做超时的处理。
    complete: function (data) {
        //data.status 请求url地址的状态码，以此来判断url是否有效可以访问。
        if (data.status==200) {            
          alert(1);
        } else {
          alert(2);
        }
    },
    error:function (){
      alert(3);
    }
});
}
function getOperationSys() {
  //判断数组中是否包含某字符串 
  Array.prototype.contains = function(needle) {
    for (i in this) {
        if (this[i].indexOf(needle) > 0)
            return i;
    }
    return -1;
  }
  var device_type = navigator.userAgent; //获取userAgent信息 
  var md = new MobileDetect(device_type); //初始化mobile-detect 
  var os = md.os(); //获取系统 
  var model = "";
  if (os == "iOS") { //ios系统的处理 
    os = md.os() + md.version("iPhone");
    model = md.mobile();
  } else if (os == "AndroidOS") { //Android系统的处理 
    os = md.os() + md.version("Android");
    var sss = device_type.split(";");
    var i = sss.contains("Build/");
    if (i > -1) {
        model = sss[i].substring(0, sss[i].indexOf("Build/"));
    }
  }
    return model;
}
function initVideo()
{
// var v = UrlParam.paramValues("v");
// getJson('v'+String(v).length+v).then((data)=>{
//   createVideo(data)
// })
var v = String(UrlParam.paramValues("v"));
var p = String(UrlParam.paramValues("p"));
// url = `http://127.0.0.1:8282/${p}/${v}/flv/refresh`
// url = 'https://realurl.tomdejio.repl.co/'+p+'/'+v;
// var loading = document.getElementById("loading");
// loading.style.display = 'none'
// createVideo(url,p,v);
// var OS = getOperationSys()
// if(OS == 'iPhone'|| OS == 'iPod' || OS == 'iPad')
// {
//   format = 'm3u';
// }
// else
// {
//   format = 'flv';
// }
var socket = io();
format = 'flv';
var msg =  makeData({"platform":p,'roomid':v,'format':format})
socket.emit('getlink', msg);
socket.on('getlink response', function(msg) {
  // console.log(msg.data)
  retMsg = receviceData(msg)
    if(retMsg.status==503)
    {
        return
    }
    if(retMsg.status==404)
    {
      console.log(retMsg.data)
        return
    }
    var loading = document.getElementById("loading");
    loading.style.display = 'none'
      data = retMsg.data
      createVideo(data['url'],data['format'],p,v);
    socket.disconnect()
    return false
});
}

// 初始化视频
initVideo();