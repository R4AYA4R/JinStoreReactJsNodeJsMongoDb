import { ChangeEvent, useEffect, useState } from "react";
import { IComment, IProductCart } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../http/http";

interface IProductItemCart {
    productCart: IProductCart,
    comments: IComment[] | undefined,
    refetchProductsCart: () => void // указываем полю refetchMealsCart что это стрелочная функция и что она возвращает тип данных void
}

const ProductItemCart = ({ productCart, comments, refetchProductsCart }: IProductItemCart) => {

    const { updateProductsCart } = useTypedSelector(state => state.cartSlice); // указываем наш слайс(редьюсер) под названием cartSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setUpdateProductsCart } = useActions(); // берем actions для изменения состояния слайса(редьюсера) cartSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    const [inputAmountValue, setInputAmountValue] = useState(productCart.amount); // делаем дефолтное значение у inputAmountValue как productCart.amount,чтобы сразу показывалось число товаров,которое пользователь выбрал на странице товара

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    const [subtotalPriceProduct, setSubtotalPriceProduct] = useState(0);

    const [commentsForProduct, setCommentsForProduct] = useState<IComment[] | undefined>([]); // состояние для всех комментариев для отдельного товара,указываем ему тип в generic как IComment[] | undefined,указываем или undefined,так как выдает ошибку,когда изменяем это состояние на отфильтрованный массив комментариев по имени товара,что comments может быть undefined

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const { mutate: mutateUpdateProductCart, isPending } = useMutation({
        mutationKey: ['updateProductCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер для изменения данных товара корзины,в данном случае указываем put запрос для изменения данных на сервере,и указываем тип данных,которые нужно изменить на сервере(то есть просто какие данные нужно передать на сервер в теле запроса),в данном случае это тип данных IProductCart),но здесь не обязательно указывать тип,передаем просто объект productCart как тело запроса
            await axios.put<IProductCart>(`${API_URL}/updateProductCart`, productCart);

        },

        // при успешной мутации обновляем весь массив товаров корзины с помощью функции refetchProductsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess() {

            refetchProductsCart();

        }

    })

    const { mutate: mutateDeleteProductCart } = useMutation({
        mutationKey: ['deleteProductCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер для удаление товара корзины,и указываем тип данных,которые вернет сервер(то есть в данном случае будем от сервера возвращать удаленный объект товара в базе данных,то есть в данном случае тип IProductCart),но здесь не обязательно указывать тип
            await axios.delete<IProductCart>(`${API_URL}/deleteProductCart/${productCart._id}`);

        },

        // при успешной мутации обновляем весь массив товаров корзины с помощью функции refetchProductsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess() {

            refetchProductsCart();

        }

    })

    // при рендеринге(запуске) этого компонента и при изменении поля updateProductsCart у состояния слайса(редьюсера) cartSlice делаем запрос на сервер на обновление данных о товаре в корзине
    useEffect(() => {

        // если updateProductsCart true и productCart.amount не равно inputAmountValue(то есть количество товара в корзине(которое мы получили из запроса на сервер на получения всех товаров корзины в компоненте Cart.tsx) не равно значению состояния inputAmountValue,то есть пользователь изменил количество товара в корзине),то обновляем данные товара,делаем эту проверку,чтобы не циклился запрос на переобновление массива товаров корзины ,который мы делаем при обновлении данных товара,если эту проверку не сделать,то будут циклиться запросы на сервер и не будет нормально работать сайт, и чтобы если пользователь нажал на кнопку обновить товары в корзине,но не изменил inputAmountValue(количество товара) на новое значение,то не делать запрос на обновление товара корзины,чтобы не шли запросы на сервер просто так,а также указываем проверку на !isPending(isPending false),то есть сейчас запрос на обновление товара корзины не грузится,если не сделать эту проверку,то можно будет кучу раз нажимать на кнопку обновления товаров корзины и будет идти куча запросов на обновление товаров корзины,пока еще первый не загрузился,также делаем проверку на inputAmountValue не равно 0,чтобы оно не обновлялось,если указали в инпуте количества товара 0
        if (updateProductsCart && productCart.amount !== inputAmountValue && !isPending && inputAmountValue !== 0) {

            mutateUpdateProductCart({ ...productCart, amount: inputAmountValue, totalPrice: subtotalPriceProduct }); // делаем запрос на обновление данных товара корзины,разворачиваем весь объект productCart,то есть вместо productCart будут подставлены все поля из объекта productCart,в поля amount и totalPrice указываем значения состояний количества товара (inputAmountValue) и цены товара(subtotalPriceProduct) на этой странице

            setUpdateProductsCart(false); // изменяем поле updateProductsCart у состояния слайса(редьюсера) cartSlice на false,чтобы указать,что данные товара обновились и потом можно было опять нажимать на кнопку обновления всех товаров корзины

        }

    }, [updateProductsCart])


    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        setValueDiscount(((productCart.price - productCart.priceDiscount) / productCart.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

    }, [productCart])

    // при рендеринге(запуске) этого компонента и при изменении comments(массива всех комментариев) будет отработан код в этом useEffect,обязательно указываем comments в массиве зависимостей этого useEffect,иначе комментарии могут не успеть загрузиться и в состоянии commentForProduct будет пустой массив комментариев 
    useEffect(() => {

        setCommentsForProduct(comments?.filter(c => c.productNameFor === productCart.name)); // изменяем состояние commentsForProduct на отфильтрованный массив всех комментариев comments(пропс(параметр) этого компонента) по имени товара(product.name),то есть оставляем в массиве все объекты комментариев,у которых поле productNameFor равно product.name(объект товара,который передали пропсом(параметром) в этот компонент)

    }, [comments])

    useEffect(() => {

        // если productCart.priceDiscount true,то есть есть цена со скидкой у товара,то изменяем subtotalPriceProduct на inputAmountValue умноженное на productCart.priceDiscount(цену со скидкой),в другом случае изменяем subtotalPriceProduct на inputAmountValue умноженное на productCart.price(обычную цену товара)
        if (productCart.priceDiscount) {

            setSubtotalPriceProduct(inputAmountValue * productCart.priceDiscount); // умножаем inputAmountValue(выбранное количество товаров) на productCart.price(цену товара)

        } else {

            setSubtotalPriceProduct(inputAmountValue * productCart.price); // умножаем inputAmountValue(выбранное количество товаров) на productCart.price(цену товара)

        }

        setUpdateProductsCart(false); // обязательно изменяем поле updateProductsCart у состояния слайса(редьюсера) cartSlice на false при изменении inputAmountValue,чтобы срабатывала нормально проверка на updateProductsCart true,при изменении этого состояния updateProductsCart,иначе,если без изменения количества товара просто тыкать на кнопку обновления товаров корзины,то updateProductsCart будет изменено на true,но запрос не будет идти на обновление количества товара корзины,так как текущее значение инпута количества товара будет такое же,как уже есть у этого товара в базе данных,и потом,когда все-таки пользователь изменит инпут количества товара,то запрос на обновление количества товара корзины тоже не будет идти,так как уже не будет правильно срабатывать эта проверка на updateProductsCart true,поэтому при каждом изменении inputAmountValue изменяем updateProductsCart на false,чтобы можно было нажимать на кнопку обновления товаров корзины и шел запрос на обновление товара корзины и уже будет не важно,нажимал ли до этого пользователь эту кнопку,так как ему придется изменить значение инпута количества товара и соответсвенно состояние  updateProductsCart изменится на false и это все будет работать правильно


    }, [inputAmountValue])

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


    return (
        <>
            <div className="sectionCart__table-item">
                <div className="sectionCart__item-leftBlock">
                    <div className="sectionProductItemPage__itemBlock-imgBlock">


                        {/* если productCart.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                        {productCart.priceDiscount ?

                            <>
                                <div className="sectionNewArrivals__item-saleBlock sectionCart__item-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                                {/* если valueDiscount больше 30,то есть скидка товара больше 30 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                                {valueDiscount > 30 &&
                                    <div className="sectionNewArrivals__item-saleBlockHot sectionCart__item-saleBlockHot">HOT</div>
                                }

                            </>
                            : ''
                        }


                        {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта productCart(пропс(параметр) этого компонента),потом когда сделаем раздачу статики на бэкэнде,то будем указывать путь до папки на бэкэнде, в onClick указываем наш router() (то есть хук useNavigate) и в нем указываем url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,то есть на страницу товара,указываем usualProductId у productCart,так как это id обычного товара каталога,чтобы перейти на его страницу,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и значение поля mainImage у productCart(объекта товара) */}
                        <img src={`http://localhost:5000/${productCart.mainImage}`} alt="" className="sectionCart__item-img" onClick={() => router(`/catalog/${productCart.usualProductId}`)} />
                    </div>
                    <div className="sectionCart__item-leftBlockInfo">
                        <p className="sectionCart__item-leftBlockInfoName" onClick={() => router(`/catalog/${productCart.usualProductId}`)}>{productCart.name}</p>
                        <div className="sectionNewArrivals__item-starsBlock sectionCart__item-starsBlock">
                            <div className="sectionNewArrivals__item-stars">
                                {/* если productCart.rating равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                                <img src={productCart.rating === 0 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector.png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={productCart.rating >= 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={productCart.rating >= 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={productCart.rating >= 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={productCart.rating >= 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            </div>
                            <p className="starsBlock__text">({commentsForProduct?.length})</p>
                        </div>
                    </div>
                </div>

                {/* если productCart.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
                {productCart.priceDiscount ?

                    <div className="sectionNewArrivals__item-priceBlock">
                        <p className="item__priceBlock-priceSale sectionCart__item-priceSale">${productCart.priceDiscount}</p>
                        <p className="item__priceBlock-priceUsual">${productCart.price}</p>
                    </div>
                    :
                    <div className="sectionNewArrivals__item-priceBlock">
                        <p className="item__priceBlock-priceUsualDefaultCart">${productCart.price}</p>
                    </div>
                }
                {/* <div className="sectionNewArrivals__item-priceBlock">
                <p className="item__priceBlock-priceSale sectionCart__item-priceSale">$8.00</p>
                <p className="item__priceBlock-priceUsual">$10.00</p>
            </div> */}

                <div className="sectionProductItemPage__infoBlock-inputBlock sectionCart__item-inputBlock">
                    <div className="infoBlock__inputBlock-leftInputBlock">
                        <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                            <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                        </button>
                        <input type="number" className="infoBlock__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                        <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                            <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                        </button>
                    </div>
                </div>

                {/* указываем цену с помощью toFixed(2),чтобы было 2 цифры после запятой,иначе,при изменении количества товара,может быть число с большим количеством цифр после запятой,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически  */}
                <p className="sectionCart__item-totalPrice">${subtotalPriceProduct.toFixed(2)}</p>

                {/* в onClick этой кнопке указываем нашу функцию для удаления товара из корзины(то есть в данном случае удаляем его из базы данных у сущности(модели) корзины) */}
                <button className="sectionCart__item-removeBtn" onClick={() => mutateDeleteProductCart(productCart)}>
                    <img src="/images/sectionCart/X.png" alt="" className="sectionCart__item-removeBtnImg" />
                </button>
            </div>

            <div className="sectionCart__table-item sectionCart__table-itemMobile">
                <div className="sectionCart__item-leftBlock sectionCart__itemMobile-topBlock">
                    <div className="sectionCart__itemMobile-imgAndInfoBlock">
                        <div className="sectionProductItemPage__itemBlock-imgBlock">


                            {/* если productCart.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                            {productCart.priceDiscount ?

                                <>
                                    <div className="sectionNewArrivals__item-saleBlock sectionCart__item-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                                    {/* если valueDiscount больше 30,то есть скидка товара больше 30 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                                    {valueDiscount > 30 &&
                                        <div className="sectionNewArrivals__item-saleBlockHot sectionCart__item-saleBlockHot">HOT</div>
                                    }

                                </>
                                : ''
                            }


                            {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта productCart(пропс(параметр) этого компонента),потом когда сделаем раздачу статики на бэкэнде,то будем указывать путь до папки на бэкэнде, в onClick указываем наш router() (то есть хук useNavigate) и в нем указываем url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,то есть на страницу товара,указываем usualProductId у productCart,так как это id обычного товара каталога,чтобы перейти на его страницу,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и значение поля mainImage у productCart(объекта товара) */}
                            <img src={`http://localhost:5000/${productCart.mainImage}`} alt="" className="sectionCart__item-img" onClick={() => router(`/catalog/${productCart.usualProductId}`)} />
                        </div>
                        <div className="sectionCart__item-leftBlockInfo">
                            <p className="sectionCart__item-leftBlockInfoName" onClick={() => router(`/catalog/${productCart.usualProductId}`)}>{productCart.name}</p>
                            <div className="sectionNewArrivals__item-starsBlock sectionCart__item-starsBlock">
                                <div className="sectionNewArrivals__item-stars">
                                    {/* если productCart.rating равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                                    <img src={productCart.rating === 0 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector.png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={productCart.rating >= 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={productCart.rating >= 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={productCart.rating >= 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={productCart.rating >= 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                </div>
                                <p className="starsBlock__text">({commentsForProduct?.length})</p>
                            </div>
                        </div>

                    </div>

                    {/* в onClick этой кнопке указываем нашу функцию для удаления товара из корзины(то есть в данном случае удаляем его из базы данных у сущности(модели) корзины) */}
                    <button className="sectionCart__item-removeBtn" onClick={() => mutateDeleteProductCart(productCart)}>
                        <img src="/images/sectionCart/X.png" alt="" className="sectionCart__item-removeBtnImg" />
                    </button>

                </div>

                <div className="sectionCart__itemMobile-bottomBlock">

                    {/* если productCart.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
                    {productCart.priceDiscount ?

                        <div className="sectionCart__itemMobile-priceBlockItem">
                            <p className="sectionCart__itemMobile-nameBlock">Price</p>
                            <div className="sectionNewArrivals__item-priceBlock">
                                <p className="item__priceBlock-priceSale sectionCart__item-priceSale">${productCart.priceDiscount}</p>
                                <p className="item__priceBlock-priceUsual">${productCart.price}</p>
                            </div>
                        </div>
                        :
                        <div className="sectionCart__itemMobile-priceBlockItem">
                            <p className="sectionCart__itemMobile-nameBlock">Price</p>
                            <div className="sectionNewArrivals__item-priceBlock">
                                <p className="item__priceBlock-priceUsualDefaultCart">${productCart.price}</p>
                            </div>
                        </div>

                    }


                    <div className="sectionCart__itemMobile-priceBlockItem">
                        <p className="sectionCart__itemMobile-nameBlock">Quantity</p>
                        <div className="sectionProductItemPage__infoBlock-inputBlock sectionCart__item-inputBlock">
                            <div className="infoBlock__inputBlock-leftInputBlock">
                                <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                                    <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                                </button>
                                <input type="number" className="infoBlock__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                                <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                                    <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="sectionCart__itemMobile-priceBlockItem">

                        <p className="sectionCart__itemMobile-nameBlock">Subtotal</p>

                        {/* указываем цену с помощью toFixed(2),чтобы было 2 цифры после запятой,иначе,при изменении количества товара,может быть число с большим количеством цифр после запятой,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически  */}
                        <p className="sectionCart__item-totalPrice">${subtotalPriceProduct.toFixed(2)}</p>

                    </div>

                </div>

            </div>

        </>
    )

}

export default ProductItemCart;