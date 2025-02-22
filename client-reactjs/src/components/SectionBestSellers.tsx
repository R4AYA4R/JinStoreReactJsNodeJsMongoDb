import { useState } from "react";

const SectionBestSellers = () => {

    return (
        <section className="sectionBestSellers">
            <div className="container">
                <div className="sectionBestSellers__inner">
                    <div className="sectionBestSellers__top">
                        <div className="sectionBestSellers__top-leftBlock">
                            <h3 className="sectionBestSellers__top-title">BEST SELLERS</h3>
                            <p className="sectionBestSellers__top-text">Dont miss this opportunity at a special discount just for this week.</p>
                        </div>
                        <a href="#" className="sectionNewArrivals__top-link">
                            <p className="sectionNewArrivals__top-linkText">View All</p>
                            <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                        </a>
                    </div>
                    <div className="sectionBestSellers__itemsBlock">
                        <div className="sectionBestSellers__itemsBlockSide">
                            {/* указываем класс этому элементу для карточки товара со значением нашего состояния classesForItem,чтобы когда наводим мышкой на кнопку добавления товара в корзину,изменять задний фон карточки товара на белый,а в данном случае еще и добавляем другой класс,чтобы сделать border-radius(радиус границы) правильным только для первой карточки товара */}
                            <div className="sectionNewArrivals__items-item sectionBestSellers__itemsBlockSide-item sectionBestSellers__itemsBlockSide-itemTop">
                                <div className="sectionBestSellers__item-imgBlock">
                                    {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                    <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                    <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                    <img src="/images/sectionNewArrivals/ItemImg (5).png" alt="" className="sectionNewArrivals__item-img" />
                                </div>
                                <div className="sectionBestSellers__item-infoBlock">
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
                                    <div className="sectionNewArrivals__item-cartBlock">
                                        {/* в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный  */}
                                        <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn">
                                            <p className="cartBlock__btn-text">Add to cart</p>
                                            <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__items-item sectionBestSellers__itemsBlockSide-item">

                                <div className="sectionBestSellers__item-imgBlock">
                                    {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                    <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                    <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                    <img src="/images/sectionNewArrivals/ItemImg (2).png" alt="" className="sectionNewArrivals__item-img" />
                                </div>
                                <div className="sectionBestSellers__item-infoBlock">
                                    <p className="sectionNewArrivals__item-text">Simply Orange Pulp Free
                                        Juice – 52 fl oz</p>
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
                                    <div className="sectionNewArrivals__item-cartBlock">
                                        {/* в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный  */}
                                        <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn">
                                            <p className="cartBlock__btn-text">Add to cart</p>
                                            <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__items-item sectionBestSellers__itemsBlockSide-item">
                                <div className="sectionBestSellers__item-imgBlock">
                                    {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                    <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                    <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                    <img src="/images/sectionNewArrivals/BeerImg.png" alt="" className="sectionNewArrivals__item-img" />
                                </div>
                                <div className="sectionBestSellers__item-infoBlock">
                                    <p className="sectionNewArrivals__item-text">A&W Caffeine-Free, Low Sodium Root
                                        Beer Soda Pop, 2 Liter Bottles</p>
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
                                        <p className="item__priceBlock-priceSale">$9.50</p>
                                        <p className="item__priceBlock-priceUsual">$11.20</p>
                                    </div>
                                    <div className="sectionNewArrivals__item-cartBlock">
                                        <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn">
                                            <p className="cartBlock__btn-text">Add to cart</p>
                                            <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sectionBestSellers__itemsBlock-midBlock">
                            <div className="sectionBestSellers__midBlock-item sectionNewArrivals__items-item">
                                <div className="sectionBestSellers__item-imgBlock sectionBestSellers__midItem-imgBlock">
                                    {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                    <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                    <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                    <img src="/images/sectionNewArrivals/VodkaImg.png" alt="" className="sectionNewArrivals__item-img sectionBestSellers__midBlock-itemImg" />
                                </div>
                                <div className="sectionNewArrivals__item-starsBlock sectionBestSellers__midItem-starsBlock">
                                    <div className="sectionNewArrivals__item-stars">
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    </div>
                                    <p className="starsBlock__text">(0)</p>
                                </div>
                                <p className="sectionNewArrivals__item-text sectionBestSellers__midItem-text">Absolut Grapefruit Paloma Sparkling Vodka Cocktail – 355ml</p>
                                <div className="sectionNewArrivals__item-priceBlock">
                                    <p className="item__priceBlock-priceSale">$6.99</p>
                                    <p className="item__priceBlock-priceUsual">$9.99</p>
                                </div>
                                <p className="sectoinBestSellers__midBlock-itemDesc">Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent Vivamus adipiscing nisl ut dolor dignissim semper.</p>
                                <div className="sectionNewArrivals__item-cartBlock">
                                    <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn sectionBestSellers__midItem-cartBtn">
                                        <p className="cartBlock__btn-text">Add to cart</p>
                                        <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="sectionBestSellers__itemsBlockSide">
                            <div className="sectionNewArrivals__items-item sectionBestSellers__itemsBlockSide-item sectionBestSellers__itemsBlockSide-itemTop">
                                <div className="sectionBestSellers__item-imgBlock">
                                    {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                    <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                    <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                    <img src="/images/sectionNewArrivals/ChocolateImg.png" alt="" className="sectionNewArrivals__item-img" />
                                </div>
                                <div className="sectionBestSellers__item-infoBlock">
                                    <p className="sectionNewArrivals__item-text">Real Plant-Powered Protein
                                        Shake – Double Chocolate</p>
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
                                        <p className="item__priceBlock-priceSale">$14.89</p>
                                        <p className="item__priceBlock-priceUsual">$17.89</p>
                                    </div>
                                    <div className="sectionNewArrivals__item-cartBlock">
                                        <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn">
                                            <p className="cartBlock__btn-text">Add to cart</p>
                                            <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__items-item sectionBestSellers__itemsBlockSide-item">
                                <div className="sectionBestSellers__item-imgBlock">
                                    {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                    <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                    <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                    <img src="/images/sectionNewArrivals/BeefImg.png" alt="" className="sectionNewArrivals__item-img" />
                                </div>
                                <div className="sectionBestSellers__item-infoBlock">
                                    <p className="sectionNewArrivals__item-text">USDA Choice Angus Beef T - Bone Steak – 0.70-1.50 lbs</p>
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
                                        <p className="item__priceBlock-priceSale">$12.89</p>
                                        <p className="item__priceBlock-priceUsual">$14.89</p>
                                    </div>
                                    <div className="sectionNewArrivals__item-cartBlock">
                                        <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn">
                                            <p className="cartBlock__btn-text">Add to cart</p>
                                            <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="sectionNewArrivals__items-item sectionBestSellers__itemsBlockSide-item sectionBestSellers__itemsBlockSide-itemLast">
                                <div className="sectionBestSellers__item-imgBlock">
                                    {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                                    <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                    <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                    <img src="/images/sectionNewArrivals/GroundBeefImg.png" alt="" className="sectionNewArrivals__item-img" />
                                </div>
                                <div className="sectionBestSellers__item-infoBlock">
                                    <p className="sectionNewArrivals__item-text">All Natural 85_15 Ground Beef – 1lb</p>
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
                                        <p className="item__priceBlock-priceSale">$7.75</p>
                                        <p className="item__priceBlock-priceUsual">$8.75</p>
                                    </div>
                                    <div className="sectionNewArrivals__item-cartBlock">
                                        <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn">
                                            <p className="cartBlock__btn-text">Add to cart</p>
                                            <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionBestSellers;