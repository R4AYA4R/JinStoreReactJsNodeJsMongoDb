import { FormEvent, RefObject, useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import AuthService from "../service/AuthService";
import { useActions } from "../hooks/useActions";

const UserPageFormComponent = () => {

    const sectionNewArrivals = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionNewArrivals as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [tab, setTab] = useState('signIn');

    const [signInFormError, setSignInFormError] = useState('');

    const [hideInputPassSignIn, setHideInputPassSignIn] = useState(true);




    const [signUpFormError, setSignUpFormError] = useState('');

    const [hideInputPassSignUp, setHideInputPassSignUp] = useState(true);

    const [hideInputConfirmPassSignUp, setHideInputConfirmPassSignUp] = useState(true);

    const [inputNameSignUp, setInputNameSignUp] = useState('');

    const [inputEmailSignUp, setInputEmailSignUp] = useState('');

    const [inputPasswordSignUp, setInputPasswordSignUp] = useState('');

    const [inputConfirmPasswordSignUp, setInputConfirmPasswordSignUp] = useState('');


    const { registrationForUser } = useActions(); // берем action registrationForUser и другие для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутый в диспатч,так как мы оборачивали это в самом хуке useActions


    // функция для регистрации
    const registration = async (email: string, password: string) => {

        // оборачиваем в try catch,чтобы отлавливать ошибки
        try {

            let name = inputNameSignUp;  // помещаем в переменную name(указываем ей именно let,чтобы можно было изменять) значение инпута имени

            name = name.trim().replace(name[0], name[0].toUpperCase()); // убираем пробелы из переменной имени и заменяем первую букву этой строки инпута имени(name[0] в данном случае) на первую букву этой строки инпута имени только в верхнем регистре(name[0].toUpperCase()),чтобы имя начиналось с большой буквы,даже если написали с маленькой

            const response = await AuthService.registration(email, password, name); // вызываем нашу функцию registration() у AuthService,передаем туда email,password и name(имя пользователя,его поместили в переменную name выше в коде),если запрос прошел успешно,то в ответе от сервера будут находиться токены, поле user с объектом пользователя(с полями email,id,userName,role),их и помещаем в переменную response

            console.log(response);

            registrationForUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        } catch (e:any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e 

            setSignUpFormError(e.response?.data?.message + '. Fill in all fields correctly'); // помещаем в состояние ошибки формы регистрации текст ошибки,которая пришла от сервера(в данном случае еще и допольнительный текст)

        }

    }

    // функция для формы логина,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const signInFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

    }

    // функция для формы регистрации,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const signUpFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если состояние инпута пароля не равно состоянию инпута подтверждения пароля,то показываем ошибку,что пароли не совпадают
        if (inputPasswordSignUp !== inputConfirmPasswordSignUp) {

            setSignUpFormError('Passwords don`t match'); // показываем ошибку формы

        } else if (inputEmailSignUp.trim() === '' || inputNameSignUp.trim() === '' || inputPasswordSignUp.trim() === '') {
            // если состояние инпута почты,отфильтрованое без пробелов(с помощью trim(),то есть из этой строки убираются пробелы) равно пустой строке или инпут пароля равен пустой строке,или инпут имени равен пустой строке (все эти инпуты проверяем уже отфильтрованные по пробелу с помощью trim() ),то показываем ошибку

            setSignUpFormError('Fill in all fields');

        } else if (inputPasswordSignUp.length < 3 || inputPasswordSignUp.length > 32) {
            // если значение инпута пароля по длине символов меньше 3 или больше 32,то показываем ошибку

            setSignUpFormError('Password must be 3 - 32 characters'); // показываем ошибку формы

        } else if (!inputEmailSignUp.includes('.') || inputEmailSignUp.length < 4) {
            // если инпут почты includes('.') false(то есть инпут почты не включает в себя точку) или значение инпута почты по количеству символов меньше 4,то показываем ошибку

            setSignUpFormError('Enter email correctly'); // показываем ошибку формы

        } else if (inputNameSignUp.length < 3) {
            // если инпут имени по количеству символов меньше 3

            setSignUpFormError('Name must be more than 2 characters');  // показываем ошибку формы

        } else {

            setSignUpFormError(''); // указываем значение состоянию ошибки пустую строку,то есть убираем ошибку,если она была

            registration(inputEmailSignUp, inputPasswordSignUp); // вызываем нашу функцию регистрации и передаем туда состояния инпутов почты и пароля


        }

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
                                    <input type="text" placeholder="Name" className="signInMainForm__inputEmailBlock-input" value={inputNameSignUp} onChange={(e) => setInputNameSignUp(e.target.value)} />
                                </div>
                                <div className="signInMainForm__inputEmailBlock">
                                    <img src="/images/sectionSignUp/EnvelopeSimple.png" alt="" className="signInMainForm__inputEmailBlock-img" />
                                    <input type="text" placeholder="Email" className="signInMainForm__inputEmailBlock-input" value={inputEmailSignUp} onChange={(e) => setInputEmailSignUp(e.target.value)} />
                                </div>
                                <div className="signInMainForm__inputEmailBlock">
                                    <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMainForm__inputEmailBlock-img" />

                                    {/* если состояние hideInputPassSignIn true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                    <input type={hideInputPassSignUp ? "password" : "text"} className="signInMainForm__inputEmailBlock-input signInMainForm__inputPasswordBlock-input" placeholder="Password" value={inputPasswordSignUp} onChange={(e) => setInputPasswordSignUp(e.target.value)} />
                                    <button className="inputEmailBlock__btn" type="button" onClick={() => setHideInputPassSignUp((prev) => !prev)}>
                                        <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMainForm__inputEmailBlock-imgHide" />
                                    </button>
                                </div>

                                <div className="signInMainForm__inputEmailBlock">
                                    <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMainForm__inputEmailBlock-img" />

                                    {/* если состояние hideInputPassSignIn true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                    <input type={hideInputConfirmPassSignUp ? "password" : "text"} className="signInMainForm__inputEmailBlock-input signInMainForm__inputPasswordBlock-input" placeholder="Confirm Password" value={inputConfirmPasswordSignUp} onChange={(e) => setInputConfirmPasswordSignUp(e.target.value)} />
                                    <button className="inputEmailBlock__btn" type="button" onClick={() => setHideInputConfirmPassSignUp((prev) => !prev)}>
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