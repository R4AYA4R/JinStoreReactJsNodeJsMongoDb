
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"; // импортируем вручну таким образом сам Swiper(для слайдера) и SwiperSlide(для элементов в этом слайдере) из библиотеки swiper/react(перед этим мы установили библиотеку swiper(npm i swiper)),иначе автоматически неправильно импортирует и выдает ошибку

import { Autoplay, Navigation, Thumbs, Zoom } from "swiper/modules"; // импортируем модули для этого слайдера swiper,модули типа навигации(Navigation),пагинации(Pagination) и тд,нужно их импортировать,чтобы подключить и использовать в этом слайдере swiper,импортируем Thumbs для превью картинок слайдера,Autoplay для автоматической прокрутки слайдов

// импортируем стили для самого слайдера и его модулей(типа для навигации этого слайдера,пагинации и тд)
import 'swiper/css';
import 'swiper/css/navigation'; // импортируем стили для модуля навигации(navigation) этого слайдера swiper
import 'swiper/css/thumbs'; // импортируем стили для модуля превью картинок (thumbs) этого слайдера swiper

import 'swiper/css/zoom';
import { ChangeEvent, useEffect, useState } from "react";
import { IComment, IProduct, IProductCart, IProductsCartResponse } from "../types/types";
import { QueryObserverResult, useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import $api, { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useNavigate } from "react-router-dom";


interface IProductItemPageItemBlock {
    product: IProduct | undefined, // указываем этому полю тип на основе нашего интерфейса IProduct или undefined(указываем это или undefined,так как выдает ошибку,что product может быть undefined)

    pathname: string, // указываем поле для pathname(url страницы),который взяли в родительском компоненте,то есть в компоненте ProductItemPage,указываем ему тип string

    comments: IComment[] | undefined, // указываем поле для комментариев этого товара с типом на основе нашего интерфейса IComment,указываем,что это массив [],  или undefined(указываем это или undefined,так как выдает ошибку,что comments может быть undefined)

    refetchProduct: () => Promise<QueryObserverResult<AxiosResponse<IProduct, any>, Error>> // указываем поле для функции переобновления данных товара,указываем,что это стрелочная функция и она возвращает тип Promise,в котором QueryObserverResult,в котором AxiosResponse,в котором тип IProduct(тип для объекта товара), и тип Error(что может прийти еще и ошибка),скопировали этот весь тип в файле ProductItemPage у этой функции refetch у react query(tanstack query),этот полный тип подсветил vs code
}

const ProductItemPageItemBlock = ({ product, pathname, comments, refetchProduct }: IProductItemPageItemBlock) => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const [tabChangePrice, setTabChangePrice] = useState(false);

    const [inputPriceValue, setInputPriceValue] = useState(product?.price); // указываем первоначальное значение этому состоянию inputPriceValue как product.price,чтобы в инпуте изменения цены товара изначально было значение как у product.price(текущее значение цены товара)

    const [inputPriceDiscountValue, setInputPriceDiscountValue] = useState(product?.priceDiscount);

    const [errorAdminChangePrice, setErrorAdminChangePrice] = useState('');

    const router = useNavigate();  // useNavigate может перемещатьтся на другую страницу вместо ссылок

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null); // указываем тип в generic для этого состояния thumbsSwiper(превью картинок для слайдера swiper) как any,иначе выдает ошибку,что нельзя назначить тип Swiper состоянию

    const [inputAmountValue, setInputAmountValue] = useState(1);

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    // указываем в этой функции запроса на сервер для получения массива товаров корзины такой же queryKey как и на странице Cart.tsx,чтобы эти данные кешировались и можно было переобновить их на этой странице,чтобы они переобновились сразу же и для страницы Cart.tsx
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'],
        queryFn: async () => {

            const response = await axios.get<IProductsCartResponse>(`http://localhost:5000/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары(блюда) корзины для конкретного авторизованного пользователя

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля allProductsCart и productsCart

        }

    })


    const { mutate: mutateAddProductCart } = useMutation({
        mutationKey: ['add productCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип
            await axios.post<IProductCart>(`${API_URL}/createProductCart`, productCart);

        },

        // при успешной мутации,то есть в данном случае при успешном добавлении товара в корзину обновляем dataProductsCart(массив объектов товаров корзины),чтобы сразу показывалось изменение в корзине товаров,если так не сделать,то текст Already in Cart(что товар уже в корзине) будет показан только после обновления страницы,а не сразу,так как массив объектов корзины еще не переобновился
        onSuccess() {

            refetchProductsCart();

        }

    })

    // функция мутации(изменения данных) для изменения цены товара(она будет для админа)
    const { mutate: mutateProductPrice } = useMutation({
        mutationKey: ['updateProductPrice'],
        mutationFn: async (product: IProduct) => {

            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IProduct),но здесь не обязательно указывать тип,передаем просто объект product как тело запроса,используем тут наш инстанс axios ($api),чтобы правильно обрабатывался этот запрос для проверки на access токен с помощью нашего authMiddleware на нашем сервере
            await $api.put<IProduct>(`${API_URL}/changeProductPriceCatalog`, product);

        },

        // при успешной мутации(изменения) цены товара,переобновляем данные товара
        onSuccess() {

            refetchProduct();

            setTabChangePrice(false);  // изменяем значение tabChangePrice на false,чтобы убрать инпут для изменения цены товара

        }

    })


    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        // если product(объект товара) true,то есть объект товара есть(делаем эту проверку,так как выдает ошибку,что product может быть undefined)
        if (product) {

            setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

        }


    }, [product])

    // при изменении pathname(то есть когда будет меняться url страницы,то есть когда будем переходить,например,на другую страницу товара,чтобы значение количества товара становилось на 0,то есть на дефолтное значение) изменяем поле inputAmountValue на 0
    useEffect(() => {

        setInputAmountValue(1);

    }, [pathname])


    const isExistsCart = dataProductsCart?.allProductsCart.some(p => p.name === product?.name); // делаем проверку методом some и результат записываем в переменную isExistsCart,если в dataProductsCart(в массиве объектов товаровкорзины для определенного авторизованного пользователя) есть элемент(объект) name которого равен product name(то есть name этого товара на этой странице),в итоге в isExistsCart будет помещено true или false в зависимости от проверки методом some


    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputAmountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение инпута > 99,то изменяем состояние инпута цены на 99,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        if (+e.target.value > 99) {

            setInputAmountValue(99);

        } else if (+e.target.value <= 0) {

            // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
            setInputAmountValue(0);

        } else {

            setInputAmountValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusAmountBtn = () => {

        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля или 1 не отнимало - 1
        if (inputAmountValue > 1) {

            setInputAmountValue((prev) => prev - 1);

        } else {

            setInputAmountValue(1);

        }

    }

    const handlerPlusAmountBtn = () => {

        // если значение инпута количества товара меньше 99 и больше или равно 0,то изменяем это значение на + 1,в другом случае указываем ему значение 99,чтобы больше 99 не увеличивалось
        if (inputAmountValue < 99 && inputAmountValue >= 0) {

            setInputAmountValue((prev) => prev + 1);

        } else {

            setInputAmountValue(99);

        }

    }

    const addProductToCart = () => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то помещаем товар в корзину,в другом случае перекидываем пользователя на страницу авторизации
        if (user.userName) {

            // если product true,то есть product есть(делаем эту проверку,так как выдает ошибку,что product может быть undefined)
            if (product) {

                let totalPriceProduct; // создаем переменную для общей суммы товара,указываем ей let,чтобы изменять значение,считаем эту общую цену,чтобы потом в корзине сразу можно было нормально отобразить общую сумму чека корзины

                // если product.priceDiscount true,то есть у товара есть цена со скидкой
                if (product.priceDiscount) {

                    totalPriceProduct = inputAmountValue * product.priceDiscount; // изменяем значение totalPriceProduct на inputAmountValue, умноженное на product.priceDiscount(цену товара со скидкой)

                } else {
                    // в другом случае,если у товара нет скидки,то изменяем значение totalPriceProduct на inputAmountValue, умноженное на product.price(обычную цену товара)
                    totalPriceProduct = inputAmountValue * product.price;

                }

                mutateAddProductCart({ name: product?.name, category: product?.category, amount: inputAmountValue, mainImage: product?.mainImage, descImages: product?.descImages, price: product?.price, priceDiscount: product?.priceDiscount, priceFilter: product?.priceFilter, rating: product?.rating, totalPrice: totalPriceProduct, totalPriceDiscount: product?.totalPriceDiscount, usualProductId: product?._id, forUser: user.id } as IProductCart); // передаем в mutateAddProductCart объект типа IProductCart только таким образом,разворачивая в объект все необходимые поля(то есть наш product(объект блюда в данном случае),в котором полe name,делаем поле name со значением,как и у этого товара name(product.name) и остальные поля также,кроме поля amount и totalPriceProduct,их мы изменяем и указываем как значения inputAmountValue(инпут с количеством) и totalPrice со значением totalPriceProduct(эту переменную мы посчитали выше в коде),указываем тип этого объекта как созданный нами тип as IProductCart(в данном случае делаем так,потому что показывает ошибку,что totalPriceProduct может быть undefined),при создании на сервере не указываем конкретное значение id,чтобы он сам автоматически генерировался на сервере и потом можно было удалить этот объект, добавляем поле forUser со значением user.id(то есть со значением id пользователя,чтобы потом показывать товары в корзине для каждого конкретного пользователя,у которого id будет равен полю forUser у этого товара),указываем usualProductId со значением product._id,чтобы потом в корзине можно было перейти на страницу товара в магазине по этому usualProductId,а сам id корзины товара не указываем,чтобы он автоматически правильно генерировался,так как делаем показ товаров по-разному для конкретных пользователей(то есть как и должно быть),иначе ошибка

            }


        } else {

            router('/userPage');  // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

        }

    }

    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputPriceValue = (e: ChangeEvent<HTMLInputElement>) => {

        // здесь нужно убирать ошибку формы

        // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
        if (+e.target.value <= 0) {

            setInputPriceValue(0);

        } else {

            setInputPriceValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusPriceBtn = () => {

        // здесь нужно еще убирать ошибку формы

        // если значение инпута количества товара больше 1 и если inputPriceValue true(делаем эту проверку,так как показывает ошибку,что это значение может быть undefined),то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля или 1 не отнимало - 1
        if (inputPriceValue && inputPriceValue > 1) {

            setInputPriceValue((prev) => prev && prev - 1); // если prev true(prev &&),то указываем значение состоянию inputPriceValue prev - 1, делаем проверку если prev true,иначе показывает ошибку,что prev(текущее значение inputPriceValue) может быть undefined

        } else {

            setInputPriceValue(1);

        }

    }

    const handlerPlusPriceBtn = () => {

        // здесь нужно убирать ошибку формы

        // изменяем текущее значение инпута цены на + 1
        setInputPriceValue((prev) => prev !== undefined ? prev + 1 : 0);  // если prev !== undefined (то есть текущее значение inputPriceValue не равно undefined),то указываем значение состоянию inputPriceValue prev + 1,в другом случае указываем значение inputPriceValue как 0,делаем эту проверку,иначе показывает ошибку,что prev(текущее значение inputPriceValue) может быть undefined,здесь не работает проверка типа prev &&,так как она проверяет еще и на значение 0,и если prev будет равно 0,то значение увеличиваться не будет



    }


    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputPriceDiscountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // здесь нужно убирать ошибку формы

        // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
        if (+e.target.value <= 0) {

            setInputPriceDiscountValue(0);

        } else {

            setInputPriceDiscountValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusAmountBtnDiscount = () => {

        // здесь нужно еще убирать ошибку формы

        // если значение инпута количества товара больше 1 и если inputPriceDiscountValue true(делаем эту проверку,так как показывает ошибку,что это значение может быть undefined),то изменяем это значение на - 1,в другом случае указываем ему значение 0,чтобы после нуля не отнимало - 1
        if (inputPriceDiscountValue && inputPriceDiscountValue > 1) {

            setInputPriceDiscountValue((prev) => prev && prev - 1); // если prev true(prev &&),то указываем значение состоянию inputPriceDiscountValue prev - 1, делаем проверку если prev true,иначе показывает ошибку,что prev(текущее значение inputPriceDiscountValue) может быть undefined

        } else {

            setInputPriceDiscountValue(0);

        }

    }

    const handlerPlusAmountBtnDiscount = () => {

        // здесь нужно убирать ошибку формы


        // изменяем текущее значение инпута цены на + 1
        setInputPriceDiscountValue((prev) => prev !== undefined ? prev + 1 : 0); // если prev !== undefined (то есть текущее значение inputPriceDiscountValue не равно undefined),то указываем значение состоянию inputPriceDiscountValue prev + 1,в другом случае указываем значение inputPriceDiscountValue как 0,делаем эту проверку,иначе показывает ошибку,что prev(текущее значение inputPriceDiscountValue) может быть undefined,здесь не работает проверка типа prev &&,так как она проверяет еще и на значение 0,и если prev будет равно 0,то значение увеличиваться не будет


    }

    const saveNewPriceProduct = () => {

        if (inputPriceDiscountValue && inputPriceValue && inputPriceDiscountValue >= inputPriceValue) {
            // если inputPriceDiscountValue && inputPriceValue true(делаем эту проверку,так как показывает,что inputPriceDiscountValue и inputPriceValue может быть undefined) и если inputPriceDiscountValue(значение инпута новой цены со скидкой для товара) >= inputPriceValue(значение инпута новой цены товара),то показываем ошибку

            return setErrorAdminChangePrice('New product price must be more than new product discount price'); // показываем ошибку,возвращаем(используем return),чтобы код ниже не работал,если будет ошибка

        } else if (inputPriceValue !== undefined && inputPriceValue <= 0) {
            // если inputPriceValue !== undefined(делаем эту проверку,так как показывает,что inputPriceValue может быть undefined,проверка на inputPriceValue && (типа если inputPriceValue true) не работает правильно в данном случае,так как эта проверка проверяет на значение 0,и если текущее значение инпута новой цены товара равно 0,то эта проверка вообще не срабатывает) и если inputPriceValue(значение инпута новой цены со скидкой для товара) <= 0 (меньше или равно 0),то показываем ошибку

            return setErrorAdminChangePrice('New product price must be more than 0'); // показываем ошибку,возвращаем(используем return),чтобы код ниже не работал,если будет ошибка

        } else {

            let priceDiscountObj;  // создаем переменную для объекта,указываем ей let,чтобы можно было изменять ей значение потом,делаем эту переменную для объекта,чтобы потом ее разворачивать в объект при запросе на сервер для изменения цены товара

            // если inputPriceDiscountValue !== undefined(делаем эту проверку,иначе выдает ошибку,что inputPriceDiscountValue может быть undefined) и inputPriceDiscountValue больше 0,то есть админ указал новую цену со скидкой для этого товара
            if (inputPriceDiscountValue !== undefined && inputPriceDiscountValue > 0) {

                // изменяем переменную priceDiscountObj на значения полей priceDiscount и totalPriceDiscount, со значением как inputPriceDiscountValue(состояние инпута для цены со скидкой)
                priceDiscountObj = {

                    priceDiscount: inputPriceDiscountValue.toFixed(2), // указываем toFixed(2),чтобы преобразовать это число до 2 чисел после запятой,так как эти инпуты обычной цены и цены со скидкой могу быть дробными,типа с несколькими цифрами после запятой
                    totalPriceDiscount: inputPriceDiscountValue.toFixed(2)

                }

            } else {
                // в другом случае указываем значение переменной priceDiscountObj как объект с полями и значениями,как текущие значения этих полей у объекта товара(то есть они будут такими же)
                priceDiscountObj = {

                    priceDiscount: product?.priceDiscount, // указываем значение полю priceDiscount как product?.priceDiscount(текущее значение цены товара со скидкой)

                    totalPriceDiscount: product?.totalPriceDiscount // указываем значение полю totalPriceDiscount как product?.totalPriceDiscount(текущее значение итоговой цены товара со скидкой)

                }

            }

            mutateProductPrice({ ...product, price: inputPriceValue, totalPrice: inputPriceValue, ...priceDiscountObj } as IProduct); // делаем запрос на изменение цены товара каталога, разворачиваем в объект все поля текущего объекта товара(...product),указываем поле price и totalPrice со значением inputPriceValue(значение инпута новой цены для товара),также разворачиваем объект priceDiscountObj для полей цены товара со скидкой,в зависимости от условия выше в коде,этот объект будет иметь разные значения,и вместо него будут подставлены поля,которые мы указали ему,указываем тип этого всего объекта как IProduct,то есть поля в этом объекте точно будут иметь такие же типы как и в IProduct(в данном случае указываем это,иначе выдает ошибку,что inputPriceValue может быть undefined и его нельзя назначить для поля price)

            setErrorAdminChangePrice('');

        }

    }

    return (

        <div className="sectionProductItemPage__itemBlock">
            <div className="sectionProductItemPage__itemBlock-imgBlock">

                {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                {product?.priceDiscount ?

                    <>
                        <div className="sectionNewArrivals__item-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                        {/* если valueDiscount больше 30,то есть скидка товара больше 30 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                        {valueDiscount > 30 &&
                            <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>
                        }

                    </>
                    : ''
                }

                <div className="sectionProductItemPage__itemBlock-sliderBlock">
                    <Swiper

                        modules={[Navigation, Thumbs, Zoom, Autoplay]} // указываем модули этому слайдеру,чтобы они работали,в данном случае указываем модуль Navigation для навигации,чтобы могли меняться картинки 

                        slidesPerView={1} // количество слайдов для показа в одном элементе слайдера(который сейчас активен у слайдера),можно указывать не только целые числа но и числа с точко(типа 2.5),можно указать еще значение 'auto',тогда будет автоматически формироваться ширина слайда контентом внутри него,или конкретно указанной шириной этому слайдеру в css

                        zoom={true} // подключаем зум картинок,можно указать параметры maxRatio(максимальное увеличение) и minRation(минимальное увеличение),но в данном случае и так подходит на автоматических настройках

                        thumbs={{
                            swiper: thumbsSwiper
                        }}

                        navigation={true} // указываем navigation true,то есть подключаем конкретно навигацию для этого слайдера,чтобы могли меняться картинки(можно указать параметры этой навигации,но в данном случае они не нужны)

                        //автопрокрутка слайдов
                        autoplay={{
                            delay: 2000, // пауза между прокруткой слайда в милисекундах

                            disableOnInteraction: true // отключает автопрокрутку,когда вручную перелестнули или свайпнули слайд
                        }}

                        grabCursor={true} // меняет курсор мыши при свайпе слайда на руку

                    >
                        {/* указываем SwiperSlide(элемент слайдера) и в него помещаем картинку для этого слайдера,указываем картинке для первого слайда в src путь до картинки,в конце этого пути указываем product?.mainImage,то есть название картинки у объекта товара(product) для главной(первой) картинки для слайдера */}
                        <SwiperSlide>
                            {/* добавляем блок div с классом swiper-zoom-container (это класс этому слайдеру для зума по дефолту,мы подключили стили для этого zoom),чтобы работал зум картинок,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и значение поля mainImage у product(объекта товара) */}
                            <div className="swiper-zoom-container">
                                <img src={`http://localhost:5000/${product?.mainImage}`} alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSlider" />
                            </div>
                        </SwiperSlide>

                        {/* проходимся по массиву descImages у product,и возвращаем новый массив,на каждой итерации(месте предыдущего элемента) будет подставлен элемент,который мы указали в функции callback у этого map(),в данном случае это будет элемент слайдера <SwiperSlide/>,то есть отображаем картинки товара,в параметрах этой функции callback у map берем image(текущий итерируемый элемент массива,название может быть любое) и index(текущий индекс итерируемого элемента массива),указываем этот index в key,чтобы эти ключи(key) были разные,так как в данном случае у нас есть одинаковые названия у картинок,лучше указывать отдельный какой-нибудь id в key,но в данном случае это подходит,в src у img указываем путь до картинки,указываем в конце этого пути параметр image(текущий итерируемый объект массива) этой функции callback у map,чтобы указать разные названия картинок */}
                        {product?.descImages.map((image, index) =>
                            <SwiperSlide key={index}>
                                <div className="swiper-zoom-container">
                                    {/* в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и image(текущий итерируемый элемент массива descImages,то есть название каждой картинки описания) */}
                                    <img src={`http://localhost:5000/${image}`} alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSlider" />
                                </div>
                            </SwiperSlide>
                        )}

                    </Swiper>

                    <div className="sliderBlock__previewSliderBlock">
                        <Swiper

                            className="sectionProductItemPage__sliderBlock-previewSlider"

                            slidesPerView={3} // указываем количество слайдов для показа в одном элементе слайдера(который сейчас активен у слайдера),в данном случае указываем 3 картинки(у нас их и есть в главном слайдере 3),для активного слайда

                            modules={[Thumbs]}

                            watchSlidesProgress={true} // указываем это,чтобы был добавлен дополнительный класс видимости текущего активного слайда

                            onSwiper={setThumbsSwiper}

                            slideToClickedSlide={true} // перемещается к слайду,на который кликнули

                            spaceBetween={10} // отступ в пикселях между слайдами


                        >

                            {/* указываем SwiperSlide(элемент слайдера) и в него помещаем картинку для этого слайдера,указываем картинке для первого слайда в src путь до картинки,в конце этого пути указываем product?.mainImage,то есть название картинки у объекта товара(product) для главной(первой) картинки для слайдера */}
                            <SwiperSlide className="sectionProductItemPage__sliderBlock__sliderPreview">
                                {/* здесь уже не используем zoom контейнер(div элемент с классом zoom контейнера для этого слайдера),так как здесь уже не нужен зум и это просто превью картинок */}
                                {/* в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и mainImage(название главной картинки товара) у product(объект товара) */}
                                <img src={`http://localhost:5000/${product?.mainImage}`} alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSliderPreview" />
                            </SwiperSlide>

                            {/* проходимся по массиву descImages у product,и возвращаем новый массив,на каждой итерации(месте предыдущего элемента) будет подставлен элемент,который мы указали в функции callback у этого map(),в данном случае это будет элемент слайдера <SwiperSlide/>,то есть отображаем картинки товара,в параметрах этой функции callback у map берем image(текущий итерируемый элемент массива,название может быть любое) и index(текущий индекс итерируемого элемента массива),указываем этот index в key,чтобы эти ключи(key) были разные,так как в данном случае у нас есть одинаковые названия у картинок,лучше указывать отдельный какой-нибудь id в key,но в данном случае это подходит,в src у img указываем путь до картинки,указываем в конце этого пути параметр image(текущий итерируемый объект массива) этой функции callback у map,чтобы указать разные названия картинок */}
                            {product?.descImages.map((image, index) =>
                                <SwiperSlide key={index} className="sectionProductItemPage__sliderBlock__sliderPreview">
                                    {/* здесь уже не используем zoom контейнер(div элемент с классом zoom контейнера для этого слайдера),так как здесь уже не нужен зум и это просто превью картинок */}
                                    {/* в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и image(текущий итерируемый элемент массива descImages,то есть название каждой картинки описания) */}
                                    <img src={`http://localhost:5000/${image}`} alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSliderPreview" />

                                </SwiperSlide>
                            )}

                        </Swiper>
                    </div>

                </div>


            </div>
            <div className="sectionProductItemPage__itemBlock-infoBlock">
                <h1 className="sectionProductItemPage__infoBlock-title">{product?.name}</h1>
                <div className="sectionNewArrivals__item-starsBlock">
                    <div className="sectionNewArrivals__item-stars">

                        {/* если product true,то есть данные о товаре на текущей странице есть(делаем эту проверку,потому что без нее ошибка,типа product может быть undefined),и в src у элементов img(картинок) указываем условие,какую звезду рейтинга отображать в зависимости от значения рейтинга товара */}
                        {product &&

                            <>
                                {/* если product.rating равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                                <img src={product.rating === 0 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector.png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={product.rating >= 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={product.rating >= 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={product.rating >= 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={product.rating >= 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            </>

                        }

                    </div>
                    <p className="starsBlock__text">({comments?.length})</p>
                </div>
                <p className="sectionProductItemPage__infoBlock-desc">{product?.descText}</p>

                {/* если состояние таба tabChangePrice false,то показываем цену товара и кнопку,чтобы изменить цену товара,если это состояние tabChangePrice будет равно true,то этот блок показываться не будет */}
                {!tabChangePrice &&
                    <>

                        {/* если product?.priceDiscount true(указываем знак вопроса после product,так как product может быть undefined и выдает ошибку об этом),то есть поле priceDiscount у product(объект товара) есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
                        {product?.priceDiscount ?

                            <div className="sectionNewArrivals__item-priceBlock">
                                <p className="item__priceBlock-priceSale">${product?.priceDiscount}</p>
                                <p className="item__priceBlock-priceUsual">${product?.price}</p>

                                {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор),то показываем кнопку админа для изменения цены товара в базе данных */}
                                {user.role === 'ADMIN' &&

                                    <button className="sectionProductItemPage__changePriceBtn" onClick={() => setTabChangePrice(true)}>
                                        <img src="/images/sectionUserPage/Close.png" alt="" className="adminForm__deleteBtn-img" />
                                    </button>

                                }

                            </div>
                            :
                            <div className="sectionNewArrivals__item-priceBlock">
                                <p className="item__priceBlock-priceUsualDefault">${product?.price}</p>

                                {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор),то показываем кнопку админа для изменения цены товара в базе данных */}
                                {user.role === 'ADMIN' &&

                                    <button className="sectionProductItemPage__changePriceBtn" onClick={() => setTabChangePrice(true)}>
                                        <img src="/images/sectionUserPage/Close.png" alt="" className="adminForm__deleteBtn-img" />
                                    </button>

                                }
                            </div>
                        }

                    </>
                }

                {/* если состояние таба tabChangePrice true,то показываем блок с инпутом изменения цены товара,в другом случае он показан не будет */}
                {tabChangePrice &&

                    <div className="sectionUserPage__changePriceBlock">
                        <div className="sectionUserPage__formInfo-item sectionUserPage__adminForm-inputBlockMain">
                            <div className="sectionProductItemPage__infoBlock-inputBlock sectionUserPage__adminForm-inputBlock">
                                <p className="sectionUserPage__formInfo-itemText">Price</p>
                                <div className="infoBlock__inputBlock-leftInputBlock">
                                    {/* указываем этой кнопке тип button(type="button"),чтобы при нажатии на нее не отправлялась эта форма(для создания нового товара),указываем тип submit только одной кнопке формы,по которой она должна отправляться(то есть при нажатии на которую должен идти запрос на сервер для создания нового товара),всем остальным кнопкам формы указываем тип button */}
                                    <button type="button" className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus" onClick={handlerMinusPriceBtn}>
                                        <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                                    </button>

                                    {/* указываем step этому инпуту со значением 0.01,чтобы можно было вводить дробные числа(нужно указывать запятую(,) в этом инпуте,чтобы указать дробное число),и минимальный шаг изменения числа в этом инпуте был 0.01(то есть при изменении стрелочками,минимально изменялось число на 0.01) */}
                                    <input type="number" className="infoBlock__inputBlock-input adminForm__priceInput" value={inputPriceValue} onChange={changeInputPriceValue} step={0.01} />

                                    <button type="button" className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus" onClick={handlerPlusPriceBtn}>
                                        <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                                    </button>
                                </div>
                            </div>

                            <div className="sectionProductItemPage__infoBlock-inputBlock sectionUserPage__adminForm-inputBlock">
                                <p className="sectionUserPage__formInfo-itemText">Price with Discount</p>
                                <div className="infoBlock__inputBlock-leftInputBlock infoBlock__inputBlock-leftInputBlockAdminForm">
                                    <button type="button" className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtnDiscount}>
                                        <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                                    </button>

                                    {/* указываем step этому инпуту со значением 0.01,чтобы можно было вводить дробные числа(нужно указывать запятую(,) в этом инпуте,чтобы указать дробное число),и минимальный шаг изменения числа в этом инпуте был 0.01(то есть при изменении стрелочками,минимально изменялось число на 0.01) */}
                                    <input type="number" className="infoBlock__inputBlock-input adminForm__priceInput" value={inputPriceDiscountValue} onChange={changeInputPriceDiscountValue} step={0.01} />

                                    <button type="button" className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtnDiscount}>
                                        <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* если errorAdminChangePrice true(то есть в состоянии errorAdminChangePrice что-то есть),то показываем текст ошибки */}
                        {errorAdminChangePrice && <p className="formErrorText">{errorAdminChangePrice}</p>}

                        <button className="infoBlock__inputBlock-cartBtn sectionUserPage__saveChangesBtn" onClick={saveNewPriceProduct}>
                            <p className="inputBlock__cartBtn-text">Save Changes</p>
                        </button>

                    </div>
                }

                <div className="sectionProductItemPage__infoBlock-inputBlock">

                    {/* если isExistsCart true(то есть этот товарна этой странице уже находится в корзине) и если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку),то показываем текст,в другом случае если tabChangePrice false(то есть таб с инпутом для изменения цены товара для админа равен false,то есть не показан),то показываем кнопку добавления товара в корзину и инпут с количеством этого товара */}
                    {user.userName && isExistsCart ?

                        <h3 className="textAlreadyInCart">Already in Cart</h3>
                        : !tabChangePrice &&
                        <>
                            <div className="infoBlock__inputBlock-leftInputBlock">
                                <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                                    <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                                </button>
                                <input type="number" className="infoBlock__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                                <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                                    <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                                </button>
                            </div>
                            <button className="infoBlock__inputBlock-cartBtn" onClick={addProductToCart}>
                                <img src="/images/sectionProductItemPage/CartBtnImg.png" alt="" className="inputBlock__cartBtn-img" />
                                <p className="inputBlock__cartBtn-text">Add to cart</p>
                            </button>
                        </>

                    }


                </div>
                <div className="sectionProductItemPage__infoBlock-subInfoBlock">
                    <div className="infoBlock__subInfoBlock-topBlock">
                        <img src="/images/sectionProductItemPage/CardImg.png" alt="" className="subInfoBlock__topBlock-img" />
                        <p className="subInfoBlock__topBlock-text"><span className="subInfoBlock__topBlock-textSpan">Payment.</span> Payment upon receipt of goods, Payment by card in the department, Google Pay,
                            Online card, -5% discount in case of payment</p>
                    </div>
                    <div className="infoBlock__subInfoBlock-topBlock infoBlock__subInfoBlock-bottomBlock">
                        <img src="/images/sectionProductItemPage/SecurityImg.png" alt="" className="subInfoBlock__topBlock-img" />
                        <p className="subInfoBlock__topBlock-text"><span className="subInfoBlock__topBlock-textSpan">Warranty.</span> The Consumer Protection Act does not provide for the return of this product of proper
                            quality.</p>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default ProductItemPageItemBlock;