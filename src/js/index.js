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
                        <a href="/view/detail.html?goodsType=${data.type}$goodsId:${v.goodsId}" target="_blank">
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
    console.log($goodsUl);
    $('.goods li').each((i,elem)=>{
        $(elem).on('click',function(){
            $(this).addClass('active').siblings().removeClass('active');
            $goodsUl.eq( $(this).index()).addClass('show').siblings().removeClass('show');
        })
    })
});