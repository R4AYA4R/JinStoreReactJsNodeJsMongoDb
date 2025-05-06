
// создали компонент Header в отдельной папке,так как будем здесь для стилей использовать css модули,то есть файл .module.css(в данном случае Header.module.css),в нем будем описывать стили для этого Header и их импортировать,в файле Header.module.css будем их называть и 

import { NavLink } from 'react-router-dom';
import cl from './Header.module.css'; // импортируем cl(классы,можем по-любому назвать это) из нашего файла Header.module.css,чтобы потом указывать классы через точку типа cl.header(header в данном случае название класса в файле Header.module.css и так указываем остальные классы)
import { useQuery } from '@tanstack/react-query';
import { AuthResponse, IProductCart, IProductsCartResponse } from '../../types/types';
import axios from 'axios';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useEffect, useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { API_URL } from '../../http/http';

const Header = () => {

    const [activeMobileMenu,setActiveMobileMenu] = useState(false);

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setLoadingUser, authorizationForUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    // берем из useQuery поле isFetching,оно обозначает,что сейчас идет загрузка запроса на сервер,используем его для того,чтобы показать лоадер(загрузку) при загрузке запроса на сервер
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'],
        queryFn: async () => {

            const response = await axios.get<IProductsCartResponse>(`http://localhost:5000/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары(блюда) корзины для конкретного авторизованного пользователя

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля allProductsCart и productsCart


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

    // при запуске(рендеринге) этого компонента и при изменении user(объекта пользователя) переобновляем массив товаров корзины productsCart,так как не успевает загрузится запрос /refresh для проверки авторизации пользователя(для выдачи новых токенов refresh и access),иначе если этого не сделать,то после обновления страницы корзины не показываются товары корзины, при изменении состояния user(в userSlice в данном случае) (то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),то делаем повторный запрос на получения товаров корзины,чтобы данные о количестве товаров корзины сразу переобновлялись при изменения состояния user(то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),если не сделать это,то данные о товарах корзины будут переобновляться только после перезагрузки страницы
    useEffect(() => {

        refetchProductsCart();

    }, [user])

    
    return(

        // импортируем cl(классы,можем по-любому назвать это) из нашего файла Header.module.css,чтобы потом указывать классы через точку типа cl.header(header в данном случае название класса в файле Header.module.css и так указываем остальные классы),но при указании классов таким образом нельзя использовать - (знак минуса,типа черточки),иначе выдает ошибку
        <header className={cl.header}>
            <div className={cl.headerContainer}>
                <div className={cl.header__inner}>
                    {/* используем тут NavLink,чтобы при клике на эту ссылку перекинуть пользователя по маршруту /(то есть на главную страницу),указываем это в to */}
                    <NavLink to="/" className={cl.header__logoLink}>
                        {/* в src(пути картинки) указываем путь из папки images,которую создали в папке public в папке для всего react приложения(сайта),создаем папку images в public,чтобы было удобно сразу указывать путь до картинки, указывая сразу /images и тд */}
                        <img src="/images/header/Group 70.png" alt="" className={cl.header__logoImg} />
                    </NavLink>
                    <ul className={cl.header__menu}>
                        <li className={cl.header__menuItem}>
                            {/* используем тут NavLink,чтобы при клике на эту ссылку перекинуть пользователя по маршруту /(то есть на главную страницу),указываем это в to,также используем тут NavLink,вместо обычного Link,чтобы отслеживать активное состояние этой ссылки,то есть находится ли пользователь на этой странице,для которой эта ссылка или нет,чтобы указать ей активный класс,также отслеживаем активную сейчас страницу и с помощью isActive у NavLink указываем,если isActive true,то указываем классы для активной кнопки текущей страницы,в другом случае обычные классы */}
                            <NavLink to="/" className={({isActive}) => isActive ? `${cl.header__menuLink} ${cl.header__menuLinkActive}` : cl.header__menuLink}>Home</NavLink>
                        </li>
                        <li className={cl.header__menuItem}>
                            <NavLink to="/catalog" className={({isActive}) => isActive ? `${cl.header__menuLink} ${cl.header__menuLinkActive}` : cl.header__menuLink}>Catalog</NavLink>
                        </li>
                        <li className={cl.header__menuItem}>
                            <NavLink to="/aboutUs" className={({isActive}) => isActive ? `${cl.header__menuLink} ${cl.header__menuLinkActive}` : cl.header__menuLink}>About Us</NavLink>
                        </li>
                        <li className={cl.header__menuItem}>
                            <NavLink to="/userPage" className={cl.header__menuLink}>
                                <img src="/images/header/Vector.png" alt="" className={cl.menuLink__img} />
                            </NavLink>
                        </li>
                        <li className={cl.header__menuItem}>
                            {/* указываем 2 модульных класса таким образом в виде строки с такими ковычками ``,и между ними указываем пробел */}
                            <NavLink to="/cart" className={`${cl.header__menuLink} ${cl.header__menuLinkCart}`}>
                                <img src="/images/header/Cart.png" alt="" className={cl.menuLink__img} />
                                <span className={cl.menuLink__span}>{dataProductsCart?.allProductsCart.length}</span>
                            </NavLink>
                        </li>
                    </ul>

                    {/* если activeMobileMenu true (то есть сейчас открыто мобильное меню),то показываем блок див и onClick указываем,что изменяем состояние activeMobileMenu на false,то есть будем закрывать мобильное меню по клику на другую область,кроме этого меню,чтобы оно закрылось не только по кнопке,но и по области вокруг,в другом случае этот блок показан не будет */}
                    {activeMobileMenu && 
                        <div className={cl.header__menuMobileCloseDiv} onClick={()=>setActiveMobileMenu(false)}></div>
                    }

                    <ul className={activeMobileMenu ? `${cl.header__menuMobile} ${cl.header__menuMobileActive}` : cl.header__menuMobile}>
                        <li className={cl.header__menuItem}>
                            {/* используем тут NavLink,чтобы при клике на эту ссылку перекинуть пользователя по маршруту /(то есть на главную страницу),указываем это в to,также используем тут NavLink,вместо обычного Link,чтобы отслеживать активное состояние этой ссылки,то есть находится ли пользователь на этой странице,для которой эта ссылка или нет,чтобы указать ей активный класс,также отслеживаем активную сейчас страницу и с помощью isActive у NavLink указываем,если isActive true,то указываем классы для активной кнопки текущей страницы,в другом случае обычные классы */}
                            <NavLink to="/" className={({isActive}) => isActive ? `${cl.header__menuLink} ${cl.header__menuLinkActive}` : cl.header__menuLink}>Home</NavLink>
                        </li>
                        <li className={cl.header__menuItem}>
                            <NavLink to="/catalog" className={({isActive}) => isActive ? `${cl.header__menuLink} ${cl.header__menuLinkActive}` : cl.header__menuLink}>Catalog</NavLink>
                        </li>
                        <li className={cl.header__menuItem}>
                            <NavLink to="/aboutUs" className={({isActive}) => isActive ? `${cl.header__menuLink} ${cl.header__menuLinkActive}` : cl.header__menuLink}>About Us</NavLink>
                        </li>

                        <li className={`${cl.header__menuItem} ${cl.header__menuItemUser}`}>
                            <NavLink to="/userPage" className={cl.header__menuLink}>
                                <img src="/images/header/Vector.png" alt="" className={cl.menuLink__img} />
                            </NavLink>
                        </li>
                        <li className={`${cl.header__menuItem} ${cl.header__menuItemCart}`}>
                            {/* указываем 2 модульных класса таким образом в виде строки с такими ковычками ``,и между ними указываем пробел */}
                            <NavLink to="/cart" className={`${cl.header__menuLink} ${cl.header__menuLinkCart}`}>
                                <img src="/images/header/Cart.png" alt="" className={cl.menuLink__img} />
                                <span className={cl.menuLink__span}>{dataProductsCart?.allProductsCart.length}</span>
                            </NavLink>
                        </li>
                    </ul>

                    <button className={cl.header__menuBtn} onClick={()=>setActiveMobileMenu((prev) => !prev)}>
                        {/* если activeMobileMenu true(то есть сейчас открыто мобильное меню),то показываем активные классы для каждого спана отдельно,так как делаем им такую анимацию,в другом случае указываем обычный класс */}
                        <span className={activeMobileMenu ? `${cl.menuBtn__span} ${cl.menuBtn__spanActive1}` : cl.menuBtn__span}></span>
                        <span className={activeMobileMenu ? `${cl.menuBtn__span} ${cl.menuBtn__spanActive2}` : cl.menuBtn__span}></span>
                        <span className={activeMobileMenu ? `${cl.menuBtn__span} ${cl.menuBtn__spanActive3}` : cl.menuBtn__span}></span>
                        <span className={activeMobileMenu ? `${cl.menuBtn__span} ${cl.menuBtn__spanActive1}` : cl.menuBtn__span}></span>
                    </button>

                </div>
            </div>
        </header>

    )

}

export default Header;