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
    },
    catalog(callback) {
        this.get((data) => {
            const result = data.reduce((arr, item) => {
                if(!arr.includes(item.category))
                arr.push(item.category)
                return arr
            }, [])

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

    

    if(location.hash){
        // getData.item(location.hash.substring(1), (data) => console.log(data))
    }

    if(location.pathname.includes('cart')) { //Корзина
        getData.cart(cartList, (data) => console.log(data))
    }
    // getData.catalog((data) => console.log(data))  
}
loadData()

// Создаем меню
const generateMenu = () => {

    const menuNav = document.querySelector('.menu-nav')


    getData.catalog((data) => {

        let navList = ''
        
        data.forEach(item => {
            navList += `
            
            <li class="menu-nav__item">
                <a href="categories.html?cat=${item}" class="menu-nav__link">${item}</a>
            </li>
            `
        });

        const generateMenuNav = `
        <ul class="menu-nav__list">
        <h2>Меню: </h2>
            ${navList}
        </ul>
        `;
        menuNav.insertAdjacentHTML('beforeend', generateMenuNav)
    })
    
}
generateMenu()

// Создаем item меню
const generateItem = () => {

    const container = document.querySelector('.container__item')


    getData.catalog((data) => {

        let itemList = ''
        
        data.forEach(item => {
            itemList += `
           
            `
        });

        const itemHTML = `
            ${itemList}
        `;
        container.insertAdjacentHTML('beforeend', itemHTML)
    })
    
}
generateItem()

const generateGoodsPage = () => {

    const itemTitle = document.querySelector('.item__title')
    const itemType  = document.querySelector('.item__type')

    const generateCards = (data) => {
        itemType.textContent = ''

        data.forEach((item) => {
            itemType.insertAdjacentHTML('afterbegin', `
            <a href="./cardProduct.html#idd001" class="item__items ">
                <img class="item__img" src="${item.img}" alt="">
                <div class="item__about">
                    <div class="item__about-desc">
                    <h2 class="item__about-name">${item.name}</h2>
                    <span class="item__about-weight"> ${item.weight}</span>
                </div>
                <p class="item__about-text">
                    ${item.description}
                </p>
                <div class="item__about-basket">
                    <h2 class="item__about-price">${item.price} ₽</h2>
                    <button class="item__about-btn"><span class="item__about-span">В корзину</span> <img src="./img/svg/Cart.svg" alt=""></button>
                </div>
                </div>
            </a>
            `)
        })
    }

    if(location.pathname.includes('categories') && location.search){
        const search  = decodeURI(location.search) ;
        const prop = search.split('=')[0].substring(1);
        const value = search.split('=')[1];
        if(prop === 's') {
            getData.search(value, generateCards)
            itemTitle.textContent = `Поиск: ${value}`
        } else if(prop === 'cat') {
            getData.category(prop, value, generateCards)
            itemTitle.textContent = value
        }

    }
}
generateGoodsPage()