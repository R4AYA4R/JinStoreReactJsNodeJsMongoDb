import { useNavigate } from "react-router-dom";
import { IProduct } from "../types/types";
import { useEffect, useState } from "react";

interface IProductItemMidBlockBestSellers {
    product: IProduct
}

const ProductItemMidBlockBestSellers = ({ product }: IProductItemMidBlockBestSellers) => {

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

    }, [product])

    return (
        <div className="sectionBestSellers__midBlock-item sectionNewArrivals__items-item">
            <div className="sectionBestSellers__item-imgBlock sectionBestSellers__midItem-imgBlock">

                {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                {product.priceDiscount ?

                    <>
                        <div className="sectionNewArrivals__item-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                        {/* если valueDiscount больше 30,то есть скидка товара больше 50 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                        {valueDiscount > 30 &&
                            <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>
                        }

                    </>
                    : ''
                }

                {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта product(пропс(параметр) этого компонента),потом когда сделаем раздачу статики на бэкэнде,то будем указывать путь до папки на бэкэнде, в onClick указываем наш router() (то есть хук useNavigate) и в нем указываем url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,то есть на страницу товара,указываем id у product с нижним подчеркиванием (_id),так как в базе данных mongodb по дефолту id указывается с нижним подчеркиванием */}
                <img src={`/images/sectionNewArrivals/${product.mainImage}`} alt="" className="sectionNewArrivals__item-img sectionBestSellers__midBlock-itemImg" onClick={() => router(`/catalog/${product._id}`)} />
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
            <p className="sectionNewArrivals__item-text sectionBestSellers__midItem-text" onClick={() => router(`/catalog/${product._id}`)}>{product.name}</p>

            {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
            {product.priceDiscount ?

                <div className="sectionNewArrivals__item-priceBlock">
                    <p className="item__priceBlock-priceSale">${product.priceDiscount}</p>
                    <p className="item__priceBlock-priceUsual">${product.price}</p>
                </div>
                :
                <div className="sectionNewArrivals__item-priceBlock">
                    <p className="item__priceBlock-priceUsualDefault">${product.price}</p>
                </div>
            }

            <p className="sectoinBestSellers__midBlock-itemDesc">{product.descText}</p>
            <p className="sectionBestSellers__midBlock-itemSubDesc">This product is about to run out</p>
            <div className="sectionBestSellers__midBlock-itemGradient"></div>
            <div className="sectionNewArrivals__item-cartBlock">
                <button className="sectionNewArrivals__cartBlock-btn sectionBestSellers__cartBlock-btn sectionBestSellers__midItem-cartBtn">
                    <p className="cartBlock__btn-text">Add to cart</p>
                    <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                </button>
            </div>
        </div>
    )

}

export default ProductItemMidBlockBestSellers;