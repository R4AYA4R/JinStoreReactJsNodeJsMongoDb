
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"; // импортируем вручну таким образом сам Swiper(для слайдера) и SwiperSlide(для элементов в этом слайдере) из библиотеки swiper/react(перед этим мы установили библиотеку swiper(npm i swiper)),иначе автоматически неправильно импортирует и выдает ошибку

import { Autoplay, Navigation, Thumbs, Zoom } from "swiper/modules"; // импортируем модули для этого слайдера swiper,модули типа навигации(Navigation),пагинации(Pagination) и тд,нужно их импортировать,чтобы подключить и использовать в этом слайдере swiper,импортируем Thumbs для превью картинок слайдера,Autoplay для автоматической прокрутки слайдов

// импортируем стили для самого слайдера и его модулей(типа для навигации этого слайдера,пагинации и тд)
import 'swiper/css';
import 'swiper/css/navigation'; // импортируем стили для модуля навигации(navigation) этого слайдера swiper
import 'swiper/css/thumbs'; // импортируем стили для модуля превью картинок (thumbs) этого слайдера swiper

import 'swiper/css/zoom';
import { ChangeEvent, useEffect, useState } from "react";
import { IComment, IProduct, IProductCart } from "../types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useNavigate } from "react-router-dom";


interface IProductItemPageItemBlock {
    product: IProduct | undefined, // указываем этому полю тип на основе нашего интерфейса IProduct или undefined(указываем это или undefined,так как выдает ошибку,что product может быть undefined)

    pathname: string, // указываем поле для pathname(url страницы),который взяли в родительском компоненте,то есть в компоненте ProductItemPage,указываем ему тип string

    comments: IComment[] | undefined // указываем поле для комментариев этого товара с типом на основе нашего интерфейса IComment,указываем,что это массив [],  или undefined(указываем это или undefined,так как выдает ошибку,что comments может быть undefined)
}

const ProductItemPageItemBlock = ({ product, pathname, comments }: IProductItemPageItemBlock) => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const router = useNavigate();  // useNavigate может перемещатьтся на другую страницу вместо ссылок

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null); // указываем тип в generic для этого состояния thumbsSwiper(превью картинок для слайдера swiper) как any,иначе выдает ошибку,что нельзя назначить тип Swiper состоянию

    const [inputAmountValue, setInputAmountValue] = useState(1);

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    // указываем в этой функции запроса на сервер для получения массива товаров корзины такой же queryKey как и на странице Cart.tsx,чтобы эти данные кешировались и можно было переобновить их на этой странице,чтобы они переобновились сразу же и для страницы Cart.tsx
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'],
        queryFn: async () => {

            const response = await axios.get<IProductCart[]>(`http://localhost:5000/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары(блюда) корзины для конкретного авторизованного пользователя

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет объект товара) и тд

        }

    })


    const { mutate: mutateAddProductCart } = useMutation({
        mutationKey: ['add productCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип
            await axios.post<IProductCart>(`${API_URL}/createProductCart`, productCart);

        },

        // при успешной мутации,то есть в данном случае при успешном добавлении товара в корзину обновляем dataProductsCart(массив объектов товаров корзины),чтобы сразу показывалось изменение в корзине товаров,если так не сделать,то текст Already in Cart(что товар уже в корзине) будет показан только после обновления страницы,а не сразу,так как массив объектов корзины еще не переобновился
        onSuccess(){

            refetchProductsCart();

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


    const isExistsCart = dataProductsCart?.data.some(p => p.name === product?.name); // делаем проверку методом some и результат записываем в переменную isExistsCart,если в dataProductsCart(в массиве объектов товаровкорзины для определенного авторизованного пользователя) есть элемент(объект) name которого равен product name(то есть name этого товара на этой странице),в итоге в isExistsCart будет помещено true или false в зависимости от проверки методом some


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

                mutateAddProductCart({ name: product?.name, category: product?.category, amount: inputAmountValue, mainImage: product?.mainImage, descImages: product?.descImages, price: product?.price, priceDiscount: product?.priceDiscount, priceFilter: product?.priceFilter, rating: product?.rating, totalPrice: product?.totalPrice, totalPriceDiscount: product?.totalPriceDiscount, usualProductId: product?._id, forUser: user.id } as IProductCart); // передаем в mutateAddProductCart объект типа IProductCart только таким образом,разворачивая в объект все необходимые поля(то есть наш product(объект блюда в данном случае),в котором полe name,делаем поле name со значением,как и у этого товара name(product.name) и остальные поля также,кроме поля amount,его мы изменяем и указываем как значения inputAmountValue(инпут с количеством),указываем тип этого объекта как созданный нами тип as IProductCart(в данном случае делаем так,потому что показывает ошибку,что totalPriceProduct может быть undefined),при создании на сервере не указываем конкретное значение id,чтобы он сам автоматически генерировался на сервере и потом можно было удалить этот объект, добавляем поле forUser со значением user.id(то есть со значением id пользователя,чтобы потом показывать товары в корзине для каждого конкретного пользователя,у которого id будет равен полю forUser у этого товара),указываем usualProductId со значением product._id,чтобы потом в корзине можно было перейти на страницу товара в магазине по этому usualProductId,а сам id корзины товара не указываем,чтобы он автоматически правильно генерировался,так как делаем показ товаров по-разному для конкретных пользователей(то есть как и должно быть),иначе ошибка

            }


        } else {

            router('/userPage');  // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

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
                            {/* добавляем блок div с классом swiper-zoom-container (это класс этому слайдеру для зума по дефолту,мы подключили стили для этого zoom),чтобы работал зум картинок*/}
                            <div className="swiper-zoom-container">
                                <img src={`/images/sectionNewArrivals/${product?.mainImage}`} alt="" className="sectionProductItemPage__imgBlock-img" />
                            </div>
                        </SwiperSlide>

                        {/* проходимся по массиву descImages у product,и возвращаем новый массив,на каждой итерации(месте предыдущего элемента) будет подставлен элемент,который мы указали в функции callback у этого map(),в данном случае это будет элемент слайдера <SwiperSlide/>,то есть отображаем картинки товара,в параметрах этой функции callback у map берем image(текущий итерируемый элемент массива,название может быть любое) и index(текущий индекс итерируемого элемента массива),указываем этот index в key,чтобы эти ключи(key) были разные,так как в данном случае у нас есть одинаковые названия у картинок,лучше указывать отдельный какой-нибудь id в key,но в данном случае это подходит,в src у img указываем путь до картинки,указываем в конце этого пути параметр image(текущий итерируемый объект массива) этой функции callback у map,чтобы указать разные названия картинок */}
                        {product?.descImages.map((image, index) =>
                            <SwiperSlide key={index}>
                                <div className="swiper-zoom-container">
                                    <img src={`/images/sectionNewArrivals/${image}`} alt="" className="sectionProductItemPage__imgBlock-img" />
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
                                <img src={`/images/sectionNewArrivals/${product?.mainImage}`} alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSliderPreview" />
                            </SwiperSlide>

                            {/* проходимся по массиву descImages у product,и возвращаем новый массив,на каждой итерации(месте предыдущего элемента) будет подставлен элемент,который мы указали в функции callback у этого map(),в данном случае это будет элемент слайдера <SwiperSlide/>,то есть отображаем картинки товара,в параметрах этой функции callback у map берем image(текущий итерируемый элемент массива,название может быть любое) и index(текущий индекс итерируемого элемента массива),указываем этот index в key,чтобы эти ключи(key) были разные,так как в данном случае у нас есть одинаковые названия у картинок,лучше указывать отдельный какой-нибудь id в key,но в данном случае это подходит,в src у img указываем путь до картинки,указываем в конце этого пути параметр image(текущий итерируемый объект массива) этой функции callback у map,чтобы указать разные названия картинок */}
                            {product?.descImages.map((image, index) =>
                                <SwiperSlide key={index} className="sectionProductItemPage__sliderBlock__sliderPreview">
                                    <div className="swiper-zoom-container">
                                        <img src={`/images/sectionNewArrivals/${image}`} alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSliderPreview" />
                                    </div>
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

                {/* если product?.priceDiscount true(указываем знак вопроса после product,так как product может быть undefined и выдает ошибку об этом),то есть поле priceDiscount у product(объект товара) есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
                {product?.priceDiscount ?

                    <div className="sectionNewArrivals__item-priceBlock">
                        <p className="item__priceBlock-priceSale">${product?.priceDiscount}</p>
                        <p className="item__priceBlock-priceUsual">${product?.price}</p>
                    </div>
                    :
                    <div className="sectionNewArrivals__item-priceBlock">
                        <p className="item__priceBlock-priceUsualDefault">${product?.price}</p>
                    </div>
                }

                <div className="sectionProductItemPage__infoBlock-inputBlock">

                    {/* если isExistsCart true(то есть этот товарна этой странице уже находится в корзине) и если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку),то показываем текст,в другом случае если tabChangePrice false(то есть таб с инпутом для изменения цены товара для админа равен false,то есть не показан),то показываем кнопку добавления товара в корзину и инпут с количеством этого товара */}
                    {user.userName && isExistsCart ?

                        <h3 className="textAlreadyInCart">Already in Cart</h3>
                        :
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