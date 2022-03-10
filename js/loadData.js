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
// const generateItem = () => {

//     const container = document.querySelector('.container__item')


//     getData.catalog((data) => {

//         let itemList = ''
        
//         data.forEach(item => {
//             itemList += `
           
//             `
//         });

//         const itemHTML = `
//             ${itemList}
//         `;
//         container.insertAdjacentHTML('beforeend', itemHTML)
//     })
    
// }
// generateItem()

const generateGoodsPage = () => {
    const itemTitle = document.querySelector('.item__title')

    const generateCards = (data) => {
        
        const itemType  = document.querySelector('.item__type')

        itemType.textContent = ''; // !!!!!!!

        data.forEach((item) => {
            itemType.insertAdjacentHTML('afterbegin', `
            <a href="./cardProduct.html#${item.id}" class="item__items ">
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
                    <button class="item__about-btn" data-idd="${item.id}"><span class="item__about-span" >В корзину</span> <img src="./img/svg/Cart.svg" alt=""></button>
                </div>
                </div>
            </a>
            `)
        })

        itemType.addEventListener('click', (e) => {
            const itemAboutBtn = e.target.closest('.item__about-btn')
    
            if(itemAboutBtn) {
                e.preventDefault();
                userData.cartList = itemAboutBtn.dataset.idd;
                console.log(userData.cartList);
            }
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

const generateItemPage = () => {
    const renderCard = ({category, count, description, img, name, price, weight, id}) => {
        const cardImg = document.querySelector('.card__img');
        const cardTitle = document.querySelector('.card__title');
        const cardText = document.querySelector('.card__text');
        const cardWeight = document.querySelector('.card__weight');
        const cardPrice = document.querySelector('.card__price');
        const cardBasket = document.querySelector('.card__basket');

        cardImg.textContent = ''
        cardTitle.textContent = name
        cardText.textContent = description
        cardWeight.textContent = 'Вес: ' + weight
        cardPrice.textContent = price + ' ₽'
        cardBasket.dataset.idd = id
        
        
        cardImg.insertAdjacentHTML('beforeend', `
            <img src="${img}" alt="${name}">
        `)
        
        cardBasket.addEventListener('click', () => {
            userData.cartList = id
        })
        
    }


    if(location.hash && location.pathname.includes('cardProduct')){
        getData.item(location.hash.substring(1), renderCard)
    }
}
generateItemPage()

const getLocalStorage = key => {
    return localStorage.getItem(key) ? 
    JSON.parse(localStorage.getItem(key)):
    []
}

const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

const userData =  {

    cartListData: getLocalStorage('cartList'),

    get cartList() {
        return this.cartListData
    },
    set cartList(id) {
        let obj = this.cartListData.find(item => item.id === id);
        if(obj) {
            obj.count ++
        } else {
            obj = {
                id,
                count: 1,
            };
            this.cartListData.push(obj);
        }
        setLocalStorage('cartList', this.cartList)
    },
    set changeCountCartList(itemCart) {
        let obj = this.cartListData.find(item => item.id === itemCart.id);
        obj.count = itemCart.count;

        setLocalStorage('cartList', this.cartList)
    },
    set deleteItemCart(idd) {
        let index = -1;
        this.cartList.forEach((item, i) => {
            if(item.id === idd) {
                index = i
            }
        })
        this.cartList.splice(index, 1)
        setLocalStorage('cartList', this.cartList)
    },
    

}

const generateCartPage = () => {

    

    if(location.pathname.includes('cart')) { //Корзина
        const cartList = document.querySelector('.cart-items')
        const cartTotalPrice = document.querySelector('.total__price')
        const renderCartList = (data) => {

            cartList.textContent = ''
            let totalPrice = 0

            data.forEach(({name:itemName, id, img, price, weight, description, count}) => {
                let options = '';

                let countUser = userData.cartList.find(item => item.id === id).count;

                if(countUser > count) {
                    countUser = count
                }

                for (let i = 1; i <= count; i++) {
                    options += `
                        <option value = ${i} ${countUser === i ? 'selected' : ''}>${i}</option>
                    `
                }

                totalPrice += countUser * price

                cartList.insertAdjacentHTML('beforeend', `
                <div class="cart-item">
                    <div class="cart-item__info">
                        <img src="${img}" alt="img">
                    </div>
                    <div class="cart-item__content">
                    <a href="./cardProduct.html#${id}" class="cart-item__title">${itemName}</a>
                    <p class="cart-item__text">${description}</p>
                    </div>
                    <div class="product-controls__quantity">
                        <select title="Выберите количество" aria-label="Выберите количество" data-idd=${id}>
                        ${options}
        
                        </select>
                    </div>
                <div>
                    <h4 class="cart-item__price">${price * countUser} ₽</h4>
                </div>
                    <div>
                        <button class="units__btn delete" data-idd="${id}">х</button>
                    </div>
                </div>
                `)
            });
            cartTotalPrice.textContent = totalPrice
            
        }
        cartList.addEventListener('change', e => {
            
            userData.changeCountCartList = {
                id: e.target.dataset.idd,
                count: parseInt(e.target.value) 
            }
            getData.cart(userData.cartList, renderCartList)
        })

        cartList.addEventListener('click', (e) => {
            const target = e.target;
            const btnRemove = target.closest('.delete')
            if(btnRemove) {
                userData.deleteItemCart = btnRemove.dataset.idd
                getData.cart(userData.cartList, renderCartList)
            }
            
        })

        getData.cart(userData.cartList, renderCartList)

        
    }
}
generateCartPage()

