import { RefObject, useEffect, useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ICommentResponse, IProduct, IProductsCartResponse } from "../types/types";
import ProductItemArrivals from "./ProductItemArrivals";
import { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";

interface ISectionNewArrivals{
    className:string
}

const SectionNewArrivals = ({className}:ISectionNewArrivals) => {

    const [sectionNewArrivalsClass,setSectionNewArrivalsClass] = useState(className); // состояние для класса этой секции sectionNewArrivals,по дефолту делаем ей значение как пропс(параметр) className

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    // при запуске(рендеринге) этого компонента будет отработан код в этом useEffect,так как он с пустым массивом зависимостей
    useEffect(()=>{

        // если пропс(параметр) className равен пустой строке(то есть это секция будет на странице HomePage,там не будет такой анимации и отступов как на странице ProductItemPage),то изменяем состояние sectionNewArrivalsClass на значение дефолтного класса для этой секции sectionNewArrivals
        if(className === ''){
            setSectionNewArrivalsClass("sectionNewArrivals");
        }

    },[])

    const sectionNewArrivals = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionNewArrivals as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const { data } = useQuery({
        queryKey:['getAllProducts'], // указываем здесь такое же название,как и в файле SectionDeals для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другом компоненте(в данном случае в SectionDeals),а не после обновления страницы
        queryFn:async () => {
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts?limit=5&skip=0'); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных mongodb) и skip(сколько объектов пропустить,прежде чем начать брать их из базы данных mongodb)

            console.log(response.data);

            return response; // возвращаем этот массив объектов товаров(он будет помещен в поле data у data,которую мы берем из этого useQuery)

        }

    })

    // указываем в этой функции запроса на сервер для получения массива товаров корзины такой же queryKey как и на странице Cart.tsx,чтобы эти данные кешировались и можно было переобновить их на этой странице,чтобы они переобновились сразу же и для страницы Cart.tsx
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'],
        queryFn: async () => {

            const response = await axios.get<IProductsCartResponse>(`http://localhost:5000/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары(блюда) корзины для конкретного авторизованного пользователя

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля allProductsCart и productsCart

        }

    })

    // указываем такой же queryKey как и в ProductItemPage для получения комментариев,чтобы при изменении комментариев у товара переобновлять массив комментариев в секции sectionNewArrivals
    const { data: dataComments, refetch: refetchComments } = useQuery({
        queryKey: ['commentsForProduct'],
        queryFn: async () => {

            const response = await axios.get<ICommentResponse>(`${API_URL}/getCommentsForProduct`); // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productNameFor со значением name у товара на этой странице,конкретно указываем этот параметр в объекте в params у этой функции запроса,а не через знак вопроса просто в url,иначе,если в названии товара есть знаки амперсанта(&),то не будут найдены эти комментарии по такому названию,так как эти знаки амперсанта не правильно конкатенируются если их указать просто в url через знак вопроса 

            return response.data; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет массив объектов комментариев) и тд

        }

    })


    return (
        <section ref={sectionNewArrivals} id="sectionNewArrivals" className={onScreen.sectionNewArrivalsIntersecting ? `${sectionNewArrivalsClass} sectionNewArrivals__active` : sectionNewArrivalsClass}>
            <div className="container">
                <div className="sectionNewArrivals__inner">
                    <div className="sectionNewArrivals__top">
                        <h2 className="sectionNewArrivals__title">New Arrivals</h2>
                        <Link to="/catalog" className="sectionNewArrivals__top-link">
                            <p className="sectionNewArrivals__top-linkText">View All</p>
                            <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                        </Link>
                    </div>
                    <div className="sectionNewArrivals__items">
                        {/* указываем класс этому элементу для карточки товара со значением нашего состояния classesForItem,чтобы когда наводим мышкой на кнопку добавления товара в корзину,изменять задний фон карточки товара на белый,а в данном случае еще и добавляем другой класс,чтобы сделать border-radius(радиус границы) правильным только для первой карточки товара */}
                        
                        {/* указываем в key у product поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием,передаем еще refetchProductsCart и dataProductsCart,чтобы получить данные товаров корзины и переобновлять их  */}
                        {data?.data.map(product => 
                            <ProductItemArrivals key={product._id} product={product} comments={dataComments?.allComments} refetchProductsCart={refetchProductsCart} dataProductsCart={dataProductsCart}/>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionNewArrivals;