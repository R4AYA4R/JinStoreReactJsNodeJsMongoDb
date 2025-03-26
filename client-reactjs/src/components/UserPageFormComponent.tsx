import { FormEvent, RefObject, useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const UserPageFormComponent = () => {

    const sectionNewArrivals = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionNewArrivals as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [tab, setTab] = useState('signIn');

    const [signInFormError, setSignInFormError] = useState('');

    const [hideInputPassSignIn, setHideInputPassSignIn] = useState(true);

    const [signUpFormError, setSignUpFormError] = useState('');

    const [hideInputPassSignUp, setHideInputPassSignUp] = useState(true);


    // функция для формы логина,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const signInFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

    }

    // функция для формы регистрации,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const signUpFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

    }

    return (
        // скопировали id и тд из файла sectionNewArrivals,так как здесь такая же анимация и это страница регистрации и авторизации,поэтому здесь не будет такой секции как в sectionNewArrivals,поэтому id будут нормально работать,это просто,чтобы не писать больше дополнительного
        <section ref={sectionNewArrivals} id="sectionNewArrivals" className={onScreen.sectionNewArrivalsIntersecting ? "sectionNewArrivals sectionNewArrivals__active sectionSignUp" : "sectionNewArrivals sectionSignUp"}>
            <div className="container">
                <div className="sectionSignUp__inner">
                    <div className="sectionSignUp__signUpBlock">
                        <div className="sectionSignUp__signUpBlock_tabs">
                            <button className={tab === 'signIn' ? "signUpBlock__tabs-btn signUpBlock__tabs-btn--active" : "signUpBlock__tabs-btn"} onClick={() => setTab('signIn')}>Login</button>
                            <button className={tab === 'signUp' ? "signUpBlock__tabs-btn signUpBlock__tabs-btn--active" : "signUpBlock__tabs-btn"} onClick={() => setTab('signUp')}>Register</button>
                        </div>

                        {tab === 'signIn' &&
                            <form className="signUpBlock__signInMainForm" onSubmit={signInFormHandler}>
                                <div className="signInMainForm__inputEmailBlock">
                                    <img src="/images/sectionSignUp/EnvelopeSimple.png" alt="" className="signInMainForm__inputEmailBlock-img" />
                                    <input type="text" placeholder="Email" className="signInMainForm__inputEmailBlock-input" />
                                </div>
                                <div className="signInMainForm__inputEmailBlock">
                                    <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMainForm__inputEmailBlock-img" />

                                    {/* если состояние hideInputPassSignIn true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                    <input type={hideInputPassSignIn ? "password" : "text"} className="signInMainForm__inputEmailBlock-input signInMainForm__inputPasswordBlock-input" placeholder="Password" />
                                    <button className="inputEmailBlock__btn" type="button" onClick={() => setHideInputPassSignIn((prev) => !prev)}>
                                        <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMainForm__inputEmailBlock-imgHide" />
                                    </button>
                                </div>

                                {/* если signInFormError не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                {signInFormError && <p className="formErrorText">{signInFormError}</p>}

                                {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                <button className="signInMainForm__btn" type="submit">Log In</button>

                            </form>
                        }


                        {tab === 'signUp' &&
                            <form className="signUpBlock__signInMainForm" onSubmit={signUpFormHandler}>
                                <div className="signInMainForm__inputEmailBlock">
                                    <img src="/images/sectionSignUp/User.png" alt="" className="signInMainForm__inputEmailBlock-img" />
                                    <input type="text" placeholder="Name" className="signInMainForm__inputEmailBlock-input" />
                                </div>
                                <div className="signInMainForm__inputEmailBlock">
                                    <img src="/images/sectionSignUp/EnvelopeSimple.png" alt="" className="signInMainForm__inputEmailBlock-img" />
                                    <input type="text" placeholder="Email" className="signInMainForm__inputEmailBlock-input" />
                                </div>
                                <div className="signInMainForm__inputEmailBlock">
                                    <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMainForm__inputEmailBlock-img" />

                                    {/* если состояние hideInputPassSignIn true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                    <input type={hideInputPassSignUp ? "password" : "text"} className="signInMainForm__inputEmailBlock-input signInMainForm__inputPasswordBlock-input" placeholder="Password" />
                                    <button className="inputEmailBlock__btn" type="button" onClick={() => setHideInputPassSignUp((prev) => !prev)}>
                                        <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMainForm__inputEmailBlock-imgHide" />
                                    </button>
                                </div>

                                {/* если signUpFormError не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                {signUpFormError && <p className="formErrorText">{signUpFormError}</p>}

                                {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                <button className="signInMainForm__btn" type="submit">Sign Up</button>

                            </form>

                        }

                    </div>
                </div>
            </div>
        </section>
    )

}

export default UserPageFormComponent;