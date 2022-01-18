requirejs.config({
    paths:{
        'jquery':'/lib/jquery-3.6.0'
    }
});

define(['jquery','/js/modules/banner.js','/api/server.js'], function($,initBanner,{banner2Data,goodsData}) {
    banner2Data().then((res)=>{
        initBanner(res);
    });
});