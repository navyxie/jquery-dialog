/**
 * 基于jquery1.7+的自定义对话框插件
 * author:navy
 * email:navyxie2010@gmail.com
 * qq:951178609
 * version:1.0
 * date 2013-04-08
 */
var NAVY = NAVY || {};
var noop = function(){};
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
        autoClose:0//自动关闭对话框的时间，0表示不关闭,单位为秒
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
        dialogObj.on('click','.navyDialogBtnClick',function(e){
            var target = $(e.target);
            if(target.hasClass('closeDialogBtn')){
                options.closeCbf();
            }else if(target.hasClass('navySureBtn')){
                options.sureBtnCbf();
            }else if(target.hasClass('navyCancelBtn')){
                options.cancelBtnCbf();
            }
            _this.closeDialog();
        });
        //自动关闭
        if(options.autoClose !== 0){
            if(closeDialogBtnObj.length){
                closeDialogBtnObj.html('<span class="leftSecond">'+options.autoClose+'</span>秒后关闭')
            }
            var leftSecondDom = closeDialogBtnObj.find('.leftSecond')[0];
            var setTimeOutId = setTimeout(function(){
                _this.closeDialog();
                if(setTimeOutId){
                    clearTimeout(setTimeOutId);
                }
            },options.autoClose*1000);
            //倒计时
            NAVY.UTIL.Date.countDown(leftSecondDom,options.autoClose)
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
        $(options.target).append(dialogHtmlArr.join(''));
        _this.dialogObj = _this.targetObj.find('.navyDialogWrapper');
        var dialogObj = _this.dialogObj;
        var dialogObjWidth = options.dialogWidth || dialogObj.outerWidth(),dialogObjHeight = options.dialogHeight || dialogObj.outerHeight();
        //对话框最小宽度为130px
        dialogObjWidth = dialogObjWidth < 130 ? 130 : dialogObjWidth;
        var dialogObjMarginLeft = options.marginLeft || dialogObjWidth/2 , dialogObjMarginTop = options.marginTop || dialogObjHeight/2;
        //设置对话框的宽度和高度以及marginLeft和marginTop值
        dialogObj.css({width:dialogObjWidth,height:dialogObjHeight,marginLeft:-dialogObjMarginLeft,marginTop:-dialogObjMarginTop,overflow:'hidden'});
        if(options.isMask){
            if(!(_this.bodyObj.find('.navyMaskWrapper').length)){
                _this.bodyObj.append('<div style="z-index: '+(1+maxZindex)+'" class="navyMaskWrapper"></div>');
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
NAVY.Tip = {
    success:function(options){

    },
    error:function(options){

    },
    warning:function(options){

    }
};