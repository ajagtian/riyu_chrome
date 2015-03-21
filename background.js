// ® Riyusaki
(function(){
var app_uri = 'http://riyusaki.com'
var db_uri = "http://54.191.81.102:8000/update/";
var cookieName = 'randomID';
var appDomain = 'riyusaki.com';
var pornTags = /xxx|xx|porn|fuck/i;
var url_title_map = {};
var url_time_map = {};
var url_focus_time_map = {};
var tab_id_url_map = {};
var __aT__ = null;
var __aTi__ = null;
riyusaki = {
  init : function(){
  /*  chrome.tabs.onActivated.addListener(function (activeInfo) {
      chrome.tabs.getSelected(null, function(tab){
        var tab_url = (tab.url).toString();
        //riyusaki.log('activated - '+url)
        // riyusaki.log("activated: "+url);
        var tab_id = (tab.id).toString();
        if(tab_id != __aTi__) {
          var tab_title = tab.title.toString();
          riyusaki.recordTitle(tab_url, tab_title);
          riyusaki.recordID(tab_id, tab_url);

          // riyusaki.log("__aT__ before: "+__aT__);
          if(!riyusaki.isEmpty(__aT__) && __aT__ != tab_url){
            riyusaki.discontinueLogger(__aT__);
            __aT__ = tab_url;
            __aTi__ = tab_id;
            riyusaki.continueLogger(__aT__);
           }
          if(riyusaki.isEmpty(__aT__)){
            __aT__ = tab_url;
            __aTi__ = tab_id;
            riyusaki.continueLogger(tab_url);
          }
        }

       });
    });*/
    chrome.tabs.onUpdated.addListener(function (tabid, changeInfo, tab) {
      var tab_url = (tab.url).toString();
      //riyusaki.log('updated - '+url)
      // riyusaki.log("updated: "+url);
      var tab_title = (tab.title).toString();
      if(tab_title.toLowerCase().indexOf("new tab") == -1){
        //riyusaki.recordTitle(tab_url, tab_title);
        //riyusaki.recordID(tabid.toString(), tab_url);

        if (!riyusaki.isEmpty(__aT__) && __aT__ == tab_url){
          // do nothing
        }
        if(!riyusaki.isEmpty(__aT__) && __aT__ != tab_url){
          //riyusaki.stopLogger(last_active_tab);
          __aT__ = tab_url;
          __aTi__ = tabid;
          //riyusaki.continueLogger(__aT__)
        }
        // riyusaki.log("__aT__ before: "+__aT__);
        //
        if(riyusaki.isEmpty(__aT__)){
          __aT__ = tab_url;
          __aTi__ = tabid;
          //riyusaki.continueLogger(__aT__);
        }
        //
        //riyusaki.log("__aT__ after: "+__aT__);
        //riyusaki.log("record_id "+tabid+"=>"+tab_url);
      }
    });

  /*  chrome.tabs.onRemoved.addListener(function (tabID, removeInfo) {
        //riyusaki.log("before remove: "+tab_id_url_map[tabID]);

        riyusaki.stopLogger(tab_id_url_map[tabID]);
        //riyusaki.log("removed: "+tab_id_url_map[tabID]);
        //__aT__ = null;
        //riyusaki.log('removed')
    }); */

  },
/*  recordTitle:function(url, title){
    if(riyusaki.isEmpty(url_title_map[url])){
      url_title_map[url] = title;
    //  riyusaki.log("recordTitle:"+url);
    }
  },
  recordID:function(id, url){
    if(!riyusaki.isEmpty(url)){
      tab_id_url_map[id] = url;
    }
  },
  continueLogger:function(url){
    url_focus_time_map[url] = new Date().getTime();
    if(riyusaki.isEmpty(url_time_map[url]))
      url_time_map[url] = 0;
    //riyusaki.log("continueLogger:"+url);
  },
  discontinueLogger:function(url){
    url_time_map[url] += parseInt((new Date().getTime() - url_focus_time_map[url])/1000);
    url_focus_time_map[url] = new Date().getTime();
    //riyusaki.log("discontinueLogger:"+url);
  },
  stopLogger:function(url){
    url_time_map[url] += parseInt( (new Date().getTime() - url_focus_time_map[url]) /1000);
    url_focus_time_map[url] = new Date().getTime();
    done = false;
    riyusaki.record(url, url_title_map[url], url_time_map[url], true);

    //riyusaki.log("stopLogger:"+url);

  },
  destroyData:function(){

  },*/
  isEmpty:function(obj){
    if(obj == null || obj == undefined || obj == "")
      return true;
    else
      return false;
  }/*,
  record:function(url, title, time, del){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:5000/log/"+url+'/'+time+'/'+title, true);
    xmlHttp.send();
    xmlHttp.onreadystatechange = function(){
      if(xmlHttp.status == 200 && xmlHttp.readyState == 4 && del){
        riyusaki.delete_data(url)
        return true;
      }
    }

  },
  log:function(text){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:5000/log/"+text, true);
    xmlHttp.send();
    return true;
  },
  delete_data : function(url){
    delete url_title_map[url];
    delete url_time_map[url];
    delete url_focus_time_map[url];
  }*/
}
riyusaki.init();
})();
