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
var __activeTab__ = null;

riyusaki = {
  init : function(){
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      chrome.tabs.getSelected(null, function(tab){
        var tab_url = tab.url;
        //riyusaki.log('activated - '+url)
        // riyusaki.log("activated: "+url);
        var tab_id = tab.id;
        var tab_title = tab.title;
        riyusaki.recordTitle(tab_url, tab_title);
        riyusaki.recordID(tab_id, tab_url);

        // riyusaki.log("__activeTab__ before: "+__activeTab__);
        if(!riyusaki.isEmpty(__activeTab__) && __activeTab__ != tab_url){
          riyusaki.discontinueLogger(__activeTab__);
          __activeTab__ = tab_url;
          riyusaki.continueLogger(__activeTab__);
         }
        if(riyusaki.isEmpty(__activeTab__)){
          __activeTab__ = tab_url;
          riyusaki.continueLogger(tab_url);
        }

       });
    });
    chrome.tabs.onUpdated.addListener(function (tabid, changeInfo, tab) {
      var tab_url = tab.url;
      //riyusaki.log('updated - '+url)
      // riyusaki.log("updated: "+url);
      var tab_title = tab.title;
      if(tab_title.toLowerCase().indexOf("new tab") == -1){
        riyusaki.recordTitle(tab_url, tab_title);
        riyusaki.recordID(tabid, tab_url);

        if (!riyusaki.isEmpty(__activeTab__) && __activeTab__ == tab_url){
          // do nothing
        }
        if(!riyusaki.isEmpty(__activeTab__) && __activeTab__ != tab_url){
          riyusaki.stopLogger(__activeTab__);
          __activeTab__ = tab_url;
          riyusaki.continueLogger(__activeTab__)
        }
        // riyusaki.log("__activeTab__ before: "+__activeTab__);
        //
        if(riyusaki.isEmpty(__activeTab__)){
          __activeTab__ = tab_url;
          riyusaki.continueLogger(__activeTab__);
        }
        //
        //riyusaki.log("__activeTab__ after: "+__activeTab__);
        //riyusaki.log("record_id "+tabid+"=>"+tab_url);
      }
    });

    chrome.tabs.onRemoved.addListener(function (tabID, removeInfo) {
        //riyusaki.log("before remove: "+tab_id_url_map[tabID]);

        riyusaki.stopLogger(tab_id_url_map[tabID]);
        //riyusaki.log("removed: "+tab_id_url_map[tabID]);
        //__activeTab__ = null;
        //riyusaki.log('removed')
    });

  },
  recordTitle:function(url, title){
    if(riyusaki.isEmpty(url_title_map[url])){
      url_title_map[url] = title;
      riyusaki.log("recordTitle:"+url);
    }
  },
  recordID:function(id, url){
    if (riyusaki.isEmpty(tab_id_url_map[id])){
      tab_id_url_map[id] = url;
      riyusaki.log('record id'+url);
    }
  },
  continueLogger:function(url){
    url_focus_time_map[url] = new Date().getTime();
    if(riyusaki.isEmpty(url_time_map[url]))
      url_time_map[url] = 0;
    riyusaki.log("continueLogger:"+url);
  },
  discontinueLogger:function(url){
    url_time_map[url] += parseInt((new Date().getTime() - url_focus_time_map[url])/1000);
    url_focus_time_map[url] = new Date();
    riyusaki.log("discontinueLogger:"+url);
  },
  stopLogger:function(url){
    url_time_map[url] += parseInt( (new Date().getTime() - url_focus_time_map[url]) /1000);
    url_focus_time_map[url] = new Date();
    done = false;
    done = riyusaki.record(url, url_title_map[url], url_time_map[url]);

    riyusaki.log("stopLogger:"+url);

    if(done){
      delete url_title_map[url];
      delete url_time_map[url];
      delete url_focus_time_map[url];
    }

  },
  destroyData:function(){

  },
  isEmpty:function(obj){
    if(obj == null || obj == undefined || obj == "")
      return true;
    else
      return false;
  },
  record:function(url, title, time){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:5000/log/"+url+'-'+time+'-'+title, true);
    xmlHttp.send();
    return true;
  },
  log:function(text){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:5000/log/"+text, true);
    xmlHttp.send();
    return true;
  }
}
riyusaki.init();
})();
