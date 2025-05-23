
import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IComment, ICommentResponse, IProduct, IProductCart, IProductsCartResponse } from "../types/types";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductItemPageItemBlock from "../components/ProductItemPageItemBlock";
import { useTypedSelector } from "../hooks/useTypedSelector";
import ProductItemPageReviewItem from "../components/ProductItemPageReviewItem";
import { API_URL } from "../http/http";
import SectionNewArrivals from "../components/SectionNewArrivals";
import { getPagesArray } from "../utils/getPagesArray";

// формат картинок svg можно изменять до любого размера без потери качества и он меньше весит,чем png формат,лучше использовать svg картинки для всяких небольших картинок,когда задний фон картинки не имеет значения

const ProductItemPage = () => {

    const [page, setPage] = useState(1); // указываем состояние текущей страницы

    const [totalPages, setTotalPages] = useState(0); // указываем состояние totalPages в данном случае для общего количества страниц

    const [limit, setLimit] = useState(3); // указываем лимит для максимального количества объектов,которые будут на одной странице(для пагинации)

    const { pathname } = useLocation(); // берем pathname(url страницы) из useLocation()

    // не используем здесь уже анимацию появления,так как отслеживаем загрузку запроса на сервер для получения комментариев товара
    // скопировали это из файла SectionNewArrivals,так как здесь тоже самое,чтобы дополнительно не писать
    // const sectionBestSellers = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    // const onScreen = useIsOnScreen(sectionBestSellers as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу

    const [tab, setTab] = useState('Desc'); // состояние для таба описания

    const [activeForm, setActiveForm] = useState(false);

    const [activeStarsForm, setActiveStarsForm] = useState(0);

    const [textAreaValue, setTextAreaValue] = useState('');

    const [errorForm, setErrorForm] = useState(''); // состояние для ошибки формы

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния user и тд,используя наш типизированный хук для useSelector


    const { data, refetch, isFetching: isFetchingProductById } = useQuery({
        queryKey: [`getProductById${params.id}`], // делаем отдельный queryKey для каждого товара с помощью params.id,чтобы правильно отображалась пагинация комментариев при переходе на разные страницы товаров
        queryFn: async () => {

            const response = await axios.get<IProduct>(`http://localhost:5000/api/getProductsCatalog/${params.id}`); // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IProduct для объекта товара)

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет объект товара) и тд

        }

    })

    // не указываем такой же queryKey как и в sectionNewArrivals для получения комментариев,чтобы при изменении комментариев у товара переобновлять массив комментариев отдельно для этой страницы productItemPage
    const { data: dataComments, refetch: refetchComments, isFetching, isLoading } = useQuery({
        queryKey: [`commentsForProductItemPage${params.id}`], // делаем отдельный queryKey для комментариев для каждого товара с помощью params.id,чтобы правильно отображалась пагинация комментариев при переходе на разные страницы товаров и правильно работала отслеживание заргузки запроса на сервер
        queryFn: async () => {

            const response = await axios.get<ICommentResponse>(`${API_URL}/getCommentsForProduct`, {

                params: {

                    productNameFor: data?.data.name,

                    limit: limit, // указываем параметр limit для максимального количества объектов,которые будут на одной странице(для пагинации),можно было указать эти параметры limit и page просто через знак вопроса в url,но можно и тут в отдельном объекте params

                    page: page  // указываем параметр page(параметр текущей страницы,для пагинации)

                }

            }); // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productNameFor со значением name у товара на этой странице,конкретно указываем этот параметр в объекте в params у этой функции запроса,а не через знак вопроса просто в url,иначе,если в названии товара есть знаки амперсанта(&),то не будут найдены эти комментарии по такому названию,так как эти знаки амперсанта не правильно конкатенируются если их указать просто в url через знак вопроса 

            const totalCount = response.data.allCommentsForName.length; // записываем общее количество объектов комментариев,отфильтрованных для отдельного товара по имени с помощью .length,которые пришли от сервера в переменную totalCount(берем это у поля length у поля allCommentsForName(массив всех объектов комментариев без лимитов и состояния текущей страницы,то есть без пагинации) у поля data у response(общий объект ответа от сервера))

            setTotalPages(Math.ceil(totalCount / limit));  // изменяем состояние totalPages на значение деления totalCount на limit,используем Math.ceil() - она округляет получившееся значение в большую сторону к целому числу(например,5.3 округлит к 6),чтобы правильно посчитать общее количество страниц

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля allComments, allCommentsForName и comments

        }

    })

    // скопировали этот запрос на сервер из файла sectionNewArrivals,и указали такой же queryKey как и там,чтобы при изменении рейтинга у товара переобновлять массив товаров в секции sectionNewArrivals
    const { data: dataProductArrivals, refetch: refetchProductArrivals, isFetching: isFetchingProduct } = useQuery({
        queryKey: ['getAllProducts'], // указываем здесь такое же название,как и в файле SectionDeals для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другом компоненте(в данном случае в SectionDeals),а не после обновления страницы
        queryFn: async () => {
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts?limit=5&skip=0'); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных mongodb) и skip(сколько объектов пропустить,прежде чем начать брать их из базы данных mongodb)

            console.log(response.data);

            return response; // возвращаем этот массив объектов товаров(он будет помещен в поле data у data,которую мы берем из этого useQuery)

        }

    })


    // делаем отдельный запрос для получения массива комментариев в секции sectionNewArrivals,чтобы потом при изменении рейтинга товара переобновлять этот массив комментариев
    const { data: dataCommentsArrivals, refetch: refetchCommentsArrivals } = useQuery({
        queryKey: ['commentsForProduct'],
        queryFn: async () => {

            const response = await axios.get<ICommentResponse>(`${API_URL}/getCommentsForProduct`); // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productNameFor со значением name у товара на этой странице,конкретно указываем этот параметр в объекте в params у этой функции запроса,а не через знак вопроса просто в url,иначе,если в названии товара есть знаки амперсанта(&),то не будут найдены эти комментарии по такому названию,так как эти знаки амперсанта не правильно конкатенируются если их указать просто в url через знак вопроса 

            return response.data; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет массив объектов комментариев) и тд

        }

    })

    // указываем в этой функции запроса на сервер для получения массива товаров корзины такой же queryKey как и на странице Cart.tsx,чтобы эти данные кешировались и можно было переобновить их на этой странице,чтобы они переобновились сразу же и для страницы Cart.tsx
    const { data: dataProductsCart, refetch: refetchProductsCart } = useQuery({
        queryKey: ['getAllProductsCart'],
        queryFn: async () => {

            const response = await axios.get<IProductsCartResponse>(`http://localhost:5000/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля allProductsCart и productsCart

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
        onSuccess() {
            
            setPage(1); // изменяем состояние страницы пагинации комментариев на первую,чтобы после добавления нового комментария текущая страница пагинации комментариев становилась на первую

            refetchComments(); // указываем здесь отдельно повторный запрос на получение массива комментариев,так как если текущая страница пагинации и так 1,то повторный запрос автоматически идти не будет,который указали в useEffect,так как будет идти повторный запрос на сервер только после изменения page(состояние текущей страницы пагинации),а по дефолту page и так равен 1,поэтому page по факту изменен не будет и повторный запрос не сделается
        }

    })


    const { mutate: mutateProductRating } = useMutation({
        mutationKey: ['updateRatingProduct'],
        mutationFn: async (product: IProduct) => {

            // делаем put запрос на сервер для обновления данных на сервере,указываем тип данных,которые нужно добавить(обновить) на сервер(в данном случае IProduct),но здесь не обязательно указывать тип
            await axios.put<IProduct>(`${API_URL}/updateProductRating`, product);

        },

        // при успешной мутации(изменения) рейтинга,переобновляем данные товара,данные массива товаров в секции sectionNewArrivals и данные массива комментариев для sectionNewArrivals
        onSuccess() {

            refetch();

            refetchProductArrivals();

            refetchCommentsArrivals();

        }

    })


    // описываем запрос на сервер для обновления рейтинга товаров корзины,чтобы когда обновлялись комментарии и рейтинг обычного товара каталога,то обновлялся и рейтинг этого же товара в корзине у всех пользователей,у которых он есть,если так не сделать,то рейтинг товара корзины не будет обновляться при обновлении комментариев и рейтинга обычного товара каталога
    const { mutate: mutateProductRatingCart } = useMutation({
        mutationKey: ['updateRatingProductCart'],
        mutationFn: async (product: IProduct) => {

            // делаем put запрос на сервер для обновления данных на сервере,указываем тип данных,которые нужно добавить(обновить) на сервер(в данном случае IProduct),но здесь не обязательно указывать тип
            await axios.put<IProduct>(`${API_URL}/updateProductRatingCart`, product);

        },

        // при успешной мутации(изменения) рейтинга,переобновляем массив товаров корзины
        onSuccess() {

            refetchProductsCart();

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

            setErrorForm('Review must be 10 - 150 characters');

        }else if (textAreaValue.trim().length > 300) {

            setErrorForm('Review must be 10 - 300 characters');

        } else if (activeStarsForm === 0) {

            // если состояние рейтинга в форме равно 0,то есть пользователь не указал рейтинг,то показываем ошибку
            setErrorForm('Enter rating');

        } else {

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

            // помещаем в переменную showTime значение времени,когда создаем комментарий, date.getDate() - показывает текущее число календаря, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString(), getFullYear() - показывает текущий год,потом эту переменную showTime будем сохранять в объект для создания комментария на сервере и потом показывать дату создания комментария уже на клиенте(в данном случае на этой странице у комментария),вынесли подсчет месяца в переменную monthDate и тут ее указываем,также и подсчет текущего числа месяца в переменную dayDate и тут ее указываем
            const showTime = dayDate + '.' + monthDate + '.' + date.getFullYear();


            mutate({ name: user.userName, text: textAreaValue, rating: activeStarsForm, productNameFor: data?.data.name, createdTime: showTime } as IComment); // вызываем функцию post запроса на сервер,создавая комментарий,разворачивая в объект нужные поля для комментария и давая этому объекту тип as IComment(вручную не указываем id,чтобы он автоматически создавался на сервере), указываем поле productNameFor со значением как у name товара на этой странице,чтобы в базе данных связать этот товар с комментарием

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

    // при изменении массива комментариев и данных товара(data?.data) на этой странице,переобновляем массив комментариев для этого товара и массив товаров для секции sectionNewArrivals,чтобы при обновлении рейтинга товара,шел повторный запрос для обновления массива товаров для секции sectionNewArrivals
    useEffect(() => {

        refetchProductArrivals();

    }, [data?.data, dataComments?.allCommentsForName])

    useEffect(() => {

        refetch();

    }, [data?.data])


    // при запуске(рендеринге) этого компонента(при загрузке этой страницы),а также при изменении массива комментариев,будем обновлять рейтинг товара
    useEffect(() => {

        const commentsRating = dataComments?.allCommentsForName.reduce((prev, curr) => prev + curr.rating, 0); // проходимся по массиву объектов комментариев для товара на этой странице и на каждой итерации увеличиваем переменную prev(это число,и мы указали,что в начале оно равно 0 и оно будет увеличиваться на каждой итерации массива объектов,запоминая старое состояние числа и увеличивая его на новое значение) на curr(текущий итерируемый объект).rating ,это чтобы посчитать общую сумму всего рейтинга от каждого комментария и потом вывести среднее значение

        // если commentsRating true(эта переменная есть и равна чему-то) и dataComments?.data.length true(этот массив отфильтрованных комментариев для товара на этой странице есть),то считаем средний рейтинг всех комментариев и записываем его в переменную,а потом делаем запрос на сервер для обновления рейтинга у объекта товара в базе данных
        if (commentsRating && dataComments?.allCommentsForName.length && !isFetching) {

            const commentsRatingMiddle = commentsRating / dataComments?.allCommentsForName.length; // считаем средний рейтинг всех комментариев,делим commentsRating(общая сумма рейтинга от каждого комментария) на dataComments?.data.length(длину массива комментариев)

            mutateProductRating({ ...data?.data, rating: commentsRatingMiddle } as IProduct);  // делаем запрос на изменение рейтинга у товара,разворачиваем все поля товара текущей страницы(data?.data) и поле rating изменяем на commentsRatingMiddle,указываем тип этому объекту как тип на основе нашего интерфейса IProduct(в данном случае делаем это,так как выдает ошибку,что id может быть undefined)

            mutateProductRatingCart({ ...data?.data, rating: commentsRatingMiddle } as IProduct); // делаем запрос на обновление рейтинга товара корзины,также как и с рейтингом обычного товара каталога выше в коде

        }

        refetchComments();

    }, [dataComments?.allCommentsForName])


    // при изменении pathname(url страницы),делаем запрос на обновление данных о товаре(иначе не меняются данные) и изменяем таб на Desc(описание товара),если вдруг был включен другой таб,то при изменении url страницы будет включен опять дефолтный таб,также изменяем значение количества товара,если было выбрано уже какое-то,чтобы поставить первоначальное, и убираем форму добавления комментария,если она была открыта,и изменяем значение состоянию activeStarsForm на 0,то есть убираем звезды в форме для коментария,если они были выбраны
    useEffect(() => {

        refetch();

        setActiveStarsForm(0);

        setActiveForm(false);

        setTab('Desc');

        setTextAreaValue('');

        setPage(1);

        refetchComments(); // также переобновляем массив комментариев

    }, [pathname])



    // при обновлении страницы переобновляем(делаем повторный запрос на сервер) массив комментариев
    useEffect(() => {

        refetchComments();

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

    if (isLoading) {
        return (
            // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
            <main className="main">
                <div className="container">
                    <div className="innerForLoader">
                        <div className="loader"></div>
                    </div>
                </div>
            </main>

        )
    }

    return (
        <main className="main">
            {/* скопировали id и тд из файла sectionNewArrivals,так как здесь такая же анимация и это страница товара,поэтому здесь не будет такой секции как в sectionNewArrivals,поэтому id будут нормально работать,это просто,чтобы не писать больше дополнительного,не используем здесь уже анимацию появления,так как отслеживаем загрузку запроса на сервер для получения комментариев товара  */}
            <section className="sectionProductItemPage__active sectionProductItemPage" id="sectionProductItemPage">
                <div className="container">
                    <div className="sectionProductItemPage__inner">
                        <div className="sectionProductItemPage__top sectionCatalog__topBlock">
                            <p className="sectionCatalog__topBlock-title">Home</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-title">{data?.data.category}</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-subtitle">{data?.data.name}</p>
                        </div>

                        {/* вынесли блок с информацией о товара и слайдером в наш компонент ProductItemPageItemBlock,так как там много кода,передаем туда как пропс(параметр) product со значением data?.data(объект товара),также передаем поле pathname(url страницы),чтобы потом при его изменении изменять значение количества товара,так как оно находится в этом компоненте ProductItemPageItemBlock,указываем именно таким образом pathname={pathname},иначе выдает ошибку типов,передаем функцию refetch для переобновления данных товара(повторный запрос на сервер для переобновления данных товара) и указываем ему название как refetchProduct(просто название этого пропса(параметра)) */}
                        <ProductItemPageItemBlock product={data?.data} pathname={pathname} comments={dataComments?.allCommentsForName} refetchProduct={refetch}/>

                        <div className="sectionProductItemPage__descBlock">
                            <div className="sectionProductItemPage__descBlock-tabs">
                                <button className={tab === 'Desc' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Desc')}>Description</button>
                                <button className={tab === 'Reviews' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Reviews')}>Reviews ({dataComments?.allCommentsForName.length})</button>
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

                                            {!isFetching && dataComments?.allCommentsForName.length ?
                                                <>

                                                    <div className="reviews__leftBlock-comments">
                                                        {dataComments.comments.map(comment =>

                                                            <ProductItemPageReviewItem key={comment._id} user={user} comment={comment} refetchComments={refetchComments}/>

                                                        )}
                                                    </div>


                                                    {/* если dataComments.allCommentsForName.length больше 3,то есть комментариев для этого товара больше 3,то показывать пагинацию,в другом случае пустая строка,то есть не показывать,делаем эту проверку,так как указываем минимальную высоту для блока комментариев,чтобы пагинация не прыгала,а была на одном месте,даже если комментарий 1,и если всего комментариев 3 и меньше,то вообще пагинация не нужна */}
                                                    {dataComments.allCommentsForName.length > 3 ?

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
                                                        :
                                                        ''

                                                    }

                                                </>
                                                : isFetching ?
                                                    <div className="innerForLoader">
                                                        <div className="loader"></div>
                                                    </div>
                                                    :
                                                    <h4 className="reviews__leftBlock-text">No reviews yet.</h4>
                                            }

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

            <SectionNewArrivals className="sectionNewArrivalsProductPage" /> {/* передаем параметр className этой секции со значением класса sectionNewArrivalsProductPage,чтобы для этой секции на этой странице были другие отступы(margin и padding) и анимация */}


        </main>
    )

}

export default ProductItemPage;