var NAVY = NAVY || {};
NAVY.UTIL = NAVY.UTIL || {};
var noop = function(){};
NAVY.UTIL.Date = {
    countDown:function(dom,second,cbf){
        cbf = cbf || noop;
        var setIntervalId = setInterval(function(){
            if(second <= 0){
                clearInterval(setIntervalId);
                cbf();
            }else{
                second--;
                dom.innerHTML = second;
            }
        },1000);
    }
};
NAVY.UTIL.Style = {
    getMaxZIndex:function(){
        var allTags = document.getElementsByTagName('*');
        var tagLens = allTags.length,i=0,maxZIndex=1;
        for(;i<tagLens;i++){
            maxZIndex = Math.max(maxZIndex,allTags[i].style.zIndex || 0 );
        }
        return maxZIndex;
    },
    setMaxZIndex:function(dom){
        dom.style.zIndex = 1+NAVY.UTIL.Style.getMaxZIndex();
    }
};
NAVY.UTIL.UA= function(ua) {
    ua = ua || window.navigator.userAgent
    ua = ua.toLowerCase();
    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};
NAVY.UTIL.Date = {
    countDown:function(dom,second,cbf){
        cbf = cbf || noop;
        var setIntervalId = setInterval(function(){
            if(second <= 0){
                clearInterval(setIntervalId);
                cbf();
            }else{
                second--;
                dom.innerHTML = second;
            }
        },1000);
    }
};
NAVY.UTIL.Search = {
    searchToJson:function(){
        var search = window.location.search;
        if (!search){
            return false;
        }else{
            search = search.substr(1);
            var searchJson = {};
            var searchArr = search.split('&');
            for(var i = 0 , len = searchArr.length ; i < len ; i++){
                var tempArr = searchArr[i].split('=');
                searchJson[tempArr[0]] = tempArr[1];
            }
            return searchJson;
        }
    },
    getSearchParam:function(param){
        var searchJson = KALENGO.UTIL.Search.searchToJson();
        if(!searchJson || !(searchJson[param])){
            return false;
        }else{
            return searchJson[param];
        }
    }
};