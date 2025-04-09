import { useQuery } from "@tanstack/react-query";
import ProductItemCart from "../components/ProductItemCart";
import SectionCartTop from "../components/SectionCartTop";
import axios from "axios";
import { AuthResponse, ICommentResponse, IProductCart } from "../types/types";
import { useEffect } from "react";
import { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";

const Cart = () => {

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setLoadingUser, authorizationForUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


    // берем из useQuery поле isFetching,оно обозначает,что сейчас идет загрузка запроса на сервер,используем его для того,чтобы показать лоадер(загрузку) при загрузке запроса на сервер
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'],
        queryFn: async () => {

            const response = await axios.get<IProductCart[]>(`http://localhost:5000/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары(блюда) корзины для конкретного авторизованного пользователя

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет объект товара) и тд



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

    return (
        <main className="main">
            <SectionCartTop />
            <section className="sectionCart">
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

                                {user.userName && dataProductsCart?.data.length ?

                                    <>
                                        {dataProductsCart.data.map(productCart =>

                                            <ProductItemCart key={productCart._id} productCart={productCart} comments={dataComments?.allComments} />

                                        )}

                                        <div className="sectionCart__table-bottomBlock">
                                            <button className="sectionCart__table-bottomBlockClearBtn">Clear Cart</button>

                                            <button className="sectionCart__table-bottomBlockUpdateBtn">Update Cart</button>
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
                                    <p className="bill__topBlock-itemSubText">$15.00</p>
                                </div>
                                <div className="bill__topBlock-item">
                                    <p className="bill__topBlock-itemTextGrey">Shipping Charge</p>
                                    <p className="bill__topBlock-itemSubTextGrey">$10.00</p>
                                </div>
                            </div>
                            <div className="bill__bottomBlock">
                                <div className="bill__bottomBlock-item">
                                    <p className="bill__bottomBlock-itemText">Total</p>
                                    <p className="bill__bottomBlock-itemSubText">$25.00</p>
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