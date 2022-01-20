requirejs.config({
    paths:{
        'jquery':'/lib/jquery-3.6.0'
    }
});

define(['jquery','/js/modules/cartStorage.js'], function($,{getCartStorage,setCartStorage}) {
    let lists = getCartStorage();
    $ul = $('#shoppingList ul');
    $ul.html(`${
        lists.map((v)=>{
            return `<li><span><input class="check" type="checkbox" ${v.isChecked ?'checked':''}></span><span>${v.goodsName}</span><span class="price">${v.goodsPrice}</span><span class="num"><button class="sub">-</button><input type="text" value="${v.goodsNum}" class="input"><button class="add">+</button></span><span class="all">${v.goodsPrice*v.goodsNum}</span><span class="delete">删除</span></li>`;
        }).join('')
    }`);

    handleCart(lists);

    function handleCart(lists){
        let $ul = $('#shoppingList ul');
        
        let $total = $('#shoppingList .total');
        let $numAll = $('#shoppingList .numAll');
        let totalPrice = 0;
        let totalNum = 0;

        let $check = $('.head input'); 
        let checks = document.querySelectorAll('#shoppingList .check');
       
        all();      //渲染初始页面总计
        handleCheckAll();       //渲染初始页面全选
    
        $ul.on('click','button.add',function(){
            let $num = $(this).prev().val();    //每次都重新获取
            let $price = $(this).parent().prev().html();    
            $num++;              //改数量
            $(this).prev().val($num);
            $(this).parent().next().html($num * $price);        //改小计
            all();
    
            let index = $(this).parent().parent().index();
            lists[index].goodsNum = $num;
            setCartStorage(lists);
        })
    
        $ul.on('click','button.sub',function(){
            let $num = $(this).next().val();
            let $price = $(this).parent().prev().html(); 
            if($num>1){
                $(this).next().val(--$num); 
            }
            $(this).parent().next().html($num * $price);
            all();

            let index = $(this).parent().parent().index();
            lists[index].goodsNum = $num;
            setCartStorage(lists);
        })
    
        $ul.on('input','.input',function(){
            let $num = $(this).val();
            let $price = $(this).parent().prev().html(); 
            if(isNaN($num) || $num<1){
                $num = 1;
            }
            $(this).val($num);
            $(this).parent().next().html($num * $price);
            all();
            /* console.log($(this).val());
            console.log($(this).parent().next()); */
            let index = $(this).parent().parent().index();
            lists[index].goodsNum = $num;
            setCartStorage(lists);
        })

        $ul.on('click','span.delete',function(){
            $(this).parent().remove();
            let index = $(this).parent().index();
            lists.splice(index,1);
            setCartStorage(lists);
            all();
        })
    

        //一选多
        $check.on('click',function(){
            for(i=0;i<lists.length;i++){
                lists[i].isChecked = $(this).prop('checked');
                checks[i].checked = $(this).prop('checked');
            }
            all();
           
            setCartStorage(lists);
        })

        //多选一
        for(let i=0;i<checks.length;i++){
            checks[i].onclick = function(){
                handleCheckAll();
                all();
                setCartStorage(lists);
            }
        }

        function handleCheckAll(){
            let temp = true;
            for(let i=0;i<checks.length;i++){
                if(!checks[i].checked){
                    temp = false;
                }
                lists[i].isChecked = checks[i].checked;
            }
            $check.prop('checked',temp);
        }

        function all(){             //总计与商品总数
            let $inputs = $('#shoppingList .num>input');
            let $all = $('#shoppingList .all');
            totalPrice = 0;
            totalNum = 0;
            $all.each((i,elem)=>{
                if($(elem).parent().find('span input').prop('checked')){
                    totalPrice += Number($(elem).html());
                }
            });
            
            $inputs.each((i,elem)=>{
                if($(elem).parent().parent().find('span input').prop('checked')){
                    totalNum += Number($(elem).val());
                }
            });
            $total.html(totalPrice);
            $numAll.html(totalNum);
        }

    }

});

