import { data, useNavigate } from "react-router-dom";
import { IComment, IProduct, IProductCart, IProductsCartResponse } from "../types/types";
import { useEffect, useState } from "react";
import { QueryObserverResult, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";

interface IProductItemMidBlockBestSellers {
    product: IProduct,
    comments: IComment[] | undefined,
    refetchProductsCart: () => Promise<QueryObserverResult<IProductsCartResponse, Error>>, // указываем поле для функции переобновления данных товаров корзины,указываем,что это стрелочная функция и она возвращает тип Promise,в котором QueryObserverResult,в котором IProductsCartResponse и тип Error(что может прийти еще и ошибка),скопировали этот весь тип в файле sectionNewArrivals у этой функции refetchProductsCart у react query(tanstack query),этот полный тип подсветил vs code
    dataProductsCart: IProductsCartResponse | undefined // указываем это поле для ответа от сервера на получение товаров корзины,указываем ему тип как наш IProductsCartResponse или undefined(указываем или undefined,иначе выдает ошибку,что нельзя назначить тип просто IProductsCartResponse,так как это поле может быть еще undefined)
}

const ProductItemMidBlockBestSellers = ({ product, comments, refetchProductsCart, dataProductsCart }: IProductItemMidBlockBestSellers) => {

    const [commentsForProduct, setCommentsForProduct] = useState<IComment[] | undefined>([]); // состояние для всех комментариев для отдельного товара,указываем ему тип в generic как IComment[] | undefined,указываем или undefined,так как выдает ошибку,когда изменяем это состояние на отфильтрованный массив комментариев по имени товара,что comments может быть undefined


    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { mutate: mutateAddProductCart } = useMutation({
        mutationKey: ['add productCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип
            await axios.post<IProductCart>(`${API_URL}/createProductCart`, productCart);

        },

        // при успешной мутации,то есть в данном случае при успешном добавлении товара в корзину обновляем dataProductsCart(массив объектов товаров корзины),чтобы сразу показывалось изменение в корзине товаров,если так не сделать,то текст Already in Cart(что товар уже в корзине) будет показан только после обновления страницы,а не сразу,так как массив объектов корзины еще не переобновился
        onSuccess() {

            refetchProductsCart();

        }

    })

    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

    }, [product])

    // при рендеринге(запуске) этого компонента и при изменении comments(массива всех комментариев) будет отработан код в этом useEffect,обязательно указываем comments в массиве зависимостей этого useEffect,иначе комментарии могут не успеть загрузиться и в состоянии commentForProduct будет пустой массив комментариев 
    useEffect(() => {

        setCommentsForProduct(comments?.filter(c => c.productNameFor === product.name)); // изменяем состояние commentsForProduct на отфильтрованный массив всех комментариев comments(пропс(параметр) этого компонента) по имени товара(product.name),то есть оставляем в массиве все объекты комментариев,у которых поле productNameFor равно product.name(объект товара,который передали пропсом(параметром) в этот компонент)

    }, [comments])

    const isExistsCart = dataProductsCart?.allProductsCart.some(p => p.name === product?.name); // делаем проверку методом some и результат записываем в переменную isExistsCart,если в dataProductsCart(в массиве объектов товаровкорзины для определенного авторизованного пользователя) есть элемент(объект) name которого равен product name(то есть name этого товара на этой странице),в итоге в isExistsCart будет помещено true или false в зависимости от проверки методом some

    const addProductToCart = () => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то помещаем товар в корзину,в другом случае перекидываем пользователя на страницу авторизации
        if (user.userName) {

            // если product true,то есть product есть(делаем эту проверку,так как выдает ошибку,что product может быть undefined)
            if (product) {

                let totalPriceProduct; // создаем переменную для общей суммы товара,указываем ей let,чтобы изменять значение,считаем эту общую цену,чтобы потом в корзине сразу можно было нормально отобразить общую сумму чека корзины

                // если product.priceDiscount true,то есть у товара есть цена со скидкой
                if (product.priceDiscount) {

                    totalPriceProduct = product.amount * product.priceDiscount; // изменяем значение totalPriceProduct на product.amount(по дефолту оно 1), умноженное на product.priceDiscount(цену товара со скидкой)

                } else {
                    // в другом случае,если у товара нет скидки,то изменяем значение totalPriceProduct на product.amount(по дефолту оно 1), умноженное на product.price(обычную цену товара)
                    totalPriceProduct = product.amount * product.price;

                }

                mutateAddProductCart({ name: product?.name, category: product?.category, amount: product.amount, mainImage: product?.mainImage, descImages: product?.descImages, price: product?.price, priceDiscount: product?.priceDiscount, priceFilter: product?.priceFilter, rating: product?.rating, totalPrice: totalPriceProduct, totalPriceDiscount: product?.totalPriceDiscount, usualProductId: product?._id, forUser: user.id } as IProductCart); // передаем в mutateAddProductCart объект типа IProductCart только таким образом,разворачивая в объект все необходимые поля(то есть наш product(объект блюда в данном случае),в котором полe name,делаем поле name со значением,как и у этого товара name(product.name) и остальные поля также,указываем только полю amount значение как 1,так как сделали так,что можно в этом компоненте добавлять только одно количество этого товара в корзину,указываем 

            }


        } else {

            router('/userPage');  // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

        }

    }


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

                {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта product(пропс(параметр) этого компонента),потом когда сделаем раздачу статики на бэкэнде,то будем указывать путь до папки на бэкэнде, в onClick указываем наш router() (то есть хук useNavigate) и в нем указываем url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,то есть на страницу товара,указываем id у product с нижним подчеркиванием (_id),так как в базе данных mongodb по дефолту id указывается с нижним подчеркиванием,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и значение поля mainImage у product(объекта товара) */}
                <img src={`http://localhost:5000/${product.mainImage}`} alt="" className="sectionNewArrivals__item-img sectionBestSellers__midBlock-itemImg" onClick={() => router(`/catalog/${product._id}`)} />
            </div>
            <div className="sectionNewArrivals__item-starsBlock sectionBestSellers__midItem-starsBlock">
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

            {/* если product.name.length > 52,то есть длина названия по количеству символов больше 52(это значение посчитали в зависимости от дизайна,сколько символов в названии нормально влазит в максимальную ширину и высоту текста названия),то показываем такой блок текста названия товара,с помощью substring() вырезаем из строки названия товара опеределенное количество символов(передаем первым параметром в substring с какого символа по индексу начинать вырезать,вторым параметром передаем до какого символа по индексу вырезать,в данном случае подобрали значение до 48 символа по индексу вырезать,так как еще нужно место на троеточие),и в конце добавляем троеточие,чтобы красиво смотрелось,в другом случае показываем обычное название товара(product.name) */}
            {product.name.length > 57 ?
                <p className="sectionNewArrivals__item-text sectionBestSellers__midItem-text" onClick={() => router(`/catalog/${product._id}`)}>{(product.name).substring(0, 57)}...</p>
                : <p className="sectionNewArrivals__item-text sectionBestSellers__midItem-text" onClick={() => router(`/catalog/${product._id}`)}>{product.name}</p>
            }

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

                {/* если isExistsCart true(то есть этот товарна этой странице уже находится в корзине) и если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку),то показываем текст,в другом случае если tabChangePrice false(то есть таб с инпутом для изменения цены товара для админа равен false,то есть не показан),то показываем кнопку добавления товара в корзину и инпут с количеством этого товара */}
                {user.userName && isExistsCart ?

                    <h3 className="textAlreadyInCart sectionArrivals__item-textAlreadyInCart">Already in Cart</h3>
                    :
                    // в onMouseEnter(то есть когда наводим курсор мыши на эту кнопку) указываем нашу функцию addNoHoverClass, а в onMouseLeave(то есть когда убираем курсор мыши с этой кнопки) указываем нашу функцию removeNoHoverClass,это чтобы когда наводим мышкой на кнопку добавления товара в корзину,задний фон карточки товара стал белый,а при убирании курсора мыши с кнопки добавления товара в корзину стал обычный, этот функционал теперь не используем,так как теперь не меняем задний фон карточки товара,а только картинки и текста,в данном случае не делаем эти стили,описанные выше,и просто в onClick этой кнопке указываем нашу функцию addProductToCart
                    <button onClick={addProductToCart} className="sectionNewArrivals__cartBlock-btn">
                        <p className="cartBlock__btn-text">Add to cart</p>
                        <img src="/images/sectionNewArrivals/PlusImg.png" alt="" className="cartBlock__btn-img" />
                    </button>

                }

            </div>
        </div>
    )

}

export default ProductItemMidBlockBestSellers;