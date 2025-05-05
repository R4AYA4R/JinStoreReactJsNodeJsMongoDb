
import { Link } from 'react-router-dom';
import cl from './Footer.module.css'; // импортируем cl(классы,можем по-любому назвать это) из нашего файла Footer.module.css,чтобы потом указывать классы через точку типа cl.footer(footer в данном случае название класса в файле Footer.module.css и так указываем остальные классы)
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { FormEvent, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IAdminFields } from '../../types/types';
import $api, { API_URL } from '../../http/http';

const Footer = () => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const [tabChangeTel, setTabChangeTel] = useState(false);  // делаем состояние для таба изменения номера телефона для админа(будем показывать или не показывать инпут изменения номера телефона в зависимости от этого состояния)

    const [errorPhoneNumber, setErrorPhoneNumber] = useState('');

    const [inputPhoneNumber, setInputPhoneNumber] = useState<string | undefined>();  // делаем состояние для инпута изменения реального номера телефона без пробелов и тд, указываем ему тип данных как string | (или) undefined(указываем ему,что он может быть  undefined,чтобы не было ошибки,что это состояние не может быть undefined,когда задаем ему первоначальное значение как dataAdminFields?.data.phoneNumber(поле номера телефона из объекта админ полей из базы данных)

    const [inputVisiblePhoneNumber, setInputVisiblePhoneNumber] = useState<string | undefined>('');  // делаем состояние для инпута изменения телефона как он будет выглядеть на сайте, и указываем ему тип данных как string | (или) undefined(указываем ему,что он может быть  undefined,чтобы не было ошибки,что это состояние не может быть undefined,когда задаем ему первоначальное значение как dataAdminFields?.data.phoneNumber(поле номера телефона из объекта админ полей из базы данных)

    // создаем функцию запроса и делаем запрос на сервер(при создании функции в useQuery запрос автоматически делается 1 раз при запуске страницы) для получения объекта админ полей(нужных полей текста и тд для сайта,чтобы потом мог админ их изменять в базе данных)
    const { data: dataAdminFields, refetch: refetchAdminFields } = useQuery({
        queryKey: ['adminFields'],
        queryFn: async () => {

            const response = await axios.get<IAdminFields>(`${API_URL}/getAdminFields`); // делаем запрос на сервер на получение объекта админ полей,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IAdminFields),используем тут обычный axios,так как не нужна здесь проверка на access токен пользователя

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет массив объектов комментариев) и тд

        }

    })

    // при изменении dataAdminFields?.data(объекта админ полей) изменяем состояние inputPhoneNumber на dataAdminFields?.data.phoneNumber(поле номера телефона из объекта админ полей,который взяли из базы данных),делаем этот useEffect,чтобы при загрузке страницы первоначальное значение состояния inputPhoneNumber было как dataAdminFields?.data.phoneNumber,чтобы при показе инпута изменения номера телефона для админа,там сразу было значение dataAdminFields?.data.phoneNumber(поле номера телефона из базы данных),которое можно стереть,если не сделать этот useEffect,то первоначальное значение состояния inputPhoneNumber не будет задано
    useEffect(() => {

        setInputPhoneNumber(dataAdminFields?.data.phoneNumber);

        setInputVisiblePhoneNumber(dataAdminFields?.data.visiblePhoneNumber);

    }, [dataAdminFields?.data])

    // функция для кнопки для изменения номера телефона в базе данных,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const changeTel = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если inputPhoneNumber?.length && inputPhoneNumber?.length < 6,то есть если inputPhoneNumber?.length true(делаем эту проверку,иначе выдает ошибку,что inputPhoneNumber?.length может быть undefined) и inputPhoneNumber?.length < 6 или inputPhoneNumber?.length > 15,то показываем ошибку
        if (inputPhoneNumber?.length !== undefined &&  inputPhoneNumber?.length < 6 || inputPhoneNumber?.length !== undefined &&  inputPhoneNumber?.length > 15) {

            return setErrorPhoneNumber('Real phone number must be 6 - 15 characters'); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию

        } else if (inputVisiblePhoneNumber?.length !== undefined &&  inputVisiblePhoneNumber?.length < 6 || inputVisiblePhoneNumber?.length !== undefined && inputVisiblePhoneNumber?.length > 24) {
            // в другом случае если inputVisiblePhoneNumber?.length && inputVisiblePhoneNumber?.length < 6,то есть если inputVisiblePhoneNumber?.length true(делаем эту проверку,иначе выдает ошибку,что inputVisiblePhoneNumber?.length может быть undefined) и inputVisiblePhoneNumber?.length < 6 или inputVisiblePhoneNumber?.length > 24,то показываем ошибку
            return setErrorPhoneNumber('Visible phone number must be 6 - 24 characters');

        } else {
            // если проверки выше не отработали,то делаем запрос на сервер

            try {

                const response = await $api.put(`${API_URL}/changePhoneNumber`, { newRealPhoneNumber: inputPhoneNumber, newVisiblePhoneNumber: inputVisiblePhoneNumber }); // делаем запрос на сервер(лучше было это вынести в отдельную функцию,но уже сделали так),используем здесь наш axios с определенными настройками($api),которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде, и в объекте тела запроса указываем поля для нового реального номера телефона и для нового визуального номера телефона на сайте(как он будет выглядеть на сайте)

                console.log(response.data);

                refetchAdminFields();  // переобновляем данные объекта админ полей

                setTabChangeTel(false); // изменяем значение tabChangeTel на false,чтобы убрать инпут для изменения номера телефона

                // очищаем поля инпутов 
                setInputPhoneNumber('');
                setInputVisiblePhoneNumber('');

                setErrorPhoneNumber(''); // убираем ошибку,если она была

            } catch (e: any) {

                console.log(e.response?.data?.message);

                return setErrorPhoneNumber(e.response?.data?.message);  // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не закрывался таб с инпутом для изменения номера телефона,если есть ошибка

            }

        }



    }

    return (
        <footer className={cl.footer}>
            <div className={cl.footer__container}>
                <div className={cl.footer__inner}>
                    <div className={cl.footer__topBlock}>
                        <div className={cl.topBlock__leftBlock}>
                            <h3 className={cl.leftBlock__title}>Do You Need Help ?</h3>
                            <p className={cl.leftBlock__text}>Autoseligen syr. Nek diarask frobomba. Ner
                                antipol kynoda nynat. Pressa famoska.</p>
                            <div className={cl.leftBlock__infoItem}>
                                <img src="/images/footer/phoneImg.png" alt="" className={cl.infoItem__img} />
                                <div className={cl.infoItem__infoBlock}>
                                    <p className={cl.infoItem__text}>Monday-Friday: 08am-9pm</p>

                                    {/* если состояние таба tabChangeTel false,то показываем номер телефона и кнопку,чтобы изменить номер телефона,если это состояние tabChangeTel будет равно true,то этот блок показываться не будет */}
                                    {!tabChangeTel &&

                                        <div className={cl.infoBlock__telBlock}>

                                            {/* для ссылки на номер телефона,в href нужно указывать tel: + и без пробела номер телефона,чтобы сразу типа звонить по нему,но в данном случае указываем пока так, в tel: указываем dataAdminFields?.data.phoneNumber(реальный номер телефона без пробелов),а в тексте самой ссылке указываем dataAdminFields?.data.visiblePhoeNumber(визуальный номер телефона,как он будет выглядеть на сайте,админ сам будет это указывать) */}
                                            <a href={`tel:+${dataAdminFields?.data.phoneNumber}`} className={cl.infoItem__link}>{dataAdminFields?.data.visiblePhoneNumber}</a>

                                            {/* делаем проверку если user.role === 'ADMIN' (если роль у пользователя сейчас админ),то показываем кнопку изменения номера телефона */}
                                            {user.role === 'ADMIN' &&

                                                <button className={cl.sectionProductItemPage__changePriceBtn} onClick={() => setTabChangeTel(true)}>
                                                    <img src="/images/sectionUserPage/Close.png" alt="" className={cl.adminForm__deleteBtnImg} />
                                                </button>

                                            }

                                        </div>

                                    }

                                    {tabChangeTel &&
                                        <form onSubmit={changeTel} className={cl.formPhoneNumber}>

                                            <div className={cl.sectionUserPage__formInfoItem}>
                                                <p className={cl.sectionUserPage__formInfoItemText}>Phone Number</p>
                                                <input type="number" className={cl.sectionUserPage__formInfoItemInputNumber} value={inputPhoneNumber} onChange={(e) => setInputPhoneNumber(e.target.value)} />
                                            </div>

                                            <div className={cl.sectionUserPage__formInfoItem}>
                                                <p className={cl.sectionUserPage__formInfoItemText}>Visible Phone Number on site</p>
                                                <input type="text" className={cl.sectionUserPage__formInfoItemInput} value={inputVisiblePhoneNumber} onChange={(e) => setInputVisiblePhoneNumber(e.target.value)} />
                                            </div>

                                            {/* если errorPhoneNumber true(то есть в состоянии errorPhoneNumber что-то есть),то показываем текст ошибки */}
                                            {errorPhoneNumber && <p className={cl.formErrorText}>{errorPhoneNumber}</p>}

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button className={cl.sectionUserPage__formInfoBtn} type="submit">Save Changes</button>

                                        </form>

                                    }

                                </div>
                            </div>
                            <div className={cl.leftBlock__infoItem}>
                                <img src="/images/footer/mailImg.png" alt="" className={cl.infoItem__img} />
                                <div className={cl.infoItem__infoBlock}>
                                    <p className={cl.infoItem__text}>Need help with your order?</p>
                                    {/* для ссылки на почту,в href нужно указывать mailto: и без пробела почту,чтобы сразу типа писать туда,но в данном случае указываем пока так */}
                                    <a href="/aboutUs" className={cl.infoItem__link}>jinstore@gmail.com</a>
                                </div>
                            </div>
                        </div>
                        <div className={cl.topBlock__mainBlock}>
                            <ul className={cl.mainBlock__list}>
                                <h3 className={cl.list__title}>Make Money with Us</h3>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Sell on JinStore</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Become an Affilate</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Advertise Your Products</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Sell-Publish with Us</Link>
                                </li>
                            </ul>
                            <ul className={cl.mainBlock__list}>
                                <h3 className={cl.list__title}>Let Us Help You</h3>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Accessibility Statement</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Returns & Replacements</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Shipping Rates & Policies</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Privacy Policy</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Terms and Conditions</Link>
                                </li>
                            </ul>
                            <ul className={cl.mainBlock__list}>
                                <h3 className={cl.list__title}>Get to Know Us</h3>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Careers for JinStore</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>About JinStore</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Customer reviews</Link>
                                </li>
                                <li className={cl.list__item}>
                                    <Link to="/aboutUs" className={cl.list__link}>Social Responsibility</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={cl.footer__bottomBlock}>
                        <p className={cl.bottomBlock__text}>Copyright 2024 © Jinstore WooCommerce. All rights reserved. Powered by BlackRise Themes.</p>
                    </div>
                </div>
            </div>
        </footer>
    )

}

export default Footer;