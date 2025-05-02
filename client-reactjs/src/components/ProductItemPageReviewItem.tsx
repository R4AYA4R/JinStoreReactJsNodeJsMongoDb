import { FormEvent, useState } from "react";
import { IComment, ICommentResponse, IUser } from "../types/types";
import $api, { API_URL } from "../http/http";
import { QueryObserverResult } from "@tanstack/react-query";

interface IProductItemPageReviewItem {
    user: IUser,
    comment: IComment,
    refetchComments: () => Promise<QueryObserverResult<ICommentResponse, Error>> // указываем этому полю,что это стрелочная функция и возвращает Promise<QueryObserverResult<ICommentResponse, Error>> (этот тип скопировали из файла ProductItemPage.tsx у этой функции refetchComments),то есть указываем,что эта функция возвращает Promise,внутри которого тип QueryObserverResult,внутри которого наш тип ICommentResponse и тип Error
}

const ProductItemPageReviewItem = ({ user, comment, refetchComments }: IProductItemPageReviewItem) => {

    const [activeForm, setActiveForm] = useState(false);

    const [textAreaValue, setTextAreaValue] = useState('');

    const [errorForm, setErrorForm] = useState(''); // состояние для ошибки формы


    // функция для формы для создания комментария,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение textarea (.trim()-убирает из строки пробелы,чтобы нельзя было ввести только пробел) в форме комментария будет по количеству символов меньше или равно 10,то будем изменять состояние errorForm(то есть показывать ошибку и не отправлять комментарий),в другом случае очищаем поля textarea и тд и убираем форму
        if (textAreaValue.trim().length <= 10) {

            setErrorForm('Reply must be 11 - 100 characters');

        } else if (textAreaValue.trim().length > 300) {

            setErrorForm('Reply must be 11 - 300 characters');

        } else {

            // здесь будем делать запрос на создание ответа к комментарию от админа

            // оборачиваем в try catch для отлавливания ошибок
            try {

                const date = new Date(); // создаем объект на основе класса Date(класс в javaScript для работы с датой и временем)

                let monthDate = (date.getMonth() + 1).toString(); // помещаем в переменную номера текущего месяца,указываем ей let,чтобы можно было изменять ей значение потом, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString()

                let dayDate = (date.getDate()).toString(); // помещаем в переменную текущее число месяца,указываем ей let,чтобы можно было изменять ей значение потом, date.getDate() - показывает текущее число календаря и потом приводим получившееся значение к формату строки с помощью toString(),чтобы проверить на количество символов 

                // если monthDate.length < 2(то есть monthDate по количеству символов меньше 2,то есть текущий месяц состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
                if (monthDate.length < 2) {

                    monthDate = '0' + monthDate; // изменяем значение monthDate на 0 + текущее значение monthDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

                } else {
                    // в другом случае,если условие выше не сработало,то изменяем monthDate на monthDate,то есть оставляем этой переменной такое же значение как и изначальное
                    monthDate = monthDate;

                }


                // если dayDate.length < 2(то есть dayDate по количеству символов меньше 2,то есть текущее число месяца состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
                if (dayDate.length < 2) {

                    dayDate = '0' + dayDate; // изменяем значение dayDate на 0 + текущее значение dayDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

                } else {
                    // в другом случае,если условие выше не сработало,то изменяем dayDate на dayDate,то есть оставляем этой переменной такое же значение как и изначальное
                    dayDate = dayDate;

                }

                // помещаем в переменную showTime значение времени,когда создаем комментарий от админа, date.getDate() - показывает текущее число календаря, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString(), getFullYear() - показывает текущий год,потом эту переменную showTime будем сохранять в объект для создания комментария на сервере и потом показывать дату создания комментария уже на клиенте(в данном случае на этой странице у комментария),вынесли подсчет месяца в переменную monthDate и тут ее указываем,также и подсчет текущего числа месяца в переменную dayDate и тут ее указываем
                const showTime = dayDate + '.' + monthDate + '.' + date.getFullYear();

                const response = await $api.put<IComment>(`${API_URL}/addReplyForComment`, {
                    ...comment, adminReply: {
                        text: textAreaValue,
                        createdTime: showTime
                    }
                }); // делаем put запрос на сервер и изменяем данные на сервере,указываем тип данных,которые нужно добавить на сервер(в данном случае IComment),но здесь не обязательно указывать тип,в тело запроса передаем объект,в который разворачиваем все поля объекта comment(пропс(параметр) этого компонента ProductItemPageReviewItem,то есть объект комментария) и добавляем поле adminReply со значением объекта с полями,указываем полю text значение как textAreaValue,а полю createdTime значение как showTime,используем тут наш инстанс axios ($api),чтобы правильно обрабатывался этот запрос для проверки на access токен с помощью нашего authMiddleware на нашем сервере

                console.log(response);

                refetchComments(); // переобновляем массив комментариев(делаем повторный запрос на сервер для их получения)

            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorForm(e.response?.data?.message); // возвращаем и показываем ошибку в форме,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию

            }


            setActiveForm(false); // убираем форму,изменяя состояние activeForm на false

            setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь мог ввести

            setErrorForm(''); // убираем ошибку формы,если она была

        }

    }

    const cancelFormHandler = () => {

        setActiveForm(false); // убираем форму,изменяя состояние activeForm на false

        setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь мог ввести

        setErrorForm(''); // убираем ошибку формы,если она была

    }

    return (
        <div className="reviews__leftBlock-item">
            <div className="reviews__item-topBlock">
                <div className="reviews__item-topBlockLeftInfo">
                    <img src="/images/sectionProductItemPage/Profile.png" alt="" className="reviews__item-img" />
                    <div className="reviews__item-topBlockLeftInfo--info">
                        <p className="reviews__item-infoName">{comment.name}</p>
                        <div className="sectionNewArrivals__item-stars reviews__form-starsBlock reviews__item-starsBlock">
                            {/* если comment.rating равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                            <img src={comment.rating === 0 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector.png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src={comment.rating >= 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src={comment.rating >= 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src={comment.rating >= 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src={comment.rating >= 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                        </div>
                    </div>
                </div>
                <p className="reviews__item-topBlockTime">{comment.createdTime}</p>
            </div>
            <p className="reviews__item-text">{comment.text}</p>

            
            {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор) и если comment.adminReply false(или null,или undefined),то есть поле adminReply у comment(объект комментария) не указано,или в нем нету значения(то есть у этого комментария нету еще ответа от админа),то показываем блок и кнопку для добавления ответа от админа,в другом случае этот блок(div элемент со всей формой и тд) и кнопка показана не будет*/}
            {user.role === 'ADMIN' && !comment.adminReply &&
                <div className="reviews__item-blockAnswer">

                    <button className={activeForm ? "reviews__rightBlock-btnBlock--disabled reviews__item-btnAnswer" : "reviews__item-btnAnswer"} onClick={() => setActiveForm(true)}>Add Reply</button>

                    <form onSubmit={submitFormHandler} className={activeForm ? "reviews__formAnswer reviews__formAnswer--active" : "reviews__form reviews__formAnswer"}>
                        <div className="reviews__form-topBlock">
                            <div className="reviews__form-topBlockInfo">
                                <img src="/images/sectionProductItemPage/Profile.png" alt="" className="form__topBlockInfo-img" />
                                <p className="form__topBlockInfo-text">ADMIN</p>
                            </div>
                        </div>
                        <div className="reviews__form-mainBlock">
                            <textarea placeholder="Enter your reply" className="form__mainBlock-textarea" value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)}></textarea>

                            {/* если errorForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                            {errorForm !== '' && <p className="formErrorText">{errorForm}</p>}


                            <div className="form__mainBlock-bottomBlock">
                                {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                <button className="reviews__btnBlock-btn" type="submit">Save Reply</button>

                                <button className="reviews__item-btnAnswer" type="button" onClick={cancelFormHandler}>Cancel</button>
                            </div>

                        </div>

                    </form>

                </div>
            }

            {/* если comment.adminReply true,то есть поле adminReply у объекта comment(объект комментария) есть и в нем есть какое-то значение,то показываем блок с ответом от админа для этого комментария*/}
            {comment.adminReply &&
                <div className="reviews__item-blockAdminComment">
                    <p className="reviews__item-topBlockReply">Reply for {comment.name}</p>
                    <div className="reviews__item-topBlock">
                        <div className="reviews__item-topBlockLeftInfo">
                            <img src="/images/sectionProductItemPage/Profile.png" alt="" className="reviews__item-img" />
                            <div className="reviews__item-topBlockLeftInfo--info">
                                <p className="reviews__item-infoName">ADMIN</p>
                            </div>
                        </div>
                        <p className="reviews__item-topBlockTime">{comment.adminReply.createdTime}</p>
                    </div>

                    <div className="reviews__item-text">{comment.adminReply.text}</div>

                </div>
            }

        </div >
    )

}

export default ProductItemPageReviewItem;