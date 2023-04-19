var filter = UrlParam.paramValues("s");
        $(function(){
        
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
        $.each(retMsg.msg,function(infoIndex,info){
            if(filter!=''&& (info['folderName'].toUpperCase().indexOf(filter) > -1 ||info['achorname'].toUpperCase().indexOf(filter) > -1))
            {
                if(info['liveStatus'] == "ON")
            {
                strHtml +=
                '<div class="side-video-list">'
                +'<a href='+ "play?p="+info["platform"]+"&v="+info["linkid"]+' class="small-thumbnail">'
                    +'<div class="box">'
                    +'<img src="" data-src="'+ info["thumbUrl"] +'" alt='+info["linkid"]+'>'
                    +'</div>'
                +'</a>'
                +'<div class="vid-left">'
                        +'<a href="'+ "play?p="+info["platform"]+"&v="+info["linkid"]+'">'+info["folderName"]+'</a>'
                        +'<div >'
                        +'<div class="vid-flex">'
                        +'<div class="avatar-img-bg-color">'
                        +' <img src="" width="35" height="35" data-src='+info['avatar-img']+'>'
                        +'</div>'
                                +'<p>'+info["achorname"]+'</p>'
                            +'</div>'
                            +'<div class="vid-info">'
                                +'<span>'
                                +'<i></i><p>'+info["totalCount"]+'</p>'
                                +'</span>'
                                +'<p style="background: rgb(204 0 0 / 90%)" class="livestatus">直播中<p/>'
                            +'</div>'
                        +'</div>'
                    +'</div>'
                +'</div>'
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
                '<div class="side-video-list">'
                +'<a href='+ "play?p="+info["platform"]+"&v="+info["linkid"]+' class="small-thumbnail">'
                    +'<div class="box">'
                        +'<img src="" data-src="'+ info["thumbUrl"] +'" alt='+info["linkid"]+'>'
                    +'</div>'
                +'</a>'
                +'<div class="vid-left">'
                        +'<a href="'+ "play?p="+info["platform"]+"&v="+info["linkid"]+'">'+info["folderName"]+'</a>'
                        +'<div >'
                            +'<div class="vid-flex">'
                                +'<div class="avatar-img-bg-color">'
                                    +' <img src="" width="35" height="35" data-src='+info['avatar-img']+'>'
                                +'</div>'
                                +'<p>'+info["achorname"]+'</p>'
                            +'</div>'
                            +'<div class="vid-info">'
                                +'<span>'
                                +'<p>上次开播: '+info["created_at"]+'</p>'
                                +'</span>'
                                +'<p style="background: #909090" class="livestatus">未直播<p/>'
                            +'</div>'
                        +'</div>'
                    +'</div>'
                +'</div>'
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
            }
            
            // play?a=jrKeWMlm2wCz1Vl
            //"<a href='" + info["url"] + "' target='_blank'><img src='" + info["img"] + "' /></a>";
        })
        if(strHtml == '')
        {
            strHtml += '<h1>找不到内容</h1>'
        }
            $jsontip.html(strHtml);//显示处理后的数据
            $sidertip.html(siderHtml);
            lazyImages()
            $("#progress").addClass("done");
            siderControl()
        })
})