/**
 * 基于jquery1.7+的自定义对话框插件
 * author:navy
 * email:navyxie2010@gmail.com
 * qq:951178609
 * version:1.0
 * date 2013-04-08
 */
var noop = function(){};
var NAVY = NAVY || {};
NAVY.console = window.console || {log:noop,dir:noop};
NAVY.UTIL = NAVY.UTIL || {};
NAVY.UTIL.Style = NAVY.UTIL.Style || {};
NAVY.UTIL.Style.getMaxZIndex = function(){
    var allTags = document.getElementsByTagName('*');
    var tagLens = allTags.length,i=0,maxZIndex=1;
    for(;i<tagLens;i++){
        maxZIndex = Math.max(maxZIndex,allTags[i].style.zIndex || 0 );
    }
    return maxZIndex;
};
NAVY.UTIL.Style.setMaxZIndex =function(dom){
    dom.style.zIndex = 1+NAVY.UTIL.Style.getMaxZIndex();
};
NAVY.Dialog = function(contentHtml,options){
    var defaultOptions = {
        title:'温馨提示',//对话框标题
        isShowTiTle:true,//是否显示标题
        closeText:'X',//关闭按钮文字
        closeCbf:noop,//点击关闭按钮的回调
        isShowCloseBtn:true,//是否显示关闭按钮
        isMask:true,//是否显示遮罩层
        isClickMaskCloseDialog:false,//点击遮罩层是否关闭对话框
        clickMaskCbf:noop,//点击遮罩层的回调
        sureBtnText:'确定',//确定按钮的文字
        sureBtnCbf:noop,//点击确定按钮的回调
        isShowSureBtn:true,//是否显示确定按钮
        cancelBtnText:'取消',//取消按钮的文字
        cancelBtnCbf:noop,//点击取消按钮的回调
        isShowCancelBtn:true,//是否显示取消按钮
        target:'body',//对话框的容器，默认为body
        dialogWidth:null,//对话框的宽度
        dialogHeight:null,//对话框的高度
        marginLeft:null,//对话框距离容器左边的值
        marginTop:null,//对话框距离容器右边的值
        dialogClass:'',//对话框的容器类
        position:'fixed',//对话框定位，默认为固定定位
        autoCloseSecond:0,//自动关闭对话框的时间，0表示不关闭,单位为秒
        knowBtnCbf:noop,//点击对话框内容时的回掉
        isDrag:false//是否可以拖动
    };
    this.contentHtml = contentHtml || '请填充对话框内容';
    $.extend(defaultOptions,options);
    this.options = defaultOptions;
    this.targetObj = $(this.options.target);
    this.bodyObj = $('body');
    this.init();
};
NAVY.Dialog.prototype = {
    init:function(){
        this.showDialog();
        this.initEvent();
        return this;
    },
    initEvent:function(){
        var _this = this;
        var options = _this.options;
        var dialogObj = _this.dialogObj;
        var closeDialogBtnObj = dialogObj.find('.navyDialogTitleContainer').find('.closeDialogBtn');
        //如果有遮罩层，则处理遮罩层的点击事件
        if(options.isMask){
            this.bodyObj.find('.navyMaskWrapper').click(function(){
                if(options.isClickMaskCloseDialog){
                    _this.closeDialog();
                }
                options.clickMaskCbf();
            })
        }
        //dialog的点击处理事件
        dialogObj.on('click','.navyDialogBtnClick',function(){
            var target = $(this);
            if(target.hasClass('closeDialogBtn')){
                _this.closeDialog();
                options.closeCbf();
            }else if(target.hasClass('navySureBtn')){
                options.sureBtnCbf.apply(_this,arguments);
            }else if(target.hasClass('navyCancelBtn')){
                _this.closeDialog();
                options.cancelBtnCbf.apply(_this,arguments);
            }else if(target.hasClass('navyDialogTipKnowBtn')){
                _this.closeDialog();
                options.knowBtnCbf.apply(_this,arguments);
            }
        });
        //自动关闭
        var autoCloseSecond = options.autoCloseSecond;
        if(autoCloseSecond !== 0){
            if(closeDialogBtnObj.length){
                closeDialogBtnObj.html('<span class="leftSecond">'+autoCloseSecond+'</span>秒后关闭');
                var leftSecondDom = closeDialogBtnObj.find('.leftSecond')[0];
                //倒计时
                NAVY.UTIL.Date.countDown(leftSecondDom,autoCloseSecond)
            }
            var setTimeOutId = setTimeout(function(){
                _this.closeDialog();
                if(setTimeOutId){
                    clearTimeout(setTimeOutId);
                }
            },autoCloseSecond*1000);
        }
        if(options.isDrag){
            var isDrag = false,startPage = {x:0,y:0},startPos={left:0,top:0};
            dialogObj.find('.navyDialogTitleContainer').css('cursor','move').mousedown(function(e){
                isDrag = true;
                NAVY.UTIL.Style.setMaxZIndex(dialogObj[0]);
                startPage.x = e.pageX;
                startPage.y = e.pageY;
                startPos.left = dialogObj.position().left;
                startPos.top = dialogObj.position().top;
                return false;
            });
            $(document).on('mouseup mousemove',function(e){
                switch(e.type){
                    case 'mouseup':
                        isDrag = false;
                        return false;
                        break;
                    case 'mousemove' :
                        if(isDrag){
                            var curPage = {x:e.pageX,y:e.pageY};//当前pageX和pageY值
                            var moveValueX = curPage.x - startPage.x;//当前鼠标移动的x方向上的值
                            var moveValueY = curPage.y - startPage.y;//当前鼠标移动的y方向上的值
                            if(moveValueX % 2 === 0 || moveValueY % 2 === 0){
                                var curLeft = startPos.left + moveValueX;
                                var curTop = startPos.top + moveValueY;
                                curLeft = curLeft <= 0 ? 0  :curLeft;
                                curTop = curTop <= 0 ? 0 :  curTop;
                                dialogObj.css({left:curLeft,top:curTop});
                            }
                        }
                        return false;
                        break;
                }
            })
        }

        return this;
    },
    /**
     * 生成对话框函数
     */
    showDialog:function(){
        var styleObj = NAVY.UTIL.Style;
        var maxZindex = styleObj.getMaxZIndex();
        var _this = this;
        var options = _this.options;
        var positionCss = '';
        //对话框默认是固定定位，也可以是绝对定位
        if(options.position !== 'fixed'){
            positionCss = 'position:absolute';
        }
        /*-------------------- 拼接对话框的html start -----------------------*/
        //注意：用table包住可以做到内容宽度自适应
        var dialogHtmlArr = ['<div style="z-index: '+(2+maxZindex)+';'+positionCss+'" class="navyDialogWrapper '+options.dialogClass+'"><table class="navyDialogTable"><tr><td>'];
        if(options.isShowTiTle){
            if(options.isShowCloseBtn){
                dialogHtmlArr.push('<h2 class="navyDialogTitleContainer relative"><a href="javascript:;" class="navyDialogBtnClick closeDialogBtn floatRight">'+options.closeText+'</a><span class="dialogTitle">'+options.title+'</span></h2>');
            }else{
                dialogHtmlArr.push('<h2 class="navyDialogTitleContainer relative"><span class="dialogTitle textAlignCenter">'+options.title+'</span></h2>');
            }
        }else if(options.isShowCloseBtn){
            dialogHtmlArr.push('<h2 class="navyDialogTitleContainer relative"><a href="javascript:;" class="navyDialogBtnClick closeDialogBtn floatRight">'+options.closeText+'</a></h2>');
        }
        dialogHtmlArr.push('<div class="navyDialogContentContainer"><div class="navyDialogContent">'+_this.contentHtml+'</div></div>');
        if(options.isShowSureBtn){
            if(options.isShowCancelBtn){
                dialogHtmlArr.push('<div class="navyDialogBtnContainer"><div class="navyDialogBtnContent"><a href="javascript:;" class="navyDialogBtn navyDialogBtnClick navySureBtn">'+options.sureBtnText+'</a><a href="javascript:;" class="navyDialogBtn navyDialogBtnClick navyCancelBtn">'+options.cancelBtnText+'</a></div></div>');
            }else{
                dialogHtmlArr.push('<div class="navyDialogBtnContainer"><div class="navyDialogBtnContent"><a href="javascript:;" class="navyDialogBtn navyDialogBtnClick navySureBtn marginCenter">'+options.sureBtnText+'</a></div></div>');
            }
        }else if(options.isShowCancelBtn){
            dialogHtmlArr.push('<div class="navyDialogBtnContainer"><div class="navyDialogBtnContent"><a href="javascript:;" class="navyDialogBtn navyDialogBtnClick navyCancelBtn marginCenter">'+options.cancelBtnText+'</a></div></div>');
        }
        dialogHtmlArr.push('</td></tr></table></div>');
        /*-------------------- 拼接对话框的html end -----------------------*/
        _this.dialogObj = $(dialogHtmlArr.join('')).appendTo(options.target);//每个对象都是对立的
        //$(options.target).append(dialogHtmlArr.join(''));
        //_this.dialogObj = _this.targetObj.find('.navyDialogWrapper');
        var dialogObj = _this.dialogObj;
        var dialogObjWidth = options.dialogWidth || dialogObj.outerWidth(),dialogObjHeight = options.dialogHeight || dialogObj.outerHeight();
        //对话框最小宽度为80px
        dialogObjWidth = dialogObjWidth < 80 ? 80 : dialogObjWidth;
        var dialogObjMarginLeft = dialogObjWidth/2 , dialogObjMarginTop = dialogObjHeight/2;
        var marginLeft = options.marginLeft,marginTop = options.marginTop;
        //设置对话框的宽度和高度以及marginLeft和marginTop值
        if(marginLeft !== null){
            if(marginTop !== null){
                dialogObj.css({width:dialogObjWidth,height:dialogObjHeight,marginLeft:marginLeft,marginTop:marginTop,left:0,top:0,overflow:'hidden'}).find('.navyDialogTable').css({'width':dialogObjWidth,'height':dialogObjHeight});
            }else{
                dialogObj.css({width:dialogObjWidth,height:dialogObjHeight,marginLeft:marginLeft,marginTop:-dialogObjMarginTop,left:0,overflow:'hidden'}).find('.navyDialogTable').css({'width':dialogObjWidth,'height':dialogObjHeight});
            }
        }else if(marginTop !== null){
            dialogObj.css({width:dialogObjWidth,height:dialogObjHeight,marginLeft:-dialogObjMarginLeft,marginTop:marginTop,top:0,overflow:'hidden'}).find('.navyDialogTable').css({'width':dialogObjWidth,'height':dialogObjHeight});
        }else{
            dialogObj.css({width:dialogObjWidth,height:dialogObjHeight,marginLeft:-dialogObjMarginLeft,marginTop:-dialogObjMarginTop,overflow:'hidden'}).find('.navyDialogTable').css({'width':dialogObjWidth,'height':dialogObjHeight});
        }
        //如果有遮罩层
        if(options.isMask){
            if(!(_this.bodyObj.find('.navyMaskWrapper').length)){
                var maskObj = $('<div style="z-index: '+(1+maxZindex)+'" class="navyMaskWrapper"></div>').appendTo(_this.bodyObj);
                if($.browser.msie && ($.browser.version == "6.0")){
                    var maskHeight;//遮罩层的高度
                    var documentObj = $(document);
                    var windowObj = $(window);
                    var documentObjHeight = maskHeight = documentObj.height();
                    var screenHeight = windowObj.height();//屏幕高度
                    if(screenHeight>=documentObjHeight){
                        maskHeight = screenHeight;
                    }
                    maskObj.height(maskHeight);
                }
            }
        }
        return this;
    },
    /**
     * 关闭对话框
     */
    closeDialog:function(){
        var _this = this;
        var options = _this.options;
        _this.dialogObj.unbind().remove();
        if(options.isMask){
            _this.bodyObj.find('.navyMaskWrapper').remove();
        }
        return this;
    }
};
/**
 * alert 提示框
 * @param content alert提示的内容
 * @param options alert的配置，默认是成功框包含属性如下：
 * options = {
 type : 'success',//alert框类型，默认是成功
 bgType ：0,//alert的背景类型
 dialogClass: 'navyDialogAlert',//增加alert的class,用于设置样式
 autoCloseSecond:3,//自动关闭alert框，默认是3秒钟
 position:'fixed',//alert的定位，默认是fixed
 target:'body',//alert框的容器，默认是body
 dialogWidth:null,//对话框的宽度
 dialogHeight:null,//对话框的高度
 marginLeft:null,//对话框距离容器左边的值
 marginTop:null//对话框距离容器右边的值
 * }
 * @return {NAVY.Dialog} 返回对话框对象
 * @constructor
 */
NAVY.Alert = function(content,options){
    options = options || {};
    var type = options.type || 'success';
    options.bgType = options.bgType || 0;
    var bgType = isNaN(options.bgType) ? 0 : options.bgType;
    var bgTypeMap = {
        '-1':'noCss3Bg',
        '0':'uiCss3BlackGradientBG',
        '1':'uiCss3BlueGradientBG',
        '2':'uiCss3GreyGradientBG',
        '3':'uiCss3LightBlueGradientBG',
        '4':'uiCss3LightSteelBlue',
        '5':'uiCss3RoyalBlueGradientBG',
        '6':'uiGoldenrodGradientBG'
    };
    var bgTypeClass = bgTypeMap[bgType] || bgTypeMap['0'];
    var alertClass = 'successNavyAlert';
    var dialogClass = options.dialogClass;
    if(dialogClass){
        dialogClass += ' navyDialogAlert';
    }else{
        dialogClass = 'navyDialogAlert';
    }
    switch (type){
        case 'error':
            alertClass = 'errorNavyAlert';
            break;
        case 'warning':
            alertClass = 'warningNavyAlert';
            break;
        case 'loading':
            alertClass = 'loadingNavyAlert';
            break;
        default :
            alertClass = 'successNavyAlert';
            break;
    }
    content = '<div class="navyAlert '+bgTypeClass+'"><div class="navyAlertSub '+alertClass+'">'+content+'</div></div>';
    var alertOptions = {
        isShowTiTle:false,//隐藏标题
        isShowCloseBtn:false,//隐藏关闭按钮
        isShowSureBtn:false,//隐藏确定按钮
        isShowCancelBtn:false,//隐藏取消按钮
        isMask:false,//隐藏遮罩层
        dialogClass: dialogClass,//增加alert的class,用于设置样式
        autoCloseSecond:options.autoCloseSecond || 3,//自动关闭alert框，默认是3秒钟
        position:options.position || 'fixed',//alert的定位，默认是fixed
        target:options.target || 'body',//alert框的容器，默认是body
        dialogWidth:options.dialogWidth || null,//对话框的宽度
        dialogHeight:options.dialogHeight || null,//对话框的高度
        marginLeft:options.marginLeft || null,//对话框距离容器左边的值
        marginTop:options.marginTop || null//对话框距离容器右边的值
    };
    if(type === 'loading'){
        alertOptions.autoCloseSecond = 0;
    }
    return new NAVY.Dialog(content,alertOptions);
};
/**
 * tip提示框
 * @param target 提示框的容器
 * @param content 提示框显示的内容
 * @param options tip的配置，具体参数如下：
 options = {
 isShowKnowBtn:true,//是否显示我知道了按钮，默认现实我知道了按钮
 knowBtnText：’知道了‘,//知道了按钮文本
 dialogClass: '',//增加tip的class,用于设置样式
 autoCloseSecond:0,//自动关闭tip框，默认是3秒钟
 position:'absolute',//tip的定位，默认是fixed
 target:'body',//tip框的容器，默认是body
 knowBtnCbf：function(){},//点击“知道了”按钮回调函数
 dialogWidth:null,//对话框的宽度
 dialogHeight:null,//对话框的高度
 marginLeft:|| null,//对话框距离容器左边的值
 marginTop:|| null,//对话框距离容器右边的值
 tipBorderColor:null,//提示框的颜色，注意16进制的颜色值前面加#号哦
 arrowValue:null//水平方向从左往右，垂直方向从上往下
 }
 * @return {NAVY.Dialog}
 * @constructor
 */
NAVY.Tip = function(target,content,options){
    options = options || {};
    if(options.isShowKnowBtn === undefined){
        options.isShowKnowBtn = true;
    }
    options.knowBtnText = options.knowBtnText || '知道了';
    var dialogClass = options.dialogClass;
    if(dialogClass){
        dialogClass += ' navyDialogTip';
    }else{
        dialogClass = 'navyDialogTip';
    }
    var tipOptions = {
        isShowTiTle:false,//隐藏标题
        isShowCloseBtn:false,//隐藏关闭按钮
        isShowSureBtn:false,//隐藏确定按钮
        isShowCancelBtn:false,//隐藏取消按钮
        isMask:false,//隐藏遮罩层
        dialogClass: dialogClass,//增加tip的class,用于设置样式
        autoCloseSecond:options.autoCloseSecond || 0,//自动关闭tip框，默认是3秒钟
        position:options.position || 'absolute',//tip的定位，默认是fixed
        target:target || options.target || 'body',//tip框的容器，默认是body
        knowBtnCbf : options.knowBtnCbf || noop,//点击“知道了”按钮回掉函数
        dialogWidth:options.dialogWidth || null,//对话框的宽度
        dialogHeight:options.dialogHeight || null,//对话框的高度
        marginLeft:options.marginLeft || null,//对话框距离容器左边的值
        marginTop:options.marginTop || null,//对话框距离容器右边的值
        tipBorderColor:options.tipBorderColor || null,//提示框的颜色，注意16进制的颜色值前面加#号哦
        arrowValue:options.arrowValue || null//水平方向从左往右，垂直方向从上往下
    };
    var direction = options.direction || 'top';
    //箭头的方向
    var arrowClass = 'arrowTop';
    switch (direction){
        case 'bottom':
            arrowClass = 'arrowBottom';
            break;
        case 'left':
            arrowClass = 'arrowLeft';
            break;
        case 'right':
            arrowClass = 'arrowRight';
            break;
        default :
            arrowClass = 'arrowTop';
            break;
    }
    //提示框的颜色，默认为红色
    var tipBorderColor = tipOptions.tipBorderColor;
    //箭头的便宜值，水平方向为margin-left,垂直方向为margin-top
    var arrowValue = tipOptions.arrowValue;
    //箭头1和箭头2css的映射对象
    var tipBorderColorMap1 = {},tipBorderColorMap2={};
    var paddingValue = 10;//加10是为了修复对话框内容容器.navyDialogContent的10px padding
    if(tipBorderColor !== null){
        //设置箭头颜色
        if(arrowValue !== null){
            //设置箭头位置
            tipBorderColorMap1.arrowBottom = 'style="border-top-color:'+tipBorderColor+';left:0;margin-left:'+(arrowValue+paddingValue)+'px;"';
            tipBorderColorMap1.arrowLeft = 'style="border-right-color:'+tipBorderColor+';top:0;margin-top:'+(arrowValue+paddingValue)+'px;"';
            tipBorderColorMap1.arrowRight = 'style="border-left-color:'+tipBorderColor+';top:0;margin-top:'+(arrowValue+paddingValue)+'px;"';
            tipBorderColorMap1.arrowTop = 'style="border-bottom-color:'+tipBorderColor+';left:0;margin-left:'+(arrowValue+paddingValue)+'px;"';
            tipBorderColorMap2.arrowBottom = 'style="left:0;margin-left:'+(arrowValue+paddingValue)+'px;"';
            tipBorderColorMap2.arrowLeft = 'style="top:0;margin-top:'+(arrowValue+paddingValue)+'px;"';
            tipBorderColorMap2.arrowRight = 'style="top:0;margin-top:'+(arrowValue+paddingValue)+'px;"';
            tipBorderColorMap2.arrowTop = 'style="left:0;margin-left:'+(arrowValue+paddingValue)+'px;"';
        }else{
            tipBorderColorMap1.arrowBottom = 'style="border-top-color:'+tipBorderColor+'"';
            tipBorderColorMap1.arrowLeft = 'style="border-right-color:'+tipBorderColor+'"';
            tipBorderColorMap1.arrowRight = 'style="border-left-color:'+tipBorderColor+'"';
            tipBorderColorMap1.arrowTop = 'style="border-bottom-color:'+tipBorderColor+'"';
        }
    }else if(arrowValue !== null){
        //设置箭头位置
        tipBorderColorMap1.arrowBottom = tipBorderColorMap2.arrowBottom = 'style="left:0;margin-left:'+(arrowValue+paddingValue)+'px;"';
        tipBorderColorMap1.arrowLeft = tipBorderColorMap2.arrowLeft = 'style="top:0;margin-top:'+(arrowValue+paddingValue)+'px;"';
        tipBorderColorMap1.arrowRight = tipBorderColorMap2.arrowRight = 'style="top:0;margin-top:'+(arrowValue+paddingValue)+'px;"';
        tipBorderColorMap1.arrowTop = tipBorderColorMap2.arrowTop = 'style="left:0;margin-left:'+(arrowValue+paddingValue)+'px;"';
    }
    var tipBorderColorCssText1 = tipBorderColorMap1[arrowClass] || '';
    var tipBorderColorCssText2 = tipBorderColorMap2[arrowClass] || '';
    content = '<div class="navyTip">'+content+'</div><div '+tipBorderColorCssText1+' class="navyTipArrow navyTipArrow1 absolute '+arrowClass+'1"></div><div '+tipBorderColorCssText2+' class="navyTipArrow navyTipArrow2 absolute '+arrowClass+'2"></div>';
    if(options.isShowKnowBtn){
        content += '<div class="navyDialogTipBtnContainer"><a href="javascript:;" class="navyDialogBtnClick navyDialogTipKnowBtn">'+options.knowBtnText+'</a></div>'
    }
    var tipObj = new NAVY.Dialog(content,tipOptions);
    if(tipBorderColor !== null){
        //改变提示框内容容器的边框值
        tipObj.dialogObj.find('.navyDialogContent').css({'border-color':tipBorderColor});
    }
    return tipObj;
};
//文本提示工具
NAVY.ToolTip = function(target,options){
    var defaultOptions = {
        spaceV : 3,//默认垂直方向间隔
        spaceH : 0,//默认水平方向间隔
        bgColor:'#000',//提示框背景颜色
        color:'#fff',//文本颜色
        opacity:0.8//透明度
    };
    $.extend(defaultOptions.options,options);
    var spaceV = defaultOptions.spaceV;
    var spaceH = defaultOptions.spaceH;
    var bgColor = defaultOptions.bgColor;
    var color = defaultOptions.color;
    var opacity = defaultOptions.opacity;
    var navyToolTipStyleTxt = 'style=color:'+color+';background:'+bgColor+';opacity:'+opacity+';filter:alpha(opacity='+opacity*100+')';
    target = $(target);
    var offsetLeft = target.offset().left,offsetTop = target.offset().top;
    var targetWidth = target.outerWidth(),targetHeight = target.outerHeight(),eventTarget = null,title=null;
    var toolTipLeft = 0,toolTipTop = 0,totalWidth = offsetLeft+targetWidth,totalHeight = offsetTop+targetHeight;
    target.find('[title]').hover(function(e){
        eventTarget = $(this);
        title = eventTarget.attr('title');
        if(title){
            eventTarget.attr('title','');
            var eventTargetLeft = eventTarget.offset().left+parseInt(eventTarget.css('padding-left'))+parseInt(eventTarget.css('margin-left'));
            var eventTargetTop = eventTarget.offset().top, eventTargetWidth = eventTarget.outerWidth(),eventTargetHeight = eventTarget.outerHeight();
            this.toolTipObj = $('<div class="navyToolTipWrapper"><div class="navyToolTip" '+navyToolTipStyleTxt+'>'+title+'</div></div>').appendTo(target);
            var toolTipWidth = this.toolTipObj.outerWidth()+spaceH,toolTipHeight = this.toolTipObj.outerHeight()+spaceV;
            var totalLeft = eventTargetLeft + toolTipWidth ,totalTop = eventTargetTop + toolTipHeight + eventTargetHeight;
            var tempLeft = (eventTargetLeft - offsetLeft) + toolTipWidth - targetWidth;
            tempLeft = tempLeft > 0 ? offsetLeft :tempLeft;
            var tempTop = (eventTargetTop - offsetTop) + eventTargetHeight + toolTipHeight - targetHeight;
            tempTop = tempTop > 0 ? eventTargetTop - toolTipHeight : tempTop;
            toolTipLeft = (totalLeft > totalWidth) ? tempLeft : eventTargetLeft;
            toolTipTop = (totalTop > totalHeight) ? tempTop : eventTargetTop+eventTargetHeight;
            this.toolTipObj.offset({left:toolTipLeft+spaceH,top:toolTipTop+spaceV});
            if($.browser.msie && ($.browser.version == "6.0")){
                this.toolTipObj.css({width:toolTipWidth-spaceH,height:toolTipHeight-spaceV});
            }
        }
    },function(e){
        $(this).attr('title',title);
        this.toolTipObj.remove();
    });
};
//Navy封装的$.ajax方法，第一个参数为jquery ajax方法常用参数，第二个为ajax 提示框参数
NAVY.Ajax = function(options,tipOptions){
    options = options || {};
    tipOptions = tipOptions || {};
    tipOptions.sendTip = tipOptions.sendTip || '数据下载中...';//发送前的提示框
    tipOptions.errorTip = tipOptions.errorTip || '出了点问题，请再试试！';//发送错误的提示框
    tipOptions.okTip = tipOptions.okTip || '操作成功了';//发送成功的提示框
    tipOptions.okObj = tipOptions.okObj || false;//okObj{key:ret,val:value}，这个时判断参数成功给予的提示框，假如有的话。
    options.error = options.error || noop;
    options.complete = options.complete || noop;
    options.success = options.success || noop;
    var okObj = tipOptions.okObj;
    var ajaxLoading = NAVY.Alert(tipOptions.sendTip,{type:'loading'});
    $.ajax({
        url:options.url || "",
        type:options.type || "post",
        dataType:options.dataType || "json",
        beforeSend:options.beforeSend || noop,
        success:function(data){
            ajaxLoading.closeDialog();
            if(okObj){
                if(data[okObj.key] == okObj.val){
                    NAVY.Alert(tipOptions.okTip);
                }else{
                    NAVY.Alert(tipOptions.errorTip,{type:'warning'});
                }
            }
            options.success(data);
        },
        complete:function(data){options.success(data)} ,
        error:function(data){options.error(data);ajaxLoading.closeDialog();NAVY.Alert(tipOptions.errorTip,'error')},
        timeout:options.timeout
    });
};