import { useEffect, useState } from "react";
import { IComment, IProduct } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../http/http";
import axios from "axios";

// создаем интерфейс(тип) для пропсов компонента ProductItemArrivals,указываем в нем поле product с типом нашего интерфейса IProduct
interface IProductItemArrivals {
    product: IProduct,
    comments: IComment[] | undefined
}

// указываем объекту пропсов(параметров,которые будем передавать этому компоненту) наш тип IProductItemArrivals
const ProductItemArrivals = ({ product, comments }: IProductItemArrivals) => {

    const [commentsForProduct, setCommentsForProduct] = useState<IComment[] | undefined>([]); // состояние для всех комментариев для отдельного товара,указываем ему тип в generic как IComment[] | undefined,указываем или undefined,так как выдает ошибку,когда изменяем это состояние на отфильтрованный массив комментариев по имени товара,что comments может быть undefined

    // это уже не используем,так как фильтруем весь массив comments уже в этом компоненте,не делая дополнительный запрос на сервер
    // делаем запрос на сервер для получения комментариев для этого товара
    // const { data: dataComments, refetch: refetchComments } = useQuery({
    //     queryKey: [`commentsForProduct${product.name}`], // обязательно указываем здесь в queryKey индивидуальное название для каждого товара,например,как product.name(оно уникально для каждого товара),чтобы для каждого товара отдельно шел запрос на сервер для получения комментариев,иначе будет только один запрос для одного товара и все,так как queryKey будет одинаковый и react query будет думать,что это одни и те же данные,и он будет их хешировать и показывать всем товарам как для одного,либо лучше сделать запрос для получения всех комментариев в родительском компоненте этих компонентов для товара,и просто передавать в эти дочерние компоненты товара массив комментариев и его фильтровать в компоненте товара, для каждого имени товара отдельный массив и его длину показывать,чтобы не было много запросов на сервер для каждого товара
    //     queryFn: async () => {

    //         const response = await axios.get<IComment[]>(`${API_URL}/getCommentsForProduct`, {

    //             params: {

    //                 productNameFor: product.name

    //             }

    //         }); // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productNameFor со значением name у товара на этой странице,конкретно указываем этот параметр в объекте в params у этой функции запроса,а не через знак вопроса просто в url,иначе,если в названии товара есть знаки амперсанта(&),то не будут найдены эти комментарии по такому названию,так как эти знаки амперсанта не правильно конкатенируются если их указать просто в url через знак вопроса 

    //         return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет массив объектов комментариев) и тд

    //     }

    // })

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

    }, [product])

    // при рендеринге(запуске) этого компонента и при изменении comments(массива всех комментариев) будет отработан код в этом useEffect,обязательно указываем comments в массиве зависимостей этого useEffect,иначе комментарии могут не успеть загрузиться и в состоянии commentForProduct будет пустой массив комментариев 
    useEffect(() => {

        setCommentsForProduct(comments?.filter(c => c.productNameFor === product.name)); // изменяем состояние commentsForProduct на отфильтрованный массив всех комментариев comments(пропс(параметр) этого компонента) по имени товара(product.name),то есть оставляем в массиве все объекты комментариев,у которых поле productNameFor равно product.name(объект товара,который передали пропсом(параметром) в этот компонент)

    }, [comments])

    return (
        <div className="sectionNewArrivals__items-item sectionNewArrivals__items-itemFirst">
            {/* потом по этому элементу иннера будем кликать,чтобы перейти на страницу товара,делаем его отдельно от кнопки добавления товара в корзину,чтобы их клики отличались,то есть чтобы можно было отдельно кликать на кнопку и на этот иннер */}
            <div className="sectionNewArrivals__item-inner">
                {/* будем потом проверять объект товара,есть ли у него скидка и тд,в зависимости от этого будем показывать или не показывать эти блоки скидок */}

                {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                {product.priceDiscount ?

                    <>
                        <div className="sectionNewArrivals__item-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                        {/* если valueDiscount больше 30,то есть скидка товара больше 30 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                        {valueDiscount > 30 &&
                            <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>
                        }

                    </>
                    : ''
                }


                {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта product(пропс(параметр) этого компонента),потом когда сделаем раздачу статики на бэкэнде,то будем указывать путь до папки на бэкэнде, в onClick указываем наш router() (то есть хук useNavigate) и в нем указываем url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,то есть на страницу товара,указываем id у product с нижним подчеркиванием (_id),так как в базе данных mongodb по дефолту id указывается с нижним подчеркиванием,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и значение поля mainImage у product(объекта товара) */}
                <img src={`http://localhost:5000/${product.mainImage}`} alt="" className="sectionNewArrivals__item-img" onClick={() => router(`/catalog/${product._id}`)} />
                <p className="sectionNewArrivals__item-text" onClick={() => router(`/catalog/${product._id}`)}>{product.name}</p>
                <div className="sectionNewArrivals__item-starsBlock">
                    <div className="sectionNewArrivals__item-stars">
                        {/* если product.rating равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                        <img src={product.rating === 0 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector.png"} alt="" className="sectionNewArrivals__item-starsImg" />
                        <img src={product.rating >= 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                        <img src={product.rating >= 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                        <img src={product.rating >= 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                        <img src={product.rating >= 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                    </div>
                    <p className="starsBlock__text">({commentsForProduct?.length})</p>
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