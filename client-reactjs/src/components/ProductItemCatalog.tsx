import { useNavigate } from "react-router-dom";
import { IComment, IProduct, IProductsCartResponse } from "../types/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import $api, { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";

interface IProductItemCatalog {
    product: IProduct,
    comments: IComment[] | undefined,
    setPage: Dispatch<SetStateAction<number>>  // указываем тип для функции setPage(она у нас меняет текущую страницу пагинации каталога),которая изменяет состояние useState и указываем,что параметр этой функции будет с типом number
}

const ProductItemCatalog = ({ product, comments, setPage }: IProductItemCatalog) => {

    const [commentsForProduct, setCommentsForProduct] = useState<IComment[] | undefined>([]); // состояние для всех комментариев для отдельного товара,указываем ему тип в generic как IComment[] | undefined,указываем или undefined,так как выдает ошибку,когда изменяем это состояние на отфильтрованный массив комментариев по имени товара,что comments может быть undefined

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    // скопировали эту функцию запроса на сервер с помощью useQuery для получения товаров корзины,указываем такой же queryKey как и в файле Cart.tsx,чтобы эти данные были одинаковые и переобновлялись одинаково,указываем эту функцию в файле Catalog.tsx,потом передаем ее в компонент ProductItemCatalog,указываем ее здесь,чтобы не шли
    const { data: dataProductsCart, refetch: refetchProductsCart } = useQuery({
        queryKey: ['getAllProductsCart'],
        queryFn: async () => {

            const response = await axios.get<IProductsCartResponse>(`http://localhost:5000/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductsCartResponse,от сервера придут 2 массива товаров корзины,один общий для всех товаров корзины для отдельного авторизованного пользователя(allProductsCart),а второй для товаров корзины на одной странице пагинации(productsCart)),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля allProductsCart и productsCart


        }

    })

    // это уже не используем,так как фильтруем весь массив comments уже в этом компоненте,не делая дополнительный запрос на сервер
    // const { data: dataComments, refetch: refetchComments } = useQuery({
    //     queryKey: [`commentsForProductCatalog${product.name}`],  // обязательно указываем здесь в queryKey индивидуальное название для каждого товара,например,как product.name(оно уникально для каждого товара),чтобы для каждого товара отдельно шел запрос на сервер для получения комментариев,иначе будет только один запрос для одного товара и все,так как queryKey будет одинаковый и react query будет думать,что это одни и те же данные,и он будет их хешировать и показывать всем товарам как для одного,либо лучше сделать запрос для получения всех комментариев в родительском компоненте этих компонентов для товара,и просто передавать в эти дочерние компоненты товара массив комментариев и его фильтровать в компоненте товара, для каждого имени товара отдельный массив и его длину показывать
    //     queryFn: async () => {

    //         const response = await axios.get<IComment[]>(`${API_URL}/getCommentsForProduct`, {

    //             params: {

    //                 productNameFor: product.name

    //             }

    //         }); // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productNameFor со значением name у товара на этой странице,конкретно указываем этот параметр в объекте в params у этой функции запроса,а не через знак вопроса просто в url,иначе,если в названии товара есть знаки амперсанта(&),то не будут найдены эти комментарии по такому названию,так как эти знаки амперсанта не правильно конкатенируются если их указать просто в url через знак вопроса 

    //         return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет массив объектов комментариев) и тд

    //     }

    // })

    const router = useNavigate();  // useNavigate может перемещатьтся на другую страницу вместо ссылок

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        // если product.priceDiscount true,то есть у объекта товара есть поле priceDiscount и в нем есть какое-то значение,то есть у товара есть скидка,то изменяем состояние valueDiscount,эту проверку не обязательно было делать,так как и так проверяем в html разметке,есть ли поле priceDiscount у product,это просто чтобы лишний раз не делались какие-то вычисления ненужные
        if (product.priceDiscount) {

            setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

        }


    }, [product])

    // при рендеринге(запуске) этого компонента и при изменении массива комментариев comments будет отработан код в этом useEffect,так как он с пустым массивом зависимостей, обязательно указываем массив комментариев comments в массиве зависимостей этого useEffect,чтобы при двойном переобновлении страницы комментарии отображались,иначе они могут не отобразиться
    useEffect(() => {

        setCommentsForProduct(comments?.filter(p => p.productNameFor === product.name)); // изменяем состояние commentsForProduct на отфильтрованный массив всех комментариев comments(пропс(параметр) этого компонента) по имени товара(product.name),то есть оставляем в массиве все объекты комментариев,у которых поле productNameFor равно product.name(объект товара,который передали пропсом(параметром) в этот компонент)

    }, [comments])

    // фукнция для удаления товара каталога по кнопке
    const deleteProductCatalogByBtn = async () => {

        try {

            const response = await $api.post(`${API_URL}/deleteProductCatalog`, product);  // делаем запрос на сервер для удаления товара каталога из базы данных и указываем в ссылке на эндпоинт параметр productId(id этого товара каталога,который хотим удалить),productName(название этого товара каталога),mainImage(главную картинку этого товара),descImages(массив картинок описания этого товара),чтобы на бэкэнде их достать,здесь используем наш axios с определенными настройками ($api в данном случае),так как на бэкэнде у этого запроса на удаление файла с сервера проверяем пользователя на access токен,так как проверяем,валидный(годен ли по сроку годности еще) ли access токен у пользователя(админа в данном случае) или нет)

            console.log(response.data); // выводим в логи ответ от сервера

            setPage(1); // изменяем состояние текущей страницы пагинации каталога на 1,чтобы при удалении товара текущая страница становилась 1,в данном случае отдельно не переобновляем массив товаров каталога,так как изменяем состояние page(текущая страница пагинации) с помощью setPage и в файле Catalog.tsx при изменении этого состояния page,делается запрос на переобновление товаров каталога,поэтому здесь еще раз его указывать не нужно

            refetchProductsCart(); // переобновляем массив товаров корзины


        } catch (e: any) {

            console.log(e.response?.data?.message); // выводим ошибку в логи

        }

    }

    return (
        <div className="sectionNewArrivals__items-item sectionBestSellers__itemsBlockSide-item sectionCatalog__productsItems-item">
            <div className="sectionBestSellers__item-imgBlock">

                {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор),то показываем кнопку админа для удаления товара из базы данных */}
                {user.role === 'ADMIN' &&
                    // в onClick этой button указываем нашу функцию deleteProductCatalogByBtn 
                    <button className="adminForm__imageBlock-deleteBtn" onClick={deleteProductCatalogByBtn}>
                        <img src="/images/sectionUserPage/Close.png" alt="" className="adminForm__deleteBtn-img" />
                    </button>
                }

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
                <img src={`http://localhost:5000/${product.mainImage}`} alt="" className="sectionNewArrivals__item-img sectionCatalog__productsItem-itemImg" onClick={() => router(`/catalog/${product._id}`)} />
            </div>
            <div className="sectionBestSellers__item-infoBlock">

                {/* если product.name.length > 52,то есть длина названия по количеству символов больше 52(это значение посчитали в зависимости от дизайна,сколько символов в названии нормально влазит в максимальную ширину и высоту текста названия),то показываем такой блок текста названия товара,с помощью substring() вырезаем из строки названия товара опеределенное количество символов(передаем первым параметром в substring с какого символа по индексу начинать вырезать,вторым параметром передаем до какого символа по индексу вырезать,в данном случае подобрали значение до 48 символа по индексу вырезать,так как еще нужно место на троеточие),и в конце добавляем троеточие,чтобы красиво смотрелось,в другом случае показываем обычное название товара(product.name) */}
                {product.name.length > 52 ?
                    <p className="sectionNewArrivals__item-text" onClick={() => router(`/catalog/${product._id}`)}>{(product.name).substring(0, 48)}...</p>
                    : <p className="sectionNewArrivals__item-text" onClick={() => router(`/catalog/${product._id}`)}>{product.name}</p>
                }

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