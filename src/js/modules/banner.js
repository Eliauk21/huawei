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

        let $ul = $('.banner-ul');
        let $olLis = $('.banner-ol li');
        let timer;
        let num = 0;
        let temp = 1;
        bindBanner();
        autoBanner();

        function bindBanner(){
            $olLis.each(function(i,elem){
                $(elem).on('mouseover',function(){
                    clearInterval(timer);
                    $(this).addClass('active').siblings().removeClass('active');
                    $ul.stop().animate({left:(-1536) * $(this).index()},500,'linear');
                })
                .on('mouseout',function(){
                    num =  $(this).index();
                    autoBanner();
                })
            })
        }
    
        function autoBanner(){
            timer = setInterval(function(){
                if(num===0){
                    temp = 1;
                }else if(num===$olLis.length-1){
                    temp = -1;
                }
                num = num+temp;
                $ul.stop().animate({left:(-1536) * num},1000,'linear');
                $olLis.eq(num).addClass('active').siblings().removeClass('active');
            },2000)
        }
    }

    return initBanner;
});