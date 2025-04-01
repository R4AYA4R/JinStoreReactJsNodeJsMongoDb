import { FormEvent, useState } from "react";
import { IComment, IUser } from "../types/types";

interface IProductItemPageReviewItem {
    user: IUser,
    comment:IComment
}

const ProductItemPageReviewItem = ({ user,comment }: IProductItemPageReviewItem) => {

    const [activeForm, setActiveForm] = useState(false);

    const [textAreaValue, setTextAreaValue] = useState('');

    const [errorForm, setErrorForm] = useState(''); // состояние для ошибки формы


    // функция для формы для создания комментария,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение textarea (.trim()-убирает из строки пробелы,чтобы нельзя было ввести только пробел) в форме комментария будет по количеству символов меньше или равно 10,то будем изменять состояние errorForm(то есть показывать ошибку и не отправлять комментарий),в другом случае очищаем поля textarea и тд и убираем форму
        if (textAreaValue.trim().length <= 10) {

            setErrorForm('Reply must be more than 10 characters');

        } else {

            // здесь будем делать запрос на создание ответа к комментарию от админа


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

            {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор),то показываем кнопку админа для добавления ответа на комментарий */}
            {user.role === 'ADMIN' &&
                <div className="reviews__item-blockAnswer">

                    {/* это будет кнопка для админа,если у комента еще нет ответа от админа */}
                    <button className={activeForm ? "reviews__rightBlock-btnBlock--disabled reviews__item-btnAnswer" : "reviews__item-btnAnswer"} onClick={() => setActiveForm(true)}>Add Reply</button>

                    <form onSubmit={submitFormHandler} className={activeForm ? "reviews__form reviews__formAnswer reviews__form--active" : "reviews__form reviews__formAnswer"}>
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

            {/* комент от админа */}
            {/* <div className="reviews__item-blockAdminComment">
                <p className="reviews__item-topBlockReply">Reply for Username</p>
                <div className="reviews__item-topBlock">
                    <div className="reviews__item-topBlockLeftInfo">
                        <img src="/images/sectionProductItemPage/Profile.png" alt="" className="reviews__item-img" />
                        <div className="reviews__item-topBlockLeftInfo--info">
                            <p className="reviews__item-infoName">ADMIN</p>
                        </div>
                    </div>
                    <p className="reviews__item-topBlockTime">20.10.2000</p>
                </div>
                <p className="reviews__item-text">Comment text</p>
            </div> */}

        </div>
    )

}

export default ProductItemPageReviewItem;