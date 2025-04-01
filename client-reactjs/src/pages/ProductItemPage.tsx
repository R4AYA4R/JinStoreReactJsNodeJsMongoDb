
import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IComment, IProduct } from "../types/types";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ProductItemPageItemBlock from "../components/ProductItemPageItemBlock";
import { useTypedSelector } from "../hooks/useTypedSelector";
import ProductItemPageReviewItem from "../components/ProductItemPageReviewItem";
import { API_URL } from "../http/http";

// формат картинок svg можно изменять до любого размера без потери качества и он меньше весит,чем png формат,лучше использовать svg картинки для всяких небольших картинок,когда задний фон картинки не имеет значения

const ProductItemPage = () => {


    // скопировали это из файла SectionNewArrivals,так как здесь тоже самое,чтобы дополнительно не писать
    const sectionNewArrivals = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionNewArrivals as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу

    const [tab, setTab] = useState('Desc'); // состояние для таба описания

    const [activeForm, setActiveForm] = useState(false);

    const [activeStarsForm, setActiveStarsForm] = useState(0);

    const [textAreaValue, setTextAreaValue] = useState('');

    const [errorForm, setErrorForm] = useState(''); // состояние для ошибки формы

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния user и тд,используя наш типизированный хук для useSelector


    const { data, refetch } = useQuery({
        queryKey: ['getProductById'],
        queryFn: async () => {

            const response = await axios.get<IProduct>(`http://localhost:5000/api/getProductsCatalog/${params.id}`); // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IProduct для объекта товара)

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет объект товара) и тд

        }

    })

    const { data:dataComments, refetch:refetchComments } = useQuery({
        queryKey: ['commentsForProduct'],
        queryFn: async () => {

            const response = await axios.get<IComment[]>(`${API_URL}/getCommentsForProduct?productNameFor=${data?.data.name}`); // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productNameFor со значением name у товара на этой странице,можно было указать этот query параметр productNameFor вторым параметром в этой функции get запроса у axios в объекте в поле params,но можно и так

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет массив объектов комментариев) и тд

        }

    })

    // функция для post запроса на сервер с помощью useMutation(react query),создаем комментарий на сервере,берем mutate у useMutation,чтобы потом вызвать эту функцию запроса на сервер в нужный момент
    const { mutate } = useMutation({
        mutationKey: ['create comment'],
        mutationFn: async (comment: IComment) => {

            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IComment),но здесь не обязательно указывать тип
            await axios.post<IComment>(`${API_URL}/createComment`, comment);

        },

        // при успешной мутации переобновляем массив комментариев
        onSuccess(){
            refetchComments();
        }

    })

    // указываем,что эта функция ничего не возвращает(то есть указываем ей тип возвращаемых данных как void),в данном случае это не обязательно делать,так как это и так понятно,но так как используем typescript и чтобы лучше попрактиковаться и больше его использовать,указываем это,также vs code автоматически подхватывает тип возвращаемых данных,если функция ничего не возвращает и в данном случае указывать это не обязательно
    const addReviewsBtn = (): void => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то показываем форму,в другом случае перекидываем пользователя на страницу авторизации 
        if (user.userName) {

            setActiveForm(true); // изменяем состояние активной формы,то есть показываем форму для создания комментария 

        } else {

            router('/userPage'); // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

        }

    }

    // функция для формы для создания комментария,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение textarea (.trim()-убирает из строки пробелы,чтобы нельзя было ввести только пробел) в форме комментария будет по количеству символов меньше или равно 10,то будем изменять состояние errorForm(то есть показывать ошибку и не отправлять комментарий),в другом случае очищаем поля textarea,activeStars(рейтинг,который пользователь указал в форме) и убираем форму
        if (textAreaValue.trim().length <= 10) {

            setErrorForm('Review must be more than 10 characters');

        } else if (activeStarsForm === 0) {

            // если состояние рейтинга в форме равно 0,то есть пользователь не указал рейтинг,то показываем ошибку
            setErrorForm('Enter rating');

        } else {

            const date = new Date(); // создаем объект на основе класса Date(класс в javaScript для работы с датой и временем)

            let monthDate = (date.getMonth() + 1).toString(); // помещаем в переменную номера текущего месяца,указываем ей let,чтобы можно было изменять ей значение потом, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString()

            let dayDate =  (date.getDate()).toString(); // помещаем в переменную текущее число месяца,указываем ей let,чтобы можно было изменять ей значение потом, date.getDate() - показывает текущее число календаря и потом приводим получившееся значение к формату строки с помощью toString(),чтобы проверить на количество символов 

            // если monthDate.length < 2(то есть monthDate по количеству символов меньше 2,то есть текущий месяц состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
            if(monthDate.length < 2){

                monthDate = '0' + monthDate; // изменяем значение monthDate на 0 + текущее значение monthDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

            }else{
                // в другом случае,если условие выше не сработало,то изменяем monthDate на monthDate,то есть оставляем этой переменной такое же значение как и изначальное
                monthDate = monthDate;

            }


            // если dayDate.length < 2(то есть dayDate по количеству символов меньше 2,то есть текущее число месяца состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
            if(dayDate.length < 2){

                dayDate = '0' + dayDate; // изменяем значение dayDate на 0 + текущее значение dayDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

            }else{
                // в другом случае,если условие выше не сработало,то изменяем dayDate на dayDate,то есть оставляем этой переменной такое же значение как и изначальное
                dayDate = dayDate;

            }

            // помещаем в переменную showTime значение времени,когда создаем комментарий, date.getDate() - показывает текущее число календаря, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString(), getFullYear() - показывает текущий год,потом эту переменную showTime будем сохранять в объект для создания комментария на сервере и потом показывать дату создания комментария уже на клиенте(в данном случае на этой странице у комментария),вынесли подсчет месяца в переменную monthDate и тут ее указываем,также и подсчет текущего числа месяца в переменную dayDate и тут ее указываем
            const showTime = dayDate + '.' + monthDate + '.' + date.getFullYear();


            mutate({name:user.userName,text:textAreaValue,rating:activeStarsForm,productNameFor:data?.data.name,createdTime:showTime} as IComment); // вызываем функцию post запроса на сервер,создавая комментарий,разворачивая в объект нужные поля для комментария и давая этому объекту тип as IComment(вручную не указываем id,чтобы он автоматически создавался на сервере), указываем поле productNameFor со значением как у name товара на этой странице,чтобы в базе данных связать этот товар с комментарием


            setActiveForm(false); // убираем форму,изменяя состояние activeForm на false

            setActiveStarsForm(0); // убираем звезды формы(ставим их на дефолтное значение,изменяя состояние activeStarsForm на 0),которые мог пользователь ввести

            setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь мог ввести

            setErrorForm(''); // убираем ошибку формы,если она была

        }


    }

    // функция для отмены(закрытия) формы создания комментария
    const cancelFormHandler = () => {

        setActiveForm(false); // убираем форму,изменяя состояние activeForm на false

        setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь мог ввести

        setErrorForm(''); // убираем ошибку формы,если она была

    }

    // при изменении массива комментариев и данных товара(data?.data) на этой странице,переобновляем массив комментариев для этого товара
    useEffect(()=>{

        refetchComments();

    },[data?.data])

    return (
        <main className="main">
            {/* скопировали id и тд из файла sectionNewArrivals,так как здесь такая же анимация и это страница товара,поэтому здесь не будет такой секции как в sectionNewArrivals,поэтому id будут нормально работать,это просто,чтобы не писать больше дополнительного */}
            <section className={onScreen.sectionNewArrivalsIntersecting ? "sectionNewArrivals sectionNewArrivals__active sectionProductItemPage" : "sectionNewArrivals sectionProductItemPage"} ref={sectionNewArrivals} id="sectionNewArrivals">
                <div className="container">
                    <div className="sectionProductItemPage__inner">
                        <div className="sectionProductItemPage__top sectionCatalog__topBlock">
                            <p className="sectionCatalog__topBlock-title">Home</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-title">{data?.data.category}</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-subtitle">{data?.data.name}</p>
                        </div>

                        {/* вынесли блок с информацией о товара и слайдером в наш компонент ProductItemPageItemBlock,так как там много кода,передаем туда как пропс(параметр) product со значением data?.data(объект товара) */}
                        <ProductItemPageItemBlock product={data?.data} />

                        <div className="sectionProductItemPage__descBlock">
                            <div className="sectionProductItemPage__descBlock-tabs">
                                <button className={tab === 'Desc' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Desc')}>Description</button>
                                <button className={tab === 'Reviews' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Reviews')}>Reviews ({dataComments?.data.length})</button>
                            </div>

                            <div className="sectionProductItemPage__descBlock-desc">

                                {/* если tab равно 'Desc',то показываем блок с описанием */}
                                {tab === 'Desc' &&

                                    <div className="descBlock__desc-inner">
                                        <p className="descBlock__desc-descText">{data?.data.descText}</p>
                                        <p className="descBlock__desc-subText"> Sapien vitae odio accumsan gravida. Morbi vitae erat auctor, eleifend nunc a, lobortis neque. Praesent aliquam dignissim viverra. Maecenas lacus odio, feugiat eu nunc sit amet,maximus sagittis dolor. Vivamus nisi sapien, elementum sit amet eros sit amet, ultricies cursus ipsum. Sed consequat luctus ligula. Curabitur laoreet rhoncus blandit. Aenean vel diam utarcu pharetra dignissim ut sed leo. Vivamus faucibus, ipsum in vestibulum vulputate, lorem orci convallis quam, sit amet consequat nulla felis pharetra lacus. Duis semper erat mauris, sed egestas purus commodo vel.</p>
                                    </div>

                                }

                                {tab === 'Reviews' &&

                                    <div className="descBlock__reviews-inner">
                                        <div className="reviews__leftBlock">

                                            {dataComments?.data.length ? 
                                                dataComments.data.map(comment => 

                                                    <ProductItemPageReviewItem key={comment._id} user={user} comment={comment}/>   

                                                )
                                                : 
                                                <h4 className="reviews__leftBlock-text">No reviews yet.</h4> 
                                            }

                                            {/* <h4 className="reviews__leftBlock-text">No reviews yet.</h4> */}

                                        </div>
                                        <div className="reviews__rightBlock">

                                            <div className={activeForm ? "reviews__rightBlock-btnBlock reviews__rightBlock-btnBlock--disabled" : "reviews__rightBlock-btnBlock"}>
                                                <button className="reviews__btnBlock-btn" onClick={addReviewsBtn}>Add Review</button>
                                            </div>

                                            <form onSubmit={submitFormHandler} className={activeForm ? "reviews__form reviews__form--active" : "reviews__form"}>
                                                <div className="reviews__form-topBlock">
                                                    <div className="reviews__form-topBlockInfo">
                                                        <img src="/images/sectionProductItemPage/Profile.png" alt="" className="form__topBlockInfo-img" />
                                                        <p className="form__topBlockInfo-text">{user.userName}</p>
                                                    </div>
                                                    <div className="sectionNewArrivals__item-stars reviews__form-starsBlock">
                                                        {/* указываем этой кнопке тип button(то есть обычная кнопка),так как это кнопка находится в форме и чтобы при нажатии на нее форма не отправлялась(то есть не срабатывало событие onSubmit у формы), по клику на эту кнопку изменяем состояние activeStarsForm на 1,то есть на 1 звезду */}
                                                        <button className="form__starsBlock-btn" type="button" onClick={() => setActiveStarsForm(1)}>
                                                            {/* если activeStarsForm равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                                                            <img src={activeStarsForm === 0 ? "/images/sectionProductItemPage/GreyStar.svg" : "/images/sectionProductItemPage/YellowStar.svg"} alt="" className="sectionNewArrivals__item-starsImg reviews__starsImg" />
                                                        </button>
                                                        <button className="form__starsBlock-btn" type="button" onClick={() => setActiveStarsForm(2)}>
                                                            <img src={activeStarsForm >= 2 ? "/images/sectionProductItemPage/YellowStar.svg" : "/images/sectionProductItemPage/GreyStar.svg"} alt="" className="sectionNewArrivals__item-starsImg reviews__starsImg" />
                                                        </button>
                                                        <button className="form__starsBlock-btn" type="button" onClick={() => setActiveStarsForm(3)}>
                                                            <img src={activeStarsForm >= 3 ? "/images/sectionProductItemPage/YellowStar.svg" : "/images/sectionProductItemPage/GreyStar.svg"} alt="" className="sectionNewArrivals__item-starsImg reviews__starsImg" />
                                                        </button>
                                                        <button className="form__starsBlock-btn" type="button" onClick={() => setActiveStarsForm(4)}>
                                                            <img src={activeStarsForm >= 4 ? "/images/sectionProductItemPage/YellowStar.svg" : "/images/sectionProductItemPage/GreyStar.svg"} alt="" className="sectionNewArrivals__item-starsImg reviews__starsImg" />
                                                        </button>
                                                        <button className="form__starsBlock-btn" type="button" onClick={() => setActiveStarsForm(5)}>
                                                            <img src={activeStarsForm >= 5 ? "/images/sectionProductItemPage/YellowStar.svg" : "/images/sectionProductItemPage/GreyStar.svg"} alt="" className="sectionNewArrivals__item-starsImg reviews__starsImg" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="reviews__form-mainBlock">
                                                    <textarea placeholder="Enter your comment" className="form__mainBlock-textarea" value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)}></textarea>

                                                    {/* если errorForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                                    {errorForm !== '' && <p className="formErrorText">{errorForm}</p>}

                                                    <div className="form__mainBlock-bottomBlock">
                                                        {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                                        <button className="reviews__btnBlock-btn" type="submit">Save Review</button>

                                                        <button className="reviews__item-btnAnswer" type="button" onClick={cancelFormHandler}>Cancel</button>
                                                    </div>

                                                </div>

                                            </form>

                                        </div>
                                    </div>

                                }


                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </main>
    )

}

export default ProductItemPage;