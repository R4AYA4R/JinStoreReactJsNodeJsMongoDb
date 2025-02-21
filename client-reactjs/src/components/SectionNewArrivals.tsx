import { useState } from "react";

const SectionNewArrivals = () => {

    const [classesForItem,setClassesForItem] = useState('sectionNewArrivals__items-item'); // указываем состояние для дефолтного класса карточки товара


    // функция для добавления класса для карточки товара
    const addNoHoverClass = () => {
        
        setClassesForItem((prev) => prev + ' sectionNewArrivals__items-itemNoHover'); // изменяем наше состояние classesForItem на prev(предыдущее значение,то есть текущее) и плюс строка с пробелом и названием другого класса,делаем так,чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый

    }

    // функция для удаления класса sectionNewArrivals__items-itemNoHover для карточки товара,то есть в данном случае просто указываем состоянию classesForItem значение с дефолтным классом для карточки товара,это чтобы когда убираем курсор мыши с кнопки добавления товара в корзину класс для карточки товара был обычный(дефолтный)
    const removeNoHoverClass = () => {
        
        setClassesForItem('sectionNewArrivals__items-item');

    }

    return (
        <section className="sectionNewArrivals">
            <div className="container">
                <div className="sectionNewArrivals__inner">
                    <div className="sectionNewArrivals__top">
                        <h2 className="sectionNewArrivals__title">New Arrivals</h2>
                        <a href="#" className="sectionNewArrivals__top-link">
                            <p className="sectionNewArrivals__top-linkText">View All</p>
                            <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                        </a>
                    </div>
                    <div className="sectionNewArrivals__items">
                        {/* указываем класс этому элементу для карточки товара со значением нашего состояния classesForItem,чтобы когда наводим мышкой на кнопку добавления товара в корзину,изменять задний фон карточки товара на белый,а в данном случае еще и добавляем другой класс,чтобы сделать border-radius(радиус границы) правильным только для первой карточки товара */}
                        <div className={`${classesForItem} sectionNewArrivals__items-itemFirst`}>
                            {/* потом по этому элементу иннера будем кликать,чтобы перейти на страницу товара,делаем его отдельно от кнопки добавления товара в корзину,чтобы их клики отличались,то есть чтобы можно было отдельно кликать на кнопку и на этот иннер */}
                            <div className="sectionNewArrivals__item-inner">
                                {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                <img src="/images/sectionNewArrivals/ItemImg (2).png" alt="" className="sectionNewArrivals__item-img" />
                                <p className="sectionNewArrivals__item-text">100 Percent Apple Juice – 64 fl oz Bottle</p>
                                <div className="sectionNewArrivals__item-starsBlock">
                                    <div className="sectionNewArrivals__item-stars">
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    </div>
                                    <p className="starsBlock__text">(0)</p>
                                </div>
                                <div className="sectionNewArrivals__item-priceBlock">
                                    <p className="item__priceBlock-priceSale">$0.50</p>
                                    <p className="item__priceBlock-priceUsual">$1.99</p>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__item-cartBlock">
                                {/* в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный  */}
                                <button className="sectionNewArrivals__cartBlock-btn" onMouseEnter={addNoHoverClass} onMouseLeave={removeNoHoverClass}>
                                    <p className="cartBlock__btn-text">Add to cart</p>
                                    <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                </button>
                            </div>
                        </div>
                        <div className={`${classesForItem}`}>
                            <div className="sectionNewArrivals__item-inner">
                                {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                <img src="/images/sectionNewArrivals/ItemImg (3).png" alt="" className="sectionNewArrivals__item-img" />
                                <p className="sectionNewArrivals__item-text">Simply Orange Pulp Free Juice – 52 fl oz</p>
                                <div className="sectionNewArrivals__item-starsBlock">
                                    <div className="sectionNewArrivals__item-stars">
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    </div>
                                    <p className="starsBlock__text">(0)</p>
                                </div>
                                <div className="sectionNewArrivals__item-priceBlock">
                                    <p className="item__priceBlock-priceSale">$2.45</p>
                                    <p className="item__priceBlock-priceUsual">$4.13</p>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__item-cartBlock">
                                {/* в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный  */}
                                <button className="sectionNewArrivals__cartBlock-btn" onMouseEnter={addNoHoverClass} onMouseLeave={removeNoHoverClass}>
                                    <p className="cartBlock__btn-text">Add to cart</p>
                                    <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                </button>
                            </div>
                        </div>
                        <div className={`${classesForItem}`}>
                            <div className="sectionNewArrivals__item-inner">
                                {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                <img src="/images/sectionNewArrivals/ItemImg (4).png" alt="" className="sectionNewArrivals__item-img" />
                                <p className="sectionNewArrivals__item-text">California Pizza Kitchen Margherita, Crispy Thin</p>
                                <div className="sectionNewArrivals__item-starsBlock">
                                    <div className="sectionNewArrivals__item-stars">
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    </div>
                                    <p className="starsBlock__text">(0)</p>
                                </div>
                                <div className="sectionNewArrivals__item-priceBlock">
                                    <p className="item__priceBlock-priceSale">$11.77</p>
                                    <p className="item__priceBlock-priceUsual">$14.77</p>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__item-cartBlock">
                                {/* в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный  */}
                                <button className="sectionNewArrivals__cartBlock-btn" onMouseEnter={addNoHoverClass} onMouseLeave={removeNoHoverClass}>
                                    <p className="cartBlock__btn-text">Add to cart</p>
                                    <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                </button>
                            </div>
                        </div>
                        <div className={`${classesForItem}`}>
                            <div className="sectionNewArrivals__item-inner">
                                {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                <img src="/images/sectionNewArrivals/ItemImg (5).png" alt="" className="sectionNewArrivals__item-img" />
                                <p className="sectionNewArrivals__item-text">Cantaloupe Melon Fresh Organic Cut</p>
                                <div className="sectionNewArrivals__item-starsBlock">
                                    <div className="sectionNewArrivals__item-stars">
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    </div>
                                    <p className="starsBlock__text">(0)</p>
                                </div>
                                <div className="sectionNewArrivals__item-priceBlock">
                                    <p className="item__priceBlock-priceSale">$1.25</p>
                                    <p className="item__priceBlock-priceUsual">$2.98</p>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__item-cartBlock">
                                {/* в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный  */}
                                <button className="sectionNewArrivals__cartBlock-btn" onMouseEnter={addNoHoverClass} onMouseLeave={removeNoHoverClass}>
                                    <p className="cartBlock__btn-text">Add to cart</p>
                                    <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                </button>
                            </div>
                        </div>

                        {/* будем потом по id для этого item указывать ему класс без правой границы(border),когда будем пробегаться по массиву товаров */}
                        <div className={`${classesForItem} sectionNewArrivals__items-itemNoBorder sectionNewArrivals__items-itemLast}`}>
                            <div className="sectionNewArrivals__item-inner">
                                {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                <img src="/images/sectionNewArrivals/ItemImg (6).png" alt="" className="sectionNewArrivals__item-img" />
                                <p className="sectionNewArrivals__item-text">Great Value Rising Crust Frozen Pizza, Supreme</p>
                                <div className="sectionNewArrivals__item-starsBlock">
                                    <div className="sectionNewArrivals__item-stars">
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    </div>
                                    <p className="starsBlock__text">(0)</p>
                                </div>
                                <div className="sectionNewArrivals__item-priceBlock">
                                    <p className="item__priceBlock-priceSale">$0.50</p>
                                    <p className="item__priceBlock-priceUsual">$1.99</p>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__item-cartBlock">
                                {/* в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный  */}
                                <button className="sectionNewArrivals__cartBlock-btn" onMouseEnter={addNoHoverClass} onMouseLeave={removeNoHoverClass}>
                                    <p className="cartBlock__btn-text">Add to cart</p>
                                    <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionNewArrivals;