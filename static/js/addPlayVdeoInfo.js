$(function(){
    var v = String(UrlParam.paramValues("v"));
    fristLinkId = ''
    sessionStorage.setItem("currentPage",'play')
    var msg = makeData({"name":String(v)})
    $.post("/msg",msg,function(data){    
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
    info = retMsg.msg
    if(info['liveStatus'] == "ON")    
    {
        document.getElementById('totalCount').innerText = info["totalCount"];
        document.getElementById('createTime').innerText = "• "+info["category"]+" • 开播时间："+info["created_at"];
    }
    else
    {
        document.getElementById('liveStatusInfo').innerHTML = "";
        document.getElementById('createTime').innerText = info["category"]+" • 上次开播时间："+info["created_at"];
    }
    document.title = info['folderName'];
    document.getElementById('vid-title').innerText=info['folderName'];
    document.getElementById('avatar-img').src = info['avatar-img']
    document.getElementById('subscribe').innerText = info['subscribe']
    document.getElementById('achornameChannnel').innerHTML = info["achorname"]
    document.getElementById('achornameChannnel').href = info['link']
    document.getElementById('welcomeText').innerHTML = info['welcomeText']
    fristLinkId = info['linkid']

    var msg = makeData({"name":'index'})
    $.post("/msg",msg,function(data){    
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
                +"<p>上次开播时间: "+info["created_at"]+"</p>"
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
                            document.getElementById('createTime').innerText = info["category"]+" • 上次开播时间："+info["created_at"];
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
                            livestatusThumb.src = info["thumbUrl"];
                            achorname.innerText = info["achorname"];
                            livethumbLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"];
                            liveWordLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"];
                            liveWordLink.innerText = info['folderName']
                        }
                        else
                        {
                            sideLiveInfo.innerHTML = "<p>上次开播时间: "+info["created_at"]+"</p>";
                            livestatusWord.innerText = "未直播";
                            livestatusWord.style = "background: #909090";
                            achorname.innerText = info["achorname"];
                        }         
                    }
                })
        })
        sessionStorage.setItem('setIntervalId',id);
    })
})
})