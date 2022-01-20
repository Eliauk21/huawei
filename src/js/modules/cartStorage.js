
define(['jquery'], function($) {
    function addCartStorage(data){
        
        let p = new Promise((resolve,reject)=>{
            let cartList = getCartStorage();
            let flag = false;
            let index = 0;
            
            for(let i=0;i<cartList.length;i++){
                if( cartList[i].goodsName === data.goodsName && cartList[i].goodsColor === data.goodsColor ){
                  flag = true;
                  index = i;
                  break;
                }
            }
            console.log(flag);
            if(flag){
                cartList[index].goodsNum += data.goodsNum;
            }else{
                cartList.unshift(data);
            }
            setCartStorage(cartList);
            resolve();
        })
        return p;
    }
    function setCartStorage(art){
        localStorage.setItem('cartList',JSON.stringify(art));
    }
    function getCartStorage(){
        if(localStorage.getItem('cartList')){
            return JSON.parse(localStorage.getItem('cartList'));
        }else{
            return [];
        }
    }
    return {
        addCartStorage,
        setCartStorage,
        getCartStorage
    };
});