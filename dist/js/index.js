requirejs.config({
    paths:{
        'jquery':'/lib/jquery-3.6.0'
    }
});


//相对地址是根据index.html来找的，因为index.html引入的这个主模块
//最好别用相对，太麻烦
define(['jquery','/js/modules/banner.js','/api/server.js'], function($,initBanner,{bannerData,goodsData}){
    bannerData().then((res)=>{
        initBanner(res);
    });

    let $ulPhone = $('.goods-phone');
    let $ulBook = $('.goods-book');
    let $ulPad = $('.goods-pad');
    goodsData('phone').then((res)=>{
        initGoods($ulPhone,res);
    });

    goodsData('book').then((res)=>{
        initGoods($ulBook,res);
    });

    goodsData('pad').then((res)=>{
        initGoods($ulPad,res);
    });

    function initGoods($elem,data){
        $elem.html(`
            ${
                data.goods_list.map((v)=>{
                    return `
                    <li class="l">
                        <a href="/view/detail.html?goodsId=${v.goodsId}&type=${data.type}" target="_blank">
                            <img src=${v.goodsImg}>
                            <h2>${v.goodsName}</h2>
                            <p>折叠万象</p>
                            <p>￥${v.goodsPrice}</p>
                            <span>赠送积分</span>
                        </a>
                    </li>
                    `;
                }).join('')
            }
        `);
    }

    $goodsUl = $('.goods-container ul');
    $('.goods li').each((i,elem)=>{
        $(elem).on('click',function(){
            $(this).addClass('active').siblings().removeClass('active');
            $goodsUl.eq( $(this).index()).addClass('show').siblings().removeClass('show');
        })
    })


    //搜索框
    let $sousuo = $('nav .fir .iconfont');
    let $fir = $('nav .fir');
    let $sec = $('nav .sec');
    let $input = $('nav .sec .input');
    let $del = $('nav .sec .del');
    /* let $container = $('nav .w'); */
    $sousuo.on('click',function(){
        $fir.css('display','none');
        $sec.css({
            display:'block',
            /* marginLeft:-266 */
        });
        $sec.animate({left:350,opacity:1},1000,'linear');


        let val = $input.val();     //提示词
        let nowValue;       //失去焦点时value值
        let $ul = $('nav .sec ul');
        let historys;

        //表单获取焦点事件
        $input.on('focus',function(){
            if(nowValue === val){
                $input.val(val);
            }else{
                $input.val('');
            }
            $input.css('color','black');

            $sec.css({
                borderRadius:0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
            })
            $ul.css('display','block');
        })
        
        //表单失去焦点事件
        $input.on('blur',function(){
            nowValue = $input.val(); 
            if((nowValue === val)||(nowValue === '')){
                $input.val(val);
            }else{
                $input.val(nowValue);
            }
            $input.css('color','#ccc');

            $sec.css({
                borderRadius:20
            })
            $ul.css('display','none');

            if(nowValue !== ''){
                historys = JSON.parse(localStorage.getItem('historys')||'[]');  //取出历史记录
                historys.push(nowValue);    //放入新数据
                let lists = [];     //去重
                for(i=0;i<historys.length;i++){
                    if(!lists.includes(historys[i])){
                        lists.unshift(historys[i]);
                    }
                }
                $ul.html(`${    //将历史记录渲染到页面
                    lists.map((v)=>{
                        return `<li>${v}</li>`;
                    }).join('')
                }`);
                localStorage.setItem('historys',JSON.stringify(lists));     //将去重后的数组存入历史记录
            }
        })

        $del.on('click',function(){
            $sec.css({
                display:'none',
                left: 999,
                opacity:0
            });
            $fir.css('display','block');
        })
    })
});