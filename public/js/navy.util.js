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