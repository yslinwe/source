$(function(){
    sessionStorage.setItem("currentPage",'index')
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
            if(info["category"]!="")
            {
                if (mainButtonArray.indexOf(info["category"]) <= -1)
                {
                    console.log(info["category"]);
                    mainButtonArray.push(info["category"])
                    mainButtonHtml +='<button type="button" title="分类按钮" class="normalButton">'+info["category"]+'</button>'
                }
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
                    
                }
                else
                {
                    liveInfo.innerHTML = "<p>上次开播: "+info["created_at"]+"</p>";
                    livestatusWord.innerText = "未直播";
                    livestatusWord.style = "background: #909090";
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
                achorname.innerText = info['achorname']
                livethumbLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                liveWordLink.href = 'play?p='+info["platform"]+'&v='+info["linkid"]
                liveWordLink.innerText = info["folderName"]     
            })
          });
            
        sessionStorage.setItem('setIntervalId',id);
        lazyImages()
        $("#progress").addClass("done");
        siderControl()
        mainButtonStyleControl()
        listenMainButton()
        })
    })
