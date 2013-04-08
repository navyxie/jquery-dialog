jquery-dialog
=============

jquery对话框和提示框

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>Dialog</title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <link rel="stylesheet" type="text/css" href="public/css/jquery.dialog.css" />
    <script type="text/javascript" src="public/js/jquery.js"></script>
    <script type="text/javascript" src="public/js/navy.util.js"></script>
    <script type="text/javascript" src="public/js/jquery.dialog.js"></script>
    <style type="text/css">
        *{
            margin: 0;
            padding: 0;
        }
        #wrapper{
            width: 600px;
            height: 200px;
            background: blue;
            margin: 20px auto;
            overflow: hidden;
        }
        #content{
            width: 100%;
        }
        #content ul{
            width: 100%;
            overflow: hidden;
        }
        #content ul li{
            width: 100%;
            height: 20px;
            line-height: 20px;
            float: left;
        }
    </style>
</head>
<body>
    <div id="wrapper">
        <div id="content"></div>
    </div>
<script type="text/javascript">
    $(function(){
//        具体的参数配置如下
//        title:'温馨提示',//对话框标题
//        isShowTiTle:true,//是否显示标题
//        closeText:'X',//关闭按钮文字
//        closeCbf:noop,//点击关闭按钮的回调
//        isShowCloseBtn:true,//是否显示关闭按钮
//        isMask:true,//是否显示遮罩层
//        isClickMaskCloseDialog:false,//点击遮罩层是否关闭对话框
//        clickMaskCbf:noop,//点击遮罩层的回调
//        sureBtnText:'确定',//确定按钮的文字
//        sureBtnCbf:noop,//点击确定按钮的回调
//        isShowSureBtn:true,//是否显示确定按钮
//        cancelBtnText:'取消',//取消按钮的文字
//        cancelBtnCbf:noop,//点击取消按钮的回调
//        isShowCancelBtn:true,//是否显示取消按钮
//        target:'body',//对话框的容器，默认为body
//        dialogWidth:null,//对话框的宽度
//        dialogHeight:null,//对话框的高度
//        marginLeft:null,//对话框距离容器左边的值
//        marginTop:null,//对话框距离容器右边的值
//        dialogClass:'',//对话框的容器类
//        position:'fixed',//对话框定位，默认为固定定位
//        autoClose:0//自动关闭对话框的时间，0表示不关闭,单位为秒
        //demo:
        new NAVY.Dialog('<div class="testNavy"><div class="test1">测试对话框测试对话框测试对话框</div><div class="test2">测试对话框测试对话框测试对话框</div></div><div>测试对话框测试对话框测试对话框测试对话框测试对话框测试对话框</div><div>测试对话框测试对话框测试对话框测试对话框测试对话框测试对话框</div>',{title:'navy',dialogClass:'loveyou',sureBtnCbf:function(){alert('点击了确定')},cancelBtnCbf:function(){alert('点击了取消')}});
    });
</script>
</body>
</html>
