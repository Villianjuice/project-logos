'use strict'
const PARAM = {
    cat: 'category',
    search: ['name', 'description', 'category']
}

const getData = {
    url: 'db/db.json',
    get(process){
        fetch(this.url)
            .then(response => response.json())
            .then(process)
    },
    item(value, callback) {
        this.get((data) => {
            const result = data.find(item => item.id === value)
            callback (result)
        })
    },
    cart(list, callback) {
        this.get((data) => {
            const result = data.filter(item => list.some(obj => obj.id === item.id))
            callback (result)
        })
    },
    category(prop, value, callback) {
        this.get((data) => {
            const result = data.filter(item => item[PARAM[prop]].toLowerCase() === value.toLowerCase())
            callback (result)
        })
    },
    search(value, callback) {
        this.get((data) => {
            const result = data.filter (item => {
                for(const prop in item) {
                    if (PARAM.search.includes(prop) && item[prop].toLowerCase().includes(value.toLowerCase())) {
                        return true;
                    }
                }
            })
            callback(result)
        })
    }

}




const cartList = [
    {
        id: 'idd015',
        count: 3
    },
    {
        id: 'idd045',
        count: 1
    },
]

const loadData = () => {

    if(location.search){
        const search  = decodeURI(location.search) ;
        const prop = search.split('=')[0].substring(1);
        const value = search.split('=')[1];
        if(prop === 's') {
            getData.search(value, (data) => console.log(data))
        } else if(prop === 'cat') {
            getData.category(prop, value, (data) => console.log(data))
        }

    }

    if(location.hash){
        getData.item(location.hash.substring(1), (data) => console.log(data))
    }

    if(location.pathname.includes('cart')) { //Корзина
        getData.cart(cartList, (data) => console.log(data))
    }  
}
loadData()