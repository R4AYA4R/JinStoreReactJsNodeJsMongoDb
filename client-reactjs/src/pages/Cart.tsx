import { useMutation, useQuery } from "@tanstack/react-query";
import ProductItemCart from "../components/ProductItemCart";
import SectionCartTop from "../components/SectionCartTop";
import axios from "axios";
import { AuthResponse, ICommentResponse, IProductCart, IProductsCartResponse } from "../types/types";
import { RefObject, useEffect, useRef, useState } from "react";
import { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { getPagesArray } from "../utils/getPagesArray";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const Cart = () => {

    const sectionNewArrivals = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionNewArrivals as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setLoadingUser, authorizationForUser, setUpdateProductsCart } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    const [subtotalCheckPrice, setSubtotalCheckPrice] = useState<number>(); // состояние для цены суммы чека всей корзины

    const [page, setPage] = useState(1); // указываем состояние текущей страницы

    const [totalPages, setTotalPages] = useState(0); // указываем состояние totalPages в данном случае для общего количества страниц

    const [limit, setLimit] = useState(3); // указываем лимит для максимального количества объектов,которые будут на одной странице(для пагинации)

    // берем из useQuery поле isFetching,оно обозначает,что сейчас идет загрузка запроса на сервер,используем его для того,чтобы показать лоадер(загрузку) при загрузке запроса на сервер
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'],
        queryFn: async () => {

            const response = await axios.get<IProductsCartResponse>(`http://localhost:5000/api/getAllProductsCart?userId=${user.id}`, {
                params: {

                    limit: limit,  // указываем параметр limit для максимального количества объектов,которые будут на одной странице(для пагинации),можно было указать эти параметры limit и page просто через знак вопроса в url,но можно и тут в отдельном объекте params

                    page: page // указываем параметр page(параметр текущей страницы,для пагинации)
                }
            }); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductsCartResponse,от сервера придут 2 массива товаров корзины,один общий для всех товаров корзины для отдельного авторизованного пользователя(allProductsCart),а второй для товаров корзины на одной странице пагинации(productsCart)),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя

            const totalCount = response.data.allProductsCart.length; // записываем общее количество объектов комментариев,отфильтрованных для отдельного товара по имени с помощью .length,которые пришли от сервера в переменную totalCount(берем это у поля length у поля allCommentsForName(массив всех объектов комментариев без лимитов и состояния текущей страницы,то есть без пагинации) у поля data у response(общий объект ответа от сервера))

            setTotalPages(Math.ceil(totalCount / limit));  // изменяем состояние totalPages на значение деления totalCount на limit,используем Math.ceil() - она округляет получившееся значение в большую сторону к целому числу(например,5.3 округлит к 6),чтобы правильно посчитать общее количество страниц

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля allProductsCart и productsCart


        }

    })

    // указываем такой же queryKey как и в ProductItemPage для получения комментариев,чтобы при изменении комментариев у товара переобновлять массив комментариев в секции sectionNewArrivals и на странице корзины Cart.tsx
    const { data: dataComments, refetch: refetchComments } = useQuery({
        queryKey: ['commentsForProduct'],
        queryFn: async () => {

            const response = await axios.get<ICommentResponse>(`${API_URL}/getCommentsForProduct`); // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productNameFor со значением name у товара на этой странице,конкретно указываем этот параметр в объекте в params у этой функции запроса,а не через знак вопроса просто в url,иначе,если в названии товара есть знаки амперсанта(&),то не будут найдены эти комментарии по такому названию,так как эти знаки амперсанта не правильно конкатенируются если их указать просто в url через знак вопроса 

            return response.data; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет массив объектов комментариев) и тд

        }

    })

    const { mutate: mutateDeleteProductCart } = useMutation({
        mutationKey: ['deleteProductCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер для удаление товара корзины,и указываем тип данных,которые вернет сервер(то есть в данном случае будем от сервера возвращать удаленный объект товара в базе данных,то есть в данном случае тип IProductCart),но здесь не обязательно указывать тип
            await axios.delete<IProductCart>(`${API_URL}/deleteProductCart/${productCart._id}`);

        },

        // при успешной мутации обновляем весь массив товаров корзины с помощью функции refetchProductsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess() {

            refetchProductsCart();

        }

    })

    const dataTotalPrice = dataProductsCart?.allProductsCart.reduce((prev, curr) => prev + curr.totalPrice, 0);  // проходимся по массиву объектов товаров корзины и на каждой итерации увеличиваем переменную prev(это число,и мы указали,что в начале оно равно 0 и оно будет увеличиваться на каждой итерации массива объектов,запоминая старое состояние числа и увеличивая его на новое значение) на curr(текущий итерируемый объект).totalPrice,это чтобы посчитать общую сумму цены всех товаров

    const checkAuth = async () => {

        setLoadingUser(true); // изменяем поле isLoading состояния пользователя в userSlice на true(то есть пошла загрузка)

        try {

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse,указываем наш url до нашего роутера(/api) на бэкэнде(API_URL мы импортировали из другого нашего файла) и через / указываем refresh(это тот url,где мы проверяем,валиден(не иссяк ли у него срок годности и тд) ли текущий refresh токен,и если да,то выдаем новые access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });

            console.log(response.data);

            authorizationForUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

            console.log(response.data.user.userName)

        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        } finally {

            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)

        }

    }

    // при запуске сайта(в данном случае при рендеринге этого компонента,то есть этой страницы) будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть,то есть пользователь уже когда-то регистрировался или авторизовывался и у него уже есть refresh токен в cookies
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(user.userName);
        console.log(isAuth);

    }, [])

    // при запуске(рендеринге) этого компонента и при изменении user(объекта пользователя) переобновляем массив товаров корзины productsCart,так как не успевает загрузится запрос /refresh для проверки авторизации пользователя(для выдачи новых токенов refresh и access),иначе если этого не сделать,то после обновления страницы корзины не показываются товары корзины
    useEffect(() => {

        refetchProductsCart();

    }, [user])

    useEffect(() => {

        setSubtotalCheckPrice(dataTotalPrice);

    }, [dataProductsCart?.allProductsCart])

    // функция для удаления всех товаров корзины
    const deleteAllProductsCart = () => {

        // проходимся по каждому элементу массива товаров корзины и вызываем мутацию mutateDeleteProductCart и передаем туда productCart(сам productCart, каждый объект товара на каждой итерации,и потом в функции запроса на сервер mutateDeleteProductCart будем брать у этого productCart только id для удаления из корзины)
        dataProductsCart?.allProductsCart.forEach(productCart => {

            mutateDeleteProductCart(productCart);

        })

    }


    // при изменении страницы пагинации переобновляем(делаем повторный запрос на сервер) массив товаров корзины
    useEffect(() => {

        refetchProductsCart();

    }, [page])

    let pagesArray = getPagesArray(totalPages, page); // помещаем в переменную pagesArray массив страниц пагинации,указываем переменную pagesArray как let,так как она будет меняться в зависимости от проверок в функции getPagesArray

    const prevPage = () => {
        // если текущая страница больше или равна 2
        if (page >= 2) {
            setPage((prev) => prev - 1);  // изменяем состояние текущей страницы на - 1(то есть в setPage берем prev(предыдущее значение,то есть текущее) и отнимаем 1)
        }
    }

    const nextPage = () => {
        // если текущая страница меньше или равна общему количеству страниц - 1(чтобы после последней страницы не переключалось дальше)
        if (page <= totalPages - 1) {
            setPage((prev) => prev + 1);  // изменяем состояние текущей страницы на + 1(то есть в setPage берем prev(предыдущее значение,то есть текущее) и прибавляем 1)
        }
    }

    return (
        <main className="main">
            <SectionCartTop />
            <section className={onScreen.sectionNewArrivalsIntersecting ? 'sectionNewArrivals sectionNewArrivals__active sectionCart' : 'sectionNewArrivals sectionCart'} ref={sectionNewArrivals} id="sectionNewArrivals" >
                <div className="container">
                    <div className="sectionCart__inner">
                        <div className="sectionCart__table">
                            <div className="sectionCart__table-names">
                                <p className="sectionCart__table-name">Products</p>
                                <p className="sectionCart__table-name">Price</p>
                                <p className="sectionCart__table-name">Quantity</p>
                                <p className="sectionCart__table-name">Subtotal</p>
                            </div>
                            <div className="sectionCart__table-mainBlock">

                                {user.userName && dataProductsCart?.allProductsCart.length ?

                                    <>

                                        <div className="sectionCart__table-productsBlock">

                                            {/* проходимся по массиву productsCart(массив товаров корзины,отфильтрованный для отдельного пользователя для одной страницы пагинации) */}
                                            {dataProductsCart.productsCart.map(productCart =>

                                                <ProductItemCart key={productCart._id} productCart={productCart} comments={dataComments?.allComments} refetchProductsCart={refetchProductsCart} />

                                            )}

                                        </div>

                                        <div className="productsBlock__pagination">

                                            <button className="pagination__btnLeft" onClick={prevPage}>
                                                <img src="/images/sectionCatalog/ArrowLeft.png" alt="" className="pagination__btnLeft-img" />
                                            </button>

                                            {pagesArray.map(p =>

                                                <button
                                                    className={page === p ? "pagination__item pagination__item--active" : "pagination__item"} //если состояние номера текущей страницы page равно значению элементу массива pagesArray,то отображаем такие классы(то есть делаем эту кнопку страницы активной),в другом случае другие

                                                    key={p}

                                                    onClick={() => setPage(p)} // отслеживаем на какую кнопку нажал пользователь и делаем ее активной,изменяем состояние текущей страницы page на значение элемента массива pagesArray(то есть страницу,на которую нажал пользователь)

                                                >
                                                    {p}
                                                </button>

                                            )}

                                            {/* если общее количество страниц больше 4 и текущая страница меньше общего количества страниц - 2,то отображаем три точки  */}
                                            {totalPages > 4 && page < totalPages - 2 && <div className="pagination__dots">...</div>}

                                            {/* если общее количество страниц больше 3 и текущая страница меньше общего количества страниц - 1,то отображаем кнопку последней страницы,при клике на кнопку изменяем состояние текущей страницы на totalPages(общее количество страниц,то есть на последнюю страницу) */}
                                            {totalPages > 3 && page < totalPages - 1 && <button className="pagination__item" onClick={() => setPage(totalPages)}>{totalPages}</button>
                                            }

                                            <button className="pagination__btnRight" onClick={nextPage}>
                                                <img src="/images/sectionCatalog/ArrowCatalogRight.png" alt="" className="pagination__btnRight-img" />
                                            </button>

                                        </div>

                                        <div className="sectionCart__table-bottomBlock">
                                            <button className="sectionCart__table-bottomBlockClearBtn" onClick={deleteAllProductsCart}>Clear Cart</button>

                                            {/* изменяем поле updateProductsCart у состояния слайса(редьюсера) cartSlice на true,чтобы обновились все данные о товарах в корзине по кнопке,потом в компоненте ProductItemCart отслеживаем изменение этого поля updateProductsCart и делаем там запрос на сервер на обновление данных о товаре в корзине */}
                                            <button className="sectionCart__table-bottomBlockUpdateBtn" onClick={() => setUpdateProductsCart(true)}>Update Cart</button>
                                        </div>
                                    </>
                                    : isFetching || isLoading ?
                                        <div className="innerForLoader">
                                            <div className="loader"></div>
                                        </div>
                                        : <h3 className="textEmptyCart">Cart is Empty</h3>
                                }


                            </div>
                        </div>
                        <div className="sectionCart__bill">
                            <div className="bill__topBlock">
                                <div className="bill__topBlock-item">
                                    <p className="bill__topBlock-itemText">Cart Subtotal</p>
                                    <p className="bill__topBlock-itemSubText">${subtotalCheckPrice?.toFixed(2)}</p>
                                </div>
                                <div className="bill__topBlock-item">
                                    <p className="bill__topBlock-itemTextGrey">Shipping Charge</p>
                                    <p className="bill__topBlock-itemSubTextGrey">$15.00</p>
                                </div>
                            </div>
                            <div className="bill__bottomBlock">
                                <div className="bill__bottomBlock-item">
                                    <p className="bill__bottomBlock-itemText">Total</p>


                                    {/* если subtotalCheckPrice true(то есть в этом состоянии есть значение,в данном случае делаем эту проверку,потому что выдает ошибку,что subtotalCheckPrice может быть undefined),то указываем значение этому тексту как subtotalCheckPrice + 15(в данном случае 15 это типа цена доставки,мы ее прибавляем к общей цене всех товаров корзины) */}
                                    <p className="bill__bottomBlock-itemSubText">${(subtotalCheckPrice && subtotalCheckPrice + 15)?.toFixed(2)}</p>
                                </div>
                                <button className="bill__bottomBlock-btn">
                                    <p className="bill__bottomBlock-btnText">Proceed to Checkout</p>
                                    <img src="/images/sectionCart/CheckSquareOffset.png" alt="" className="bill__bottomBlock-btnImg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default Cart;