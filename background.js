// ® Riyusaki
(function(){
var app_url = 'http://riyusaki.com'
var database_url = "http://54.191.81.102:8000/update/";
var cookieName = 'randomID';
var appDomain = 'riyusaki.com';
var pornTags = /xxx|xx|porn|fuck/i;
var url_title_map = {};
var url_time_map = {};
var url_focus_time_map = {};
var tab_id_url_map = {};
activeTab = null;

riyusaki = {
  init : function(){
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      chrome.tabs.getSelected(null, function(tab){
        var url = tab.url;
        riyusaki.log("activated: "+url);
        var id = tab.id;
        var title = tab.title;
        riyusaki.log("activeTab before: "+activeTab);
        if(!riyusaki.isEmpty(activeTab) && activeTab != url){
          riyusaki.discontinueLogger(activeTab);
          riyusaki.continueLogger(url);
        }
        if(riyusaki.isEmpty(activeTab)){
          riyusaki.continueLogger(url);
        }

        activeTab = url;
        riyusaki.log("activeTab after: "+activeTab);
        riyusaki.recordTitle(url, title);
        riyusaki.log("record_id "+id+"=>"+url);
        riyusaki.recordID(id, url);
      });
    });
    chrome.tabs.onUpdated.addListener(function (tabid, changeInfo, tab) {
      var url = tab.url;
      riyusaki.log("updated: "+url);
      var title = tab.title;
      if (!riyusaki.isEmpty(activeTab) && activeTab.id == tabid){
        riyusaki.stopLogger(activeTab);
      }
      riyusaki.log("activeTab before: "+activeTab);

      if(!riyusaki.isEmpty(activeTab) && activeTab != url){
        riyusaki.discontinueLogger(activeTab);
        riyusaki.continueLogger(url);
      }
      if(riyusaki.isEmpty(activeTab)){
        riyusaki.continueLogger(url);
      }

      activeTab = url;
      riyusaki.log("activeTab after: "+activeTab);
      riyusaki.recordTitle(url, title);
      riyusaki.log("record_id "+tabid+"=>"+url);
      riyusaki.recordID(tabid, url);
    });

    chrome.tabs.onRemoved.addListener(function (tabID, removeInfo) {
        riyusaki.log("before remove: "+tab_id_url_map[tabID]);
        riyusaki.stopLogger(tab_id_url_map[tabID]);
        riyusaki.log("removed: "+tab_id_url_map[tabID]);
        activeTab = null;
    });
  
  },
  recordTitle:function(url, title){
    if(riyusaki.isEmpty(url_title_map[url])){
      url_title_map[url] = title;
      riyusaki.log("recordTitle:"+url);
    }
  },
  recordID:function(id, url){
    tab_id_url_map[id] = url;
  },
  continueLogger:function(url){
    if(riyusaki.isEmpty(url_focus_time_map[url])){
      url_focus_time_map[url] = new Date().getTime();
      if(riyusaki.isEmpty(url_time_map[url]))
        url_time_map[url] = 0;
      riyusaki.log("continueLogger:"+url);
    }
  },
  discontinueLogger:function(url){
    url_time_map[url] += parseInt((new Date().getTime() - url_focus_time_map[url])/1000);
    url_focus_time_map[url] = new Date();
    riyusaki.log("discontinueLogger:"+url);
  },
  stopLogger:function(url){
    url_time_map[url] += parseInt((new Date().getTime() - url_focus_time_map[url])/1000);
    url_focus_time_map[url] = new Date();
    done = false;
    done = riyusaki.record(url, url_title_map[url], url_time_map[url]);
    if(done){
      delete url_title_map[url];
      delete url_time_map[url];
      delete url_focus_time_map[url];
    }
    riyusaki.log("stopLogger:"+url);

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
    xmlHttp.open("GET", "http://localhost:8080/Chrome_Logger/Log?log="+url+"-"+title+"-"+time, false);
    xmlHttp.send();
    return true;
  },
  log:function(text){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:8080/Chrome_Logger/logit?log="+text, false);
    xmlHttp.send();
    return true;
  }
}
riyusaki.init();
})();
