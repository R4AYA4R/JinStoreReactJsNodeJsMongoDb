import { useEffect, useState } from "react";
import { IProduct } from "../types/types";
import { useNavigate } from "react-router-dom";

// создаем интерфейс(тип) для пропсов компонента ProductItemArrivals,указываем в нем поле product с типом нашего интерфейса IProduct
interface IProductItemArrivals {
    product: IProduct
}

// указываем объекту пропсов(параметров,которые будем передавать этому компоненту) наш тип IProductItemArrivals
const ProductItemArrivals = ({ product }: IProductItemArrivals) => {

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const [valueDiscount,setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(()=>{

        setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

    },[product])

    return (
        <div className="sectionNewArrivals__items-item sectionNewArrivals__items-itemFirst">
            {/* потом по этому элементу иннера будем кликать,чтобы перейти на страницу товара,делаем его отдельно от кнопки добавления товара в корзину,чтобы их клики отличались,то есть чтобы можно было отдельно кликать на кнопку и на этот иннер */}
            <div className="sectionNewArrivals__item-inner">
                {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}

                {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                {product.priceDiscount ? 

                    <>
                        <div className="sectionNewArrivals__item-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                        {/* если valueDiscount больше 50,то есть скидка товара больше 50 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                        {valueDiscount > 50 && 
                            <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>
                        }
                        
                    </>
                    : ''
                }
                

                {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта product(пропс(параметр) этого компонента),потом когда сделаем раздачу статики на бэкэнде,то будем указывать путь до папки на бэкэнде, в onClick указываем наш router() (то есть хук useNavigate) и в нем указываем url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,то есть на страницу товара,указываем id у product с нижним подчеркиванием (_id),так как в базе данных mongodb по дефолту id указывается с нижним подчеркиванием */}
                <img src={`/images/sectionNewArrivals/${product.mainImage}`} alt="" className="sectionNewArrivals__item-img" onClick={()=>router(`/catalog/${product._id}`)}/>
                <p className="sectionNewArrivals__item-text"  onClick={()=>router(`/catalog/${product._id}`)}>{product.name}</p>
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


            </div>
            <div className="sectionNewArrivals__item-cartBlock">
                {/* в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный, этот функционал теперь не используем,так как теперь не меняем задний фон карточки товара,а только картинки и текста  */}
                <button className="sectionNewArrivals__cartBlock-btn">
                    <p className="cartBlock__btn-text">Add to cart</p>
                    <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                </button>
            </div>
        </div>
    )

}

export default ProductItemArrivals;