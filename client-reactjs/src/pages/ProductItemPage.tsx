
const ProductItemPage = () => {

    return (
        <main className="main">
            <section className="sectionProductItemPage">
                <div className="container">
                    <div className="sectionProductItemPage__inner">
                        <div className="sectionProductItemPage__top sectionCatalog__topBlock">
                            <p className="sectionCatalog__topBlock-title">Home</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-title">Category</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-subtitle">Product Name</p>
                        </div>
                        <div className="sectionProductItemPage__itemBlock">
                            <div className="sectionProductItemPage__itemBlock-imgBlock">

                                {/* здесь слайдер лучше сделать */}

                                <img src="/images/sectionNewArrivals/BeerImg.png" alt="" className="sectionProductItemPage__imgBlock-img" />

                            </div>
                            <div className="sectionProductItemPage__itemBlock-infoBlock">
                                <h1 className="sectionProductItemPage__infoBlock-title">Marketside Fresh Organic Bananas,
                                    Bunch</h1>
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
                                <p className="sectionProductItemPage__infoBlock-desc">Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent Vivamus adipiscing nisl ut dolor dignissim semper</p>
                                <div className="sectionNewArrivals__item-priceBlock">
                                    <p className="item__priceBlock-priceSale">$0.89</p>
                                    <p className="item__priceBlock-priceUsual">$1.99</p>
                                </div>
                                <div className="sectionProductItemPage__infoBlock-inputBlock">
                                    <div className="infoBlock__inputBlock-leftInputBlock">
                                        <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus">
                                            <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                                        </button>
                                        <input type="number" className="infoBlock__inputBlock-input" />
                                        <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus">
                                            <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                                        </button>
                                    </div>
                                    <button className="infoBlock__inputBlock-cartBtn">
                                        <img src="/images/sectionProductItemPage/CartBtnImg.png" alt="" className="inputBlock__cartBtn-img" />
                                        <p className="inputBlock__cartBtn-text">Add to cart</p>
                                    </button>
                                </div>
                                <div className="sectionProductItemPage__infoBlock-subInfoBlock">
                                    <div className="infoBlock__subInfoBlock-topBlock">
                                        <img src="/images/sectionProductItemPage/CardImg.png" alt="" className="subInfoBlock__topBlock-img" />
                                        <p className="subInfoBlock__topBlock-text"><span className="subInfoBlock__topBlock-textSpan">Payment.</span> Payment upon receipt of goods, Payment by card in the department, Google Pay,
                                        Online card, -5% discount in case of payment</p>
                                    </div>
                                    <div className="infoBlock__subInfoBlock-topBlock infoBlock__subInfoBlock-bottomBlock">
                                        <img src="/images/sectionProductItemPage/SecurityImg.png" alt="" className="subInfoBlock__topBlock-img" />
                                        <p className="subInfoBlock__topBlock-text"><span className="subInfoBlock__topBlock-textSpan">Warranty.</span> The Consumer Protection Act does not provide for the return of this product of proper
                                        quality.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default ProductItemPage;