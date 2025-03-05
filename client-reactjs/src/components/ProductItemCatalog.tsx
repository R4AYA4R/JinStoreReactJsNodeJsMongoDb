
const ProductItemCatalog = () => {

    return (
        <div className="sectionNewArrivals__items-item sectionBestSellers__itemsBlockSide-item sectionCatalog__productsItems-item">
            <div className="sectionBestSellers__item-imgBlock">
                {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}
                <div className="sectionNewArrivals__item-saleBlock">20%</div>
                <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                <img src="/images/sectionNewArrivals/ItemImg (2).png" alt="" className="sectionNewArrivals__item-img sectionCatalog__productsItem-itemImg" />
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
                    <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn">
                        <p className="cartBlock__btn-text">Add to cart</p>
                        <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                    </button>
                </div>
            </div>
        </div>
    )

}

export default ProductItemCatalog;