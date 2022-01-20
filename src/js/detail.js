requirejs.config({
    paths:{
        'jquery':'/lib/jquery-3.6.0'
    }
});

define(['jquery','/js/modules/banner.js','/api/server.js','/js/modules/cartStorage.js'], function($,initBanner,{banner2Data,goodsData},{addCartStorage}){
    banner2Data().then((res)=>{
        initBanner(res);
    });

    
    let goodsId = location.href.match(/goodsId=([^&]+)/)[1];
    let type = location.href.match(/type=([^&]+)/)[1];


    goodsData(type).then((res)=>{
        initGoods(res);
    });
    

    function initGoods(data){
        let list = data.goods_list.find((v)=>{
            return v.goodsId === goodsId;
        })
        
        let spans = list.chooseColor.map((v,i)=>{
            return `<span ${i===0 ? `class="active"` : ''}>${v}</span>`;
        }).join('');

        $('#detail').html(`
        <div class="l detail-img-container">
            <img src="${list.photoNormal}" alt="">
            <span></span>
        </div>
        <div class="detail-bigImg-container">
            <img src="${list.photoLarge}" alt="">
        </div>
        <div class="l detail-artical">
            <h2>${list.goodsName}</h2>
            <p>价格<span>￥${list.goodsPrice}.00</span></p>
            <p class="color">选择颜色${spans}</p>
            <div class="container">
                <div class="container-num l">
                    <input type="text" class="l" value="1"><button class="l add">+</button><button class="l sub">-</button>
                </div>
                <button class="l shopping-car">加入购物车</button>
                <button class="l order"><a href="/view/cart.html" target="_blank">立即下单</a></button>
            </div>
        </div>    
        `);



        bindGallery();  //放大镜
        bindMessage();  //数据渲染

        function bindGallery(){
            let small = $('.detail-img-container');
            let span = $('.detail-img-container span');
            let big = $('.detail-bigImg-container');
            let imgBig = $('.detail-bigImg-container img');
    
            small.on('mousedown',function(ev){
                span.show();
                big.show();
                let disX = ev.pageX;
                let disY = ev.pageY;
                $(document).on('mousemove',function(ev){
                    let L = ev.pageX - disX;
                    let T = ev.pageY -  disY;
                    if(L < 0){
                        L = 0;
                    }else if(L > small.width()-span.width()){
                        L = small.width()-span.width();
                    }
                    if(T < 0){
                        T = 0;
                    }else if(T > small.height()-span.height()){
                        T = small.height()-span.height();
                    }
                    span.css({
                        left:L,
                        top:T
                    })
                    scaleX = L/(small.width()-span.width());   
                    scaleY = T/(small.height()-span.height());   
                    imgBig.css({
                        left : Math.round(scaleX * (big.width()-imgBig.width())),
                        top : Math.round(scaleY * (big.height()-imgBig.height()))
                    })
                })
                .on('mouseup',function(){   
                    $(document).off('mousemove mouseup');
                    span.hide();
                    big.hide();
                })
                ev.preventDefault();
            })
        }
    
        function bindMessage(){
    
            let $add = $('.add');
            let $sub = $('.sub');
            let $input = $('input');
            let $shoppingCar =$('.shopping-car');
            let $order = $('.order');
            let num = Number($input.val());
    
            let $spans = $('.detail-artical .color span');
            let $goodsColor = $spans.eq(0).html();
            
            $add.on('click',function(){
                num++;
                $input.val(num);
            })
            $sub.on('click',function(){
                if(num>1){
                    num--;
                    $input.val(num);
                }
            })
            $input.on('input',function(){
                num = Number($input.val());
                if(isNaN(num) || num<1){
                    $input.val(1);
                    num = 1;
                }else{
                    $input.val(num);
                }
            })

            $spans.each((i,elem)=>{
                $(elem).on('click',function(){
                    $(this).addClass('active').siblings().removeClass('active');
                    $goodsColor = $(this).html();
                    console.log($goodsColor);
                })
                console.log($(elem).html());
            })
            
    
            $shoppingCar.on('click',function(){
                let data = {
                    "goodsName":list.goodsName,
                    "goodsPrice":list.goodsPrice,
                    "goodsColor":$goodsColor,
                    "goodsNum":num,
                    "isChecked":true
                };
                
                addCartStorage(data).then(()=>{
                    alert('添加购物车成功');
                });
            })
        }
    }

    
    
});