define(['jquery'], function($){
    function initBanner(data){
        $('#banner').html(`
        <ul class="banner-ul">
            ${
                data.banner_list.map((v)=>{
                    return `<li class="l"><a href="${v.imgLink}"><img src="${v.imgUrl}" alt=""></a></li>`;
                }).join('')
            }
        </ul>
        <ol class="banner-ol">
            ${
                data.banner_list.map((v,i)=>{
                    return `<li class="l ${i===0 ? 'active' : ''}"></li>`;
                }).join('')
            }
        </ol>
        `);
        bindBanner();
    }

    
    function bindBanner(){
        $ul = $('.banner-ul');
        $olLis = $('.banner-ol li');
        $olLis.each(function(i,elem){
            $(elem).on('mouseover',function(){
                $(this).addClass('active').siblings().removeClass('active');
                $ul.stop().animate({left:(-1536) * $(this).index()},500,'linear');
            })
        })
    }
    return initBanner;
});