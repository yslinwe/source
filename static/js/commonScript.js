// var menuIcon = document.querySelector(".menu-icon");
// var sidebar = document.querySelector(".sidebar");
// var container  = document.querySelector(".container");

// menuIcon.onclick = function(){
//     sidebar.classList.toggle("small-siderbar");
//     container.classList.toggle("large-container")
// }
// var searchIcon = document.querySelector(".search-icon");
// var searchBox = document.querySelector(".search-box");
// var searchBoxInput = document.querySelector(".search-box-input");
// // var container  = document.querySelector(".container");

// searchIcon.onclick = function(){
//     searchBox.classList.toggle("open-search-box");
//     searchBoxInput.classList.toggle("open-search-box-input")
// }
// --------------------------------------------
//init()
// --------------------------------------------

function init()
{
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    if(w>900)
    {
        document.getElementsByClassName("search-icon")[0].setAttribute("src",'static/images/search.png')

    }
    else
    {
        document.getElementsByClassName("search-icon")[0].setAttribute("src",'static/images/return.png')
    }
}
//---------------------搜索页面-----------------------
function SearchFunction() 
{
    // 声明变量
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
    // 循环所有列表，查找匹配项
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1 && filter!='') {
            li[i].style.display = 'inline'
        }
        else
        {
            li[i].style.display = 'none'
        }
    }
}
// ----------------打开搜索结果页面-------------------------
function OpenWinFunction()
{

    var input, filter;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    if(filter!='')
    {
        goUrl = "search?s="+filter;
        window.open(goUrl,'_self');
    }
    
}
function OpenWinByfilter(element)
{
    filter = element.innerHTML
    goUrl = "search?s="+filter.replace("#","")
    window.open(goUrl,'_self');
}

function OpenVideo(id)
{
    var lists = document.getElementsByClassName('side-video-list sider1-side-video-list')
    var videoE = document.getElementById('video')
    if(videoE.src.search(id) == -1)
    {
        videoE.src='video.html?v='+id;
    }
    for(var i = 0;i<lists.length;i++)
    {
        if(lists[i].id==id)
        {
            lists[i].classList.add("side-video-list_click")
            lists[i].getElementsByTagName('p')[0].innerHTML = '▶'
        }
        else
        {
            lists[i].classList.remove("side-video-list_click")
            lists[i].getElementsByTagName('p')[0].innerHTML = i+1
        }
    }
}
function Open()
{
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    if(w>900)
    {
        if(document.getElementsByClassName("search-icon")[0].getAttribute("src")== "static/images/return.png")
            document.getElementsByClassName("search-icon")[0].setAttribute("src",'static/images/search.png')
        OpenWinFunction()
    }
    else
    {
        document.getElementsByClassName("search-icon")[0].setAttribute("src",'static/images/return.png')
        var middle = document.querySelector(".nav-middle");
        middle.classList.toggle("open-nav-middle");
    }
   
}

function OpenSideWin()
{
    sidebar = document.getElementById("sidebar1");
    sidebar.classList.toggle("siderbardisplay");
    sidebar = document.querySelector("#showfile");
    if(sidebar.innerHTML == "显示文件列表")
        sidebar.innerHTML = "隐藏文件列表";
    else
        sidebar.innerHTML = "显示文件列表";
}
function ArrayQueue(){  
    var arr = [];  
        //入队操作  
    this.push = function(element){  
        arr.push(element);  
        return true;  
    }  
        //出队操作  
    this.pop = function(){  
        return arr.shift();  
    }  
        //获取队首  
    this.getFront = function(){  
        return arr[0];  
    }  
        //获取队尾  
    this.getRear = function(){  
        return arr[arr.length - 1]  
    }  
        //清空队列  
    this.clear = function(){  
        arr = [];  
    }  
        //获取队长  
    this.size = function(){  
        return length;  
    }  
}
var getJsonArray = new ArrayQueue();
 /**
     * [Queue]
     * @param {[Int]} size [队列大小]
     */
async function getJson(name)
{
    // var JsonStr = localStorage.getItem(name)
    // if(JsonStr!=null)
    // {
    //     obj = JSON.parse(JsonStr);
    //     return obj;
    // }
    let promise = new Promise((resolve,reject)=>{ 
        ws = new WebSocket("ws://127.0.0.1:50006");
            // ws.onmessage = function (evt) {
            //     // im.src = "data:image/png;base64," + evt.data;
            //     alert(String(evt.data).length);
            // }
            
            // ws.onopen=function(){
            //     ws.send('0');
            // }
        // }
        //心跳检测  .所谓的心跳检测，就是隔一段时间向服务器仅限一次数据访问，因为长时间不使用会导致ws自动断开，
        // 一般是间隔90秒内无操作会自动断开，因此，在间隔时间内进行一次数据访问，以防止ws断开即可，
        //这里选择30秒，倒计时30秒内无操作则进行一次访问，有操作则重置计时器
        //
        //封装为键值对的形式，成为js对象，与json很相似
        var heartCheck = {
        timeout: 30000,//30秒
        timeoutObj: null,
        reset: function () {//接收成功一次推送，就将心跳检测的倒计时重置为30秒
            clearTimeout(this.timeoutObj);//重置倒计时
            this.start();
        },
        start: function () {//启动心跳检测机制，设置倒计时30秒一次
            this.timeoutObj = setTimeout(function () {
            var message = '-1';
            ws.send(message);//启动心跳
            }, this.timeout)
        }
        //onopen连接上，就开始start及时，如果在定时时间范围内，onmessage获取到了服务端消息，
        // 就重置reset倒计时，距离上次从后端获取消息30秒后，执行心跳检测，看是不是断了。
        };
        // ---- ...
        // socket
        ws.onopen = function () {
            //当WebSocket创建成功时，触发onopen事件
            ws.send(name); //将消息发送到服务端
            heartCheck.start();//连接成功之后启动心跳检测机制
        }
        ws.onmessage = function (e) {
        //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
        var data = JSON.parse(e.data);
        // localStorage.setItem(name,e.data)
        heartCheck.reset();
            
        //接收一次后台推送的消息，即进行一次心跳检测重置
        resolve(data)
        }
    });
    // getJsonArray.push(promise)
    let result = await promise;
    return result;
} 
// window.addEventListener('resize', () => { //监听浏览器窗口大小改变
//     watchChangeSize()
// });

// function watchChangeSize (){
//     var sider = document.getElementById("sidebar1");
//     var vid = document.getElementsByClassName('fitVids-wrapper')[0]
//     if (sider.offsetHeight!=vid.offsetHeight&&window.innerWidth>900)
//     {
//         var h = String(parseInt(vid.offsetHeight)-30)+"px";
//         sider.offsetHeight = h;
//         sider.style.minHeight = h;
//         sider.style.maxHeight = h;
//     }
//     else
//     {
//         sider.style.minHeight = '500px'
//         sider.style.maxHeight = '500px'
//     }
// }
// ----------------搜索索引-------------------
// $(function(){
//     $.getJSON('json/index.json',function(data){
//     var $jsontip = $("#myUL");
//     var strHtml = "";//存储数据的变量
//     $jsontip.empty();//清空内容
//     $.each(data,function(infoIndex,info){
//         if(info['name'] != '已经删除')
//             strHtml +=
//             '<li><a href="'+ "play-video.html?v="+info["linkid"] +'">'+info["folderName"]+'</a></li>'
//     })
//     $jsontip.html(strHtml);//显示处理后的数据
    
//     })
    
// })
function siderControl()
{
    var uploadIcon = document.querySelector(".uploadIcon");
    var sideClose = document.querySelector(".side-close") 
    var sidebar = document.querySelector(".bg");
    var sideInputButton = document.querySelector(".sidebar>.side-input>button");
    var sideDelButtons = document.querySelectorAll("#subscribed-list>div>button");
    // sidebar.onclick = function(){
    //     sidebar.classList.toggle("small-siderbar");
    //     document.body.style = "overflow: auto;height: 100%;"
    // }
    uploadIcon.onclick = function(){
        sidebar.classList.toggle("small-siderbar");
        document.body.style = "overflow-y: hidden;height: 100%;"
    }
    sideClose.onclick = function(){
        sidebar.classList.toggle("small-siderbar");
        document.body.style = "overflow: auto;height: 100%;"
    }
    sideInputButton.onclick = function(){
        var sideInputValue = document.querySelector(".sidebar>.side-input>input").value;
        console.log(sideInputValue)
        sidebar.classList.toggle("small-siderbar");
        document.body.style = "overflow: auto;height: 100%;"

        var msg = makeData({"url":sideInputValue})
        $.post("/add",msg,function(data){   
            console.log(data)
            if(sessionStorage.getItem("currentPage") == "index")
                updateInfoIndexAll(data)
            else
                updateIndexPlaySideAll(data)
        })
        // getJson("a"+String(sideInputValue).length+sideInputValue).then((data)=>
        // {
        //     location.reload();
        // })
    }
    sideDelButtons.forEach(sideDelButton => {     
        sideDelButton.onclick=function(){
            sidebar.classList.toggle("small-siderbar");
            document.body.style = "overflow: auto;height: 100%;"
            var msg = makeData({"url":sideDelButton.value})
            $.post("/del",msg,function(data){    
                if(sessionStorage.getItem("currentPage") == "index")
                    updateInfoIndexAll(data)
                else
                    updateIndexPlaySideAll(data)
            })
            // getJson("r"+String(sideDelButton.value).length+sideDelButton.value).then((data)=>
            // {
            //     location.reload();
            // })
        }
    });
}
function mainButtonStyleControl()
{
    var mainButtons = document.querySelectorAll("#mainButton > button");
    mainButtons.forEach(mainButton => {     
        mainButton.onclick=function(){
        for(var i = 0;i<mainButtons.length;i++)
        {
            if(mainButtons[i] == mainButton)
            {
                // mainButton.style='color:var(--keepthemecolor);background-color:var(--firsttextcolor)'
                if(!mainButtons[i].classList.contains('fristButton'))
                    addInfoStrHtml(mainButton.innerHTML)
                mainButtons[i].classList.remove('normalButton');
                mainButtons[i].classList.add('fristButton');
            }
            else
            {
                mainButtons[i].classList.remove('fristButton');
                mainButtons[i].classList.add('normalButton');
                // mainButtons[i].classList.toggle('normalButton')
                // mainButtons[i].style='color:var(--firsttextcolor);background-color:var(--button-color);'
            }
        }
    }
    })
}
function updateIndexPlaySideAll(data)
{
    retMsg = receviceData(data)
        if(retMsg.status==503)
        {
            return
        }
        if(retMsg.status==404)
        {
            alert(data.msg)
            return
        }

        var $jsontip = $("#sidebar");
        var strHtml = "";//存储数据的变量
        $jsontip.empty();//清空内容
        var $sidertip = $("#subscribed-list");
        var siderHtml = "";//存储数据的变量
        $sidertip.empty();
        $.each(retMsg.msg,function(infoIndex,info){
            if(info['folderName'] != '已经删除' && fristLinkId != info['linkid'])
            if(info['liveStatus'] == "ON")
            {
                strHtml +=
                    "<div class='side-video-list'>"
                // +"<input type='image' img src='' data-src='"+ info["thumbUrl"] +"' class='small-thumbnail'>"
                +"<a id='livethumbLink' href='" + "play?p="+info["platform"]+"&v="+info["linkid"]+"'class='small-thumbnail'>"
                +"<div class='box'><img id = 'thumbUrl' src='' data-src='"+ info["thumbUrl"] +"'></div>"   
                +"</a>"
                +"<div class='vid-info'>"
                    +"<a id='liveWordLink' href='"+ "play?p="+info["platform"]+"&v="+info["linkid"]+"'>"+info["folderName"]+"</a>"
                    // +"<input type='text' value="+info["name"]+" onclick={OpenVideo('"+info['linkid']+"')} >"
                    +"<p id ='achorname'>"+info["achorname"]+"</p>"
                    +"<span id='liveinfos'>"
                    +"<i></i><p>"+info["totalCount"]+"</p>"
                    +"</span>"
                    +"<p style='background: rgb(204 0 0 / 90%)' class='livestatus'>直播中<p/>"
                +"</div>"
                +"</div>";
                siderHtml +=
                "<div class='sideinfo'>"
                +"<a href='play?p="+info["platform"]+"&v="+info["linkid"]+"'>"
                    +"<div class='addedinfo'>"
                        +"<div class='avatarinfo'><img src='' data-src='"+info['avatar-img']+"'><div class='liveLight'></div></div>"
                        +"<p>"+info["achorname"]+"</p>"
                    +"</div>"
                    +"</a>"
                    +"<button value="+info['link']+">删除</button>"
                +"</div>"
            }
            else
            {
                strHtml +=
                "<div class='side-video-list'>"
            // +"<input type='image' img src='' data-src='"+ info["thumbUrl"] +"' class='small-thumbnail'>"
            +"<a id='livethumbLink' href='" + "play?p="+info["platform"]+"&v="+info["linkid"]+"'class='small-thumbnail'>"
            +"<div class='box'><img id = 'thumbUrl' src='' data-src='"+ info["thumbUrl"] +"' alt="+info["linkid"]+"></div>"   
            +"</a>"
            +"<div class='vid-info'>"
                +"<a id='liveWordLink' href='"+ "play?p="+info["platform"]+"&v="+info["linkid"]+"'>"+info["folderName"]+"</a>"
                // +"<input type='text' value="+info["name"]+" onclick={OpenVideo('"+info['linkid']+"')} >"
                +"<p id ='achorname'>"+info["achorname"]+"</p>"
                +"<span id='liveinfos'>"
                +"<p>上次开播: "+info["created_at"]+"</p>"
                +"</span>"
                +"<p style='background: #909090' class='livestatus'>未直播<p/>"
            +"</div>"
            +"</div>";
            siderHtml +=
            "<div class='sideinfo'>"
            +"<a href='play?p="+info["platform"]+"&v="+info["linkid"]+"'>"
                +"<div class='addedinfo'>"
                    +"<img src='' data-src='"+info['avatar-img']+"'>"
                    +"<p>"+info["achorname"]+"</p>"
                +"</div>"
                +"</a>"
                +"<button value="+info['link']+">删除</button>"
            +"</div>"
            }
        })
        $sidertip.html(siderHtml);
        $jsontip.html(strHtml);//显示处理后的数据

        lazyImages()
        $("#progress").addClass("done");
        siderControl()
  
        id = sessionStorage.getItem('setIntervalId');
        if(id!=-1)
        {
            sessionStorage.setItem('setIntervalId',-1);
            clearInterval(id);
        }
        var socket = io();
        sideLiveInfos = document.querySelectorAll(".vid-info>#liveinfos")
        livestatusWords = document.querySelectorAll(".vid-info>.livestatus")
        livestatusThumbs = document.querySelectorAll("#thumbUrl")
        achornames = document.querySelectorAll('#achorname')
        livethumbLinks = document.querySelectorAll('#livethumbLink')
        liveWordLinks = document.querySelectorAll('#liveWordLink')
        id = setInterval(function(){
            var msg = makeData({"name":"index"})
            socket.emit('getIndex', msg);
            return false;
        },Math.random()*30000+30000)        //(m-n)+n)大于等于n，小于m (60-30)+30 Math.random()*30000+30000
        socket.on('index response', function(msg) {
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
                addindex = 0
                $.each(retMsg.data,function(infoIndex,info)
                {
                    if(info["linkid"]== fristLinkId)
                    {
                        addindex = -1
                         //更新视频信息    
                        if(info['liveStatus'] == "ON")    
                        {
                            document.getElementById('totalCount').innerText = info["totalCount"];
                            document.getElementById('createTime').innerText = "• "+info["category"]+" • 开播时间："+info["created_at"];
                        }
                        else
                        {
                            document.getElementById('liveStatusInfo').innerHTML = "";
                            document.getElementById('createTime').innerText = info["category"]+" • 上次开播："+info["created_at"];
                        }
                        document.title = info['folderName'];
                        document.getElementById('vid-title').innerText=info['folderName'];
                        document.getElementById('subscribe').innerText = info['subscribe'];
                        document.getElementById('welcomeText').innerHTML = info['welcomeText'];
                    }
                    else
                    {
                        sideLiveInfo = sideLiveInfos[infoIndex+addindex]
                        livestatusWord = livestatusWords[infoIndex+addindex]
                        livestatusThumb = livestatusThumbs[infoIndex+addindex]
                        achorname = achornames[infoIndex+addindex]
                        livethumbLink = livethumbLinks[infoIndex+addindex]
                        liveWordLink = liveWordLinks[infoIndex+addindex]
                            //更新侧边栏视频信息    
                        
                        if(info['liveStatus'] == "ON")    
                        {
                            sideLiveInfo.innerHTML = "<i></i><p>"+info["totalCount"]+"</p>";
                            livestatusWord.innerText = "直播中";
                            livestatusWord.style = "background: rgb(204 0 0 / 90%)";
                            achorname.innerText = info["achorname"];
                            livethumbLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"];
                            liveWordLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"];
                            liveWordLink.innerText = info['folderName']
                        }
                        else
                        {
                            sideLiveInfo.innerHTML = "<p>上次开播: "+info["created_at"]+"</p>";
                            livestatusWord.innerText = "未直播";
                            livestatusWord.style = "background: #909090";
                            achorname.innerText = info["achorname"];
                            livethumbLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"];
                            liveWordLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"];
                            liveWordLink.innerText = info['folderName']
                        }  
                        var imgSrc = livestatusThumb.getAttribute('data-src');
                        if(imgSrc)
                        {
                            livestatusThumb.setAttribute('data-src',info["thumbUrl"]);
                        }
                        else
                        {
                            livestatusThumb.src = info["thumbUrl"];
                        }       
                    }
                })
        })
        sessionStorage.setItem('setIntervalId',id);
}
function updateInfoIndexAll(data)
{
    retMsg = receviceData(data)
    if(retMsg.status==503)
    {
        return
    }
    if(retMsg.status==404)
    {
        alert(data.msg)
        return
    }
    var $jsontip = $("#vidlist");
    var strHtml = "";//存储数据的变量
    $jsontip.empty();//清空内容
    var $sidertip = $("#subscribed-list");
    var siderHtml = "";//存储数据的变量
    $sidertip.empty();

    var $mainButtontip = $("#mainButton");
    var mainButtonHtml = "";//存储数据的变量
    $mainButtontip.empty();
    var mainButtonArray = new Array();
    $.each(retMsg.msg,function(infoIndex,info){
        if(info['liveStatus'] == "ON")
            {
                strHtml +=
                "<div class='vid-list'>"
                    +"<a id='livethumbLink' href='play?p="+info["platform"]+"&v="+info["linkid"]+"'><div class='box'><img src='' data-src='"+info['thumbUrl']+"' class='thumbnail'></div></a>"
                    +"<div class='flex-div'>"
                        +"<div class='avatar-img-bg-color'><img id='avatar-img' src='' width='35' height='35' data-src="+info['avatar-img']+"></div>"
                        +"<div class='vid-info'>"
                            +"<a id='liveWordLink' href='play?p="+info["platform"]+"&v="+info["linkid"]+"'>"+info['folderName']+"</a>"
                            +"<p id ='achorname'>"+info["achorname"]+"</p>"
                            +"<span id='liveinfos'>"
                            +"<i></i><p>"+info["totalCount"]+"</p>"
                            +"</span>"
                            +"<p style='background: rgb(204 0 0 / 90%)' class='livestatus'>直播中<p/>"
                            +"</div>"
                            +"</div>"
                            +"</div>"
                siderHtml +=
                "<div class='sideinfo'>"
                +"<a href='play?p="+info["platform"]+"&v="+info["linkid"]+"'>"
                    +"<div class='addedinfo'>"
                        +"<div class='avatarinfo'><img src='' data-src='"+info['avatar-img']+"'><div class='liveLight'></div></div>"
                        +"<p>"+info["achorname"]+"</p>"
                    +"</div>"
                    +"</a>"
                    +"<button type='button' value="+info['link']+">删除</button>"
                +"</div>"
            }
        else
        {
            strHtml +=
            "<div class='vid-list'>"
                    +"<a id='livethumbLink' href='play?p="+info["platform"]+"&v="+info["linkid"]+"'><div class='box'><img src='' data-src='"+info['thumbUrl']+"' class='thumbnail'></div></a>"
                    +"<div class='flex-div'>"
                        +"<div class='avatar-img-bg-color'><img id='avatar-img' src='' width='35' height='35' data-src="+info['avatar-img']+"></div>"
                        +"<div class='vid-info'>"
                            +"<a id='liveWordLink' href='play?p="+info["platform"]+"&v="+info["linkid"]+"'>"+info['folderName']+"</a>"
                            +"<p id ='achorname'>"+info["achorname"]+"</p>"
                            +"<span id='liveinfos'>"
                            +"<p>上次开播: "+info["created_at"]+"</p>"
                            +"</span>"
                            +"<p style='background: #909090' class='livestatus'>未直播<p/>"
                            +"</div>"
                            +"</div>"
                            +"</div>"
                siderHtml +=
                "<div class='sideinfo'>"
                +"<a href='play?p="+info["platform"]+"&v="+info["linkid"]+"'>"
                    +"<div class='addedinfo'>"
                        +"<img src='' data-src='"+info['avatar-img']+"'>"
                        +"<p>"+info["achorname"]+"</p>"
                    +"</div>"
                    +"</a>"
                    +"<button value="+info['link']+">删除</button>"
                +"</div>"
        }
        // addbutton
        if(mainButtonArray.indexOf('全部') <= -1)
        {
            mainButtonArray.push('全部')
            mainButtonHtml +='<button type="button" title="分类按钮" class="fristButton">全部</button>'
        }
        
        if (mainButtonArray.indexOf(info["platform_Zh"]) <= -1)
        {
            mainButtonArray.push(info["platform_Zh"])
            mainButtonHtml +='<button type="button" title="分类按钮" class="normalButton">'+info["platform_Zh"]+'</button>'
        }
        if (mainButtonArray.indexOf(info["category"]) <= -1)
        {
            console.log(info["category"]);
            mainButtonArray.push(info["category"])
            mainButtonHtml +='<button type="button" title="分类按钮" class="normalButton">'+info["category"]+'</button>'
        }
    })
    $sidertip.html(siderHtml);
    $jsontip.html(strHtml);//显示处理后的数据
    $mainButtontip.html(mainButtonHtml);

    var socket = io();

        id = sessionStorage.getItem('setIntervalId');
        // console.log(id)
        if(id!=-1)
        {
            sessionStorage.setItem('setIntervalId',-1);
            clearInterval(id);
            // console.log("停止更新")
        }
        id = setInterval(function(){
            var msg = makeData({"name":"index"})
            socket.emit('getIndex', msg);
            return false;
        },Math.random()*30000+30000)        // Math.random()*30000+30000
        liveInfos = document.querySelectorAll(".vid-info> #liveinfos")
        livestatusWords = document.querySelectorAll(".vid-info>.livestatus")
        livestatusThumbs = document.querySelectorAll("#livethumbLink > div > img")
        livethumbLinks = document.querySelectorAll("#livethumbLink")
        avatarImgs = document.querySelectorAll("#avatar-img")
        achornames = document.querySelectorAll('.vid-info > #achorname') 
        liveWordLinks = document.querySelectorAll("#liveWordLink")
        socket.on('index response', function(msg) {
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
            $.each(retMsg.data,function(infoIndex,info)
            {
                liveInfo = liveInfos[infoIndex]
                livestatusWord = livestatusWords[infoIndex]
                livestatusThumb = livestatusThumbs[infoIndex]
                achorname = achornames[infoIndex];
                avatarImg = avatarImgs[infoIndex]
                livethumbLink = livethumbLinks[infoIndex]
                liveWordLink = liveWordLinks[infoIndex]
                
                //更新侧边栏视频信息    
                if(info['liveStatus'] == "ON")    
                {
                    liveInfo.innerHTML = "<i></i><p>"+info["totalCount"]+"</p>";
                    livestatusWord.innerText = "直播中";
                    livestatusWord.style = "background: rgb(204 0 0 / 90%)";
                    achorname.innerText = info['achorname']
                    livethumbLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                    liveWordLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                    liveWordLink.innerText = info["folderName"] 
                }
                else
                {
                    liveInfo.innerHTML = "<p>上次开播: "+info["created_at"]+"</p>";
                    livestatusWord.innerText = "未直播";
                    livestatusWord.style = "background: #909090";
                    achorname.innerText = info['achorname'];
                    livethumbLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                    liveWordLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                    liveWordLink.innerText = info["folderName"] 
                }
                var img1Src = livestatusThumb.getAttribute('data-src');
                if(img1Src)
                {
                    livestatusThumb.setAttribute('data-src',info["thumbUrl"]);
                }
                else
                {
                    livestatusThumb.src = info["thumbUrl"];
                }
                var img2Src = avatarImg.getAttribute('data-src');
                if(img2Src)
                {
                    avatarImg.setAttribute('data-src',info["thumbUrl"]);
                }
                else
                {
                    avatarImg.src = info["avatar-img"]
                }       
            })
        });
    sessionStorage.setItem('setIntervalId',id);
    lazyImages()
    $("#progress").addClass("done");
    siderControl()
    mainButtonStyleControl()
    listenMainButton()
}
function updateInfoIndex(data)
{
    retMsg = receviceData(data)
        if(retMsg.status==503)
        {
            return
        }
        if(retMsg.status==404)
        {
            alert(data.msg)
            return
        }
        var $jsontip = $("#vidlist");
        var strHtml = "";//存储数据的变量
        $jsontip.empty();//清空内容
        $.each(retMsg.msg,function(infoIndex,info){
            if(info['liveStatus'] == "ON")
               {
                strHtml +=
                "<div class='vid-list'>"
                +"<a id='livethumbLink' href='play?p="+info["platform"]+"&v="+info["linkid"]+"'><div class='box'><img src='' data-src='"+info['thumbUrl']+"' class='thumbnail'></div></a>"
                +"<div class='flex-div'>"
                    +"<div class='avatar-img-bg-color'><img id='avatar-img' src='' width='35' height='35' data-src="+info['avatar-img']+"></div>"
                    +"<div class='vid-info'>"
                        +"<a id='liveWordLink' href='play?p="+info["platform"]+"&v="+info["linkid"]+"'>"+info['folderName']+"</a>"
                        +"<p id ='achorname'>"+info["achorname"]+"</p>"
                        +"<span id='liveinfos'>"
                        +"<i></i><p>"+info["totalCount"]+"</p>"
                        +"</span>"
                        +"<p style='background: rgb(204 0 0 / 90%)' class='livestatus'>直播中<p/>"
                        +"</div>"
                        +"</div>"
                        +"</div>"
               }
            else
            {
                strHtml +=
                "<div class='vid-list'>"
                    +"<a id='livethumbLink' href='play?p="+info["platform"]+"&v="+info["linkid"]+"'><div class='box'><img src='' data-src='"+info['thumbUrl']+"' class='thumbnail'></div></a>"
                    +"<div class='flex-div'>"
                        +"<div class='avatar-img-bg-color'><img id='avatar-img' src='' width='35' height='35' data-src="+info['avatar-img']+"></div>"
                        +"<div class='vid-info'>"
                            +"<a id='liveWordLink' href='play?p="+info["platform"]+"&v="+info["linkid"]+"'>"+info['folderName']+"</a>"
                            +"<p id ='achorname'>"+info["achorname"]+"</p>"
                            +"<span id='liveinfos'>"
                            +"<p>上次开播: "+info["created_at"]+"</p>"
                            +"</span>"
                            +"<p style='background: #909090' class='livestatus'>未直播<p/>"
                            +"</div>"
                            +"</div>"
                            +"</div>"
            }
            
            // play?a=jrKeWMlm2wCz1Vl
            //"<a href='" + info["url"] + "' target='_blank'><img src='' data-src='" + info["img"] + "' /></a>";
        })
        $jsontip.html(strHtml);//显示处理后的数据
        var socket = io();

        id = sessionStorage.getItem('setIntervalId');
        // console.log(id)
        if(id!=-1)
        {
            sessionStorage.setItem('setIntervalId',-1);
            clearInterval(id);
            // console.log("停止更新")
        }
        id = setInterval(function(){
            var msg = makeData({"name":"index"})
            socket.emit('getIndex', msg);
            return false;
        },Math.random()*30000+30000)        // Math.random()*30000+30000
        liveInfos = document.querySelectorAll(".vid-info> #liveinfos")
        livestatusWords = document.querySelectorAll(".vid-info>.livestatus")
        livestatusThumbs = document.querySelectorAll("#livethumbLink > div > img")
        livethumbLinks = document.querySelectorAll("#livethumbLink")
        avatarImgs = document.querySelectorAll("#avatar-img")
        achornames = document.querySelectorAll('.vid-info > #achorname') 
        liveWordLinks = document.querySelectorAll("#liveWordLink")
        socket.on('index response', function(msg) {
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
            $.each(retMsg.data,function(infoIndex,info)
            {
                liveInfo = liveInfos[infoIndex]
                livestatusWord = livestatusWords[infoIndex]
                livestatusThumb = livestatusThumbs[infoIndex]
                achorname = achornames[infoIndex];
                avatarImg = avatarImgs[infoIndex]
                livethumbLink = livethumbLinks[infoIndex]
                liveWordLink = liveWordLinks[infoIndex]
                
                //更新侧边栏视频信息    
                if(info['liveStatus'] == "ON")    
                {
                    liveInfo.innerHTML = "<i></i><p>"+info["totalCount"]+"</p>";
                    livestatusWord.innerText = "直播中";
                    livestatusWord.style = "background: rgb(204 0 0 / 90%)";
                    achorname.innerText = info['achorname']
                    livethumbLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                    liveWordLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                    liveWordLink.innerText = info["folderName"] 
                }
                else
                {
                    liveInfo.innerHTML = "<p>上次开播: "+info["created_at"]+"</p>";
                    livestatusWord.innerText = "未直播";
                    livestatusWord.style = "background: #909090";
                    achorname.innerText = info['achorname'];
                    livethumbLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                    liveWordLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                    liveWordLink.innerText = info["folderName"] 
                }
                var img1Src = livestatusThumb.getAttribute('data-src');
                if(img1Src)
                {
                    livestatusThumb.setAttribute('data-src',info["thumbUrl"]);
                }
                else
                {
                    livestatusThumb.src = info["thumbUrl"];
                }
                var img2Src = avatarImg.getAttribute('data-src');
                if(img2Src)
                {
                    avatarImg.setAttribute('data-src',info["thumbUrl"]);
                }
                else
                {
                    avatarImg.src = info["avatar-img"]
                }    
            })
          });
        sessionStorage.setItem('setIntervalId',id);
        lazyImages()
        $("#progress").addClass("done");
}
function addInfoStrHtml(name)
{
    if(name=="全部")name='index';
    var msg = makeData({"name":name})
    $.post("/filter",msg,function(data){    
        updateInfoIndex(data)
        })
}
class Scroller {
    init() {
        this.setDragWheelEvent("#mainButton");
        this.setDragScrollEvent("#mainButton");
        this.initClick();
    }
    throttle(fn, wait) {
        let inThrottle, lastFn, lastTime;
        return function () {
            const context = this, args = arguments;
            if (!inThrottle) {
                fn.apply(context, args);
                lastTime = Date.now();
                inThrottle = true;
            } else {
                clearTimeout(lastFn);
                lastFn = setTimeout(function () {
                    if (Date.now() - lastTime >= wait) {
                        fn.apply(context, args);
                        lastTime = Date.now();
                    }
                }, Math.max(wait - (Date.now() - lastTime), 0));
            }
        };
    }
    setDragWheelEvent(selector) {
        const gameShowEle = document.querySelector(selector);
        gameShowEle.addEventListener("wheel", (event) => {
            event.preventDefault();
            gameShowEle.scrollLeft += event.deltaY;
        });
    }
    setDragScrollEvent(selector) {
        const gameShowEle = document.querySelector(selector);
        let left = 0;
        let oldLeft = 0;
        const move = this.throttle((event) => {
            let x = left + (oldLeft - event.clientX)
            if (x < 0) x = 0;
            gameShowEle.scrollTo(x, 0)
        }, 100)
        gameShowEle.addEventListener('mousedown', function (event) {
            gameShowEle.style.cursor = 'grabbing';
            gameShowEle.style.userSelect = 'none';
            oldLeft = event.clientX;
            left = gameShowEle.scrollLeft;
            document.addEventListener('mousemove', move)
        });
        document.addEventListener('mouseup', function () {
            gameShowEle.style.cursor = 'pointer';
            gameShowEle.style.removeProperty('user-select');
            document.removeEventListener('mousemove', move)
        })
    }
     isMobile() {
                    return window.navigator.userAgent.match(
                        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|Symbian|Windows Phone)/i
                );
     }
    initClick() {
        const imgSpaceEles = document.querySelectorAll("#mainButton > button");
        if (imgSpaceEles) {
            const xAarry = [];
            Array.from(imgSpaceEles).forEach((imgSpaceEle, index) => {
                const href = imgSpaceEle.getAttribute("url");
                let { x } = imgSpaceEle.getBoundingClientRect();
                xAarry.push(x);
                imgSpaceEle.addEventListener("click", () => {
                    let { x: newx } = imgSpaceEle.getBoundingClientRect();
                    if (xAarry[index] == newx || this.isMobile()) {
                    //    alert(href)
                    }
                    xAarry.forEach((m, i) => {
                        const ele = imgSpaceEles[i];
                        const site = ele.getBoundingClientRect();
                        xAarry[i] = site.x
                    })
                })
            })
        }
    }
}  
function listenMainButton()
{
    
    const scroller = new Scroller()
    scroller.init();
}
