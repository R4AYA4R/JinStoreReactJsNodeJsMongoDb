import { ChangeEvent, useEffect, useState } from "react";

import ReactSlider from 'react-slider'; // импортируем ReactSlider из 'react-slider' вручную,так как автоматически не импортируется,перед этим устанавливаем(npm install --save-dev @types/react-slider --force( указываем --force,чтобы установить эту библиотеку через силу,так как для версии react 19,выдает ошибку при установке этой библиотеки) типы для react-slider,иначе выдает ошибку,если ошибка сохраняется,что typescript не может найти типы для ReactSlider,после того,как установили для него типы,то надо закрыть запущенный локальный хост для нашего сайта в терминале и заново его запустить с помощью npm start
import ProductItemCatalog from "../components/ProductItemCatalog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct, IResponseCatalog } from "../types/types";

const Catalog = () => {

    const [searchValue, setSearchValue] = useState(''); // состояние для инпута поиска

    const [filterCategories, setFilterCategories] = useState('');

    const [priceFilterMax, setPriceFilterMax] = useState(0); // состояние для максимальной цены товара,которое посчитали на бэкэнде и поместили в состояние priceFilterMax,указываем дефолтное значение 0,иначе не работает,так как выдает ошибки,что для ReactSlider нельзя назначить значение с типом undefined и тд

    const [activeSortBlock, setActiveSortBlock] = useState(false);

    const [sortBlockValue, setSortBlockValue] = useState('');

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер,берем isFetching у useQuery,чтобы отслеживать,загружается ли сейчас запрос на сервер,разница isFetching и isLoading в том,что isFetching всегда будет проверять загрузку запроса на сервер при каждом запросе,а isLoading будет проверять только первый запрос на сервер,в данном случае нужен isFetching,так как идут повторные запросы на сервер
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['getAllProducts'],
        queryFn: async () => {

            // выносим url на получение товаров в отдельную переменную,чтобы ее потом изменять
            let url = `http://localhost:5000/api/getProductsCatalog?name=${searchValue}`;

            // если filterCategories не равно пустой строке(то есть пользователь выбрал категорию),то добавляем к url для получения товаров еще query параметр category и значением как filterCategories, указываем знак амперсанта & для перечисления query параметров в url,вместо этого передаем поле category в params при запросе в коде ниже,так как знак амперсанта(&) и пробелы не правильно обрабатываются строкой,если передавать их в url таким образом,из-за этого это не работает
            // if(filterCategories !== ''){

            //     url += `&category=${filterCategories}`;

            // }

            // если минимальное значение фильтра цены(filterPrice[0]) цены true(то есть это значение есть и в нем есть какое-то значение,делаем эту проверку иначе выдает ошибку,что filterPrice[0] может быть undefined) и (filterPrice[0]) больше 0,то добавляем query параметр minPrice к url со значением этого минимального значения фильтра цены(filterPrice[0])
            if (filterPrice[0] && filterPrice[0] > 0) {

                url += `&minPrice=${filterPrice[0]}`;

            }

            // если data?.maxPriceAllProducts(максимальное значение цены товара,которое мы посчитали на бэкэнде и поместили в поле maxPriceAllProducts) true,то есть поле maxPriceAllProducts есть и в нем есть какое-то значение(делаем эту проверку,так как выдает ошибку,что data?.maxPriceAllProducts может быть undefined,но мы и так будем изменять фильтр цены когда объекты товаров загрузятся,и это уже будет повторный запрос на сервер,поэтому значение data?.maxPriceAllProducts уже будет и поэтому это подходит) и filterPrice[1] (максимальное значение фильтра цены) true(то есть это значение есть и в нем есть какое-то значение,делаем эту проверку иначе выдает ошибку,что filterPrice[1] может быть undefined) и и если filterPrice[1] (максимальное значение фильтра цены) меньше data?.maxPriceAllProducts(максимальное значение цены товара,которое мы посчитали на бэкэнде и поместили в поле maxPriceAllProducts),то добавляем query параметр maxPrice к url со значением этого максимального значения фильтра цены(filterPrice[1])
            if (data?.maxPriceAllProducts && filterPrice[1] && filterPrice[1] < data?.maxPriceAllProducts) {

                url += `&maxPrice=${filterPrice[1]}`;

            }

            // указываем тип данных,который придет от сервера как тип на основе нашего интерфейса IResponseCatalog,у этого объекта будут поля products(объекты товаров из базы данных для отдельной страници пагинации) и allProducts(все объекты товаров из базы данных без лимитов и состояния текущей страницы,то есть без пагинации,чтобы взять потом количество этих всех объектов товаров и использовать для пагинации),вместо url будет подставлено значение,которое есть у нашей переменной url
            const response = await axios.get<IResponseCatalog>(url, {
                params: {

                    category: filterCategories // указываем query параметр category со значением filterCategories(даже если filterCategories пустая строка,то оно также правильно обрабатывается и проверки дополнительные здесь не нужны,мы проверяем на бэкэнде,не равен ли этот query параметр category пустой строке)

                }
            });  // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера)

            console.log(response.data);

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля products и allProducts

        }

    })

    const [filterPrice, setFilterPrice] = useState([0, priceFilterMax]); // массив для значений нашего инпута range(ReactSlider),первым значением указываем значение для первого ползунка у этого инпута,а вторым для второго, ставим изначальное значение для второго ползунка инпута как priceFilterMax(максимальная цена товарв из всех,которую посчитали на бэкэнде),чтобы сразу показывалось,что это максимальное значение цены,не указываем здесь конкретно data?.maxPriceAllProducts,так как тогда выдает ошибки,что для ReactSlider нельзя назначить значение с типом undefined и тд


    // функция при изменении значения инпута поиска,указываем параметр e как тип ChangeEvent у в generic у него указываем HTMLInputElement
    const searchValueHandler = (e: ChangeEvent<HTMLInputElement>) => {

        setSearchValue(e.target.value);


    }

    const sortItemHandlerRating = () => {

        setSortBlockValue('Rating'); // изменяем состояние sortBlockValue на значение Rating

        setActiveSortBlock(false); // изменяем состояние activeSortBlock на значение false,то есть убираем появившийся селект блок

    }

    // при изменении data?.products изменяем значение priceFilterMax на data?.maxPriceAllProducts(максимальное значение цены товара,которое посчитали на бэкэнде)
    useEffect(() => {

        // если data?.maxPriceAllProducts true,то есть data?.maxPriceAllProducts есть и в нем есть какое-то значение,делаем эту проверку,иначе выдает ошибку,что data?.maxPriceAllProducts может быть undefined
        if (data?.maxPriceAllProducts) {

            setPriceFilterMax(data?.maxPriceAllProducts);

        }

        console.log(data?.maxPriceAllProducts)

    }, [data?.products]);

    // при изменении priceFilterMax изменяем значение filterPrice,возвращаем массив,первым элементом указываем предыдущее значение по индексу 0(то есть минимальное значение фильтра цены) и второй элемент указываем со значением как priceFilterMax(делаем эти манипуляции с priceFilterMax,иначе выдает ошибку,что для ReacSlider нельзя указать значение с типом undefined и тд)
    useEffect(() => {

        setFilterPrice((prev) => [prev[0], priceFilterMax]);

        console.log(filterPrice)

    }, [priceFilterMax])

    // указываем в массиве зависимостей этого useEffect data?.products(массив объектов блюд для отдельной страницы пагинации),чтобы делать повторный запрос на получения объектов товаров при изменении data?.products,в данном случае это для пагинации,если не указать data?.products,то пагинация при запуске страницы не будет работать, также делаем повторный запрос на сервер уже с измененным значение searchValue(чтобы поисковое число(число товаров,которое изменяется при поиске) показывалось правильно,когда вводят что-то в поиск)
    useEffect(() => {

        refetch();  // делаем повторный запрос на получение товаров при изменении data?.products, searchValue(значение инпута поиска),filterCategories и других фильтров,а также при изменении состояния текущей страницы пагинации 

    }, [searchValue, filterCategories])


    // при изменении searchValue,то есть когда пользователь что-то вводит в инпут поиска,то изменяем filterCategory на пустую строку и остальные фильтры тоже,соответственно будет сразу идти поиск по всем товарам,а не в конкретной категории или определенных фильтрах,но после поиска можно будет результат товаров по поиску уже отфильтровать по категориям и тд
    useEffect(() => {

        setFilterCategories('');

    }, [searchValue])

    // при изменении состояния filterPrice,то есть когда пользователь начал изменять значение фильтра цены(то есть начал крутить ползунки для изменения фильтра цены),то делаем запрос на сервер на получение объектов товаров уже с новым фильтром цены,отслеживаем это,чтобы делать запрос на сервер только после того,когда закончил грузиться предыдущий запрос на сервер(лучше еще отслеживать когда пользователь отпустил ползунок фильтра цены и только тогда делать запрос,но в данном случае используем React Slider и там не удобно это отслеживать,но и так нормально),если это не отслеживать,то будут лететь кучи запросов на сервер при изменении значения фильтра цены
    useEffect(() => {

        // если isFetching false,то есть запрос на сервер для получения объектов блюд сейчас не грузится(делаем эту проверку,чтобы не было много запросов и долго не грузились данные после того,как пользователь зашел на страницу товара и вернулся в каталог)
        if (!isFetching) {

            refetch();

        }

    }, [filterPrice])

    return (
        <main className="main">
            <section className="sectionCatalog">
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__topBlock">
                            <p className="sectionCatalog__topBlock-title">Home</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-subtitle">Catalog</p>
                        </div>
                        <div className="sectionCatalog__mainBlock">
                            <div className="sectionCatalog__mainBlock-filterBar">
                                <div className="sectionCatalog__filterBar-categories">
                                    <h3 className="filterBar__categories-title">Product Categories</h3>
                                    <label className="filterBar__categories-label" onClick={() => setFilterCategories('Fruits & Vegetables')}>
                                        <input type="radio" name="radio" className="categories__label-input" />
                                        <span className={filterCategories === 'Fruits & Vegetables' ? "categories__label-radioStyle categories__label-radioStyle--active" : "categories__label-radioStyle"}>
                                            <span className={filterCategories === 'Fruits & Vegetables' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Fruits & Vegetables' ? "categories__label-text categories__label-text--active" : "categories__label-text"}>Fruits & Vegetables</p>
                                        <p className="categories__label-amount">(0)</p>
                                    </label>
                                    <label className="filterBar__categories-label" onClick={() => setFilterCategories('Beverages')}>
                                        <input type="radio" name="radio" className="categories__label-input" />
                                        <span className={filterCategories === 'Beverages' ? "categories__label-radioStyle categories__label-radioStyle--active" : "categories__label-radioStyle"}>
                                            <span className={filterCategories === 'Beverages' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Beverages' ? "categories__label-text categories__label-text--active" : "categories__label-text"}>Beverages</p>
                                        <p className="categories__label-amount">(0)</p>
                                    </label>
                                    <label className="filterBar__categories-label" onClick={() => setFilterCategories('Meats & Seafood')}>
                                        <input type="radio" name="radio" className="categories__label-input" />
                                        <span className={filterCategories === 'Meats & Seafood' ? "categories__label-radioStyle categories__label-radioStyle--active" : "categories__label-radioStyle"}>
                                            <span className={filterCategories === 'Meats & Seafood' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Meats & Seafood' ? "categories__label-text categories__label-text--active" : "categories__label-text"}>Meats & Seafood</p>
                                        <p className="categories__label-amount">(0)</p>
                                    </label>
                                    <label className="filterBar__categories-label" onClick={() => setFilterCategories('Breads & Bakery')}>
                                        <input type="radio" name="radio" className="categories__label-input" />
                                        <span className={filterCategories === 'Breads & Bakery' ? "categories__label-radioStyle categories__label-radioStyle--active" : "categories__label-radioStyle"}>
                                            <span className={filterCategories === 'Breads & Bakery' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Breads & Bakery' ? "categories__label-text categories__label-text--active" : "categories__label-text"}>Breads & Bakery</p>
                                        <p className="categories__label-amount">(0)</p>
                                    </label>
                                </div>
                                <div className="filterBar__priceFilterBlock">
                                    <h3 className="filterBar__categories-title priceFilterBlock__title">Price Filter</h3>

                                    <ReactSlider

                                        // указываем классы для этого инпута range и для его кнопок и тд, и в файле index.css их стилизуем 
                                        className="priceFilterBlock__inputRangeSlider"

                                        thumbClassName="inputRangeSlider__thumb"

                                        trackClassName="inputRangeSlider__track"

                                        defaultValue={filterPrice} // поле для дефолтного значения минимального(первый элемент массива) и максимального(второй элемент массива),указываем этому полю значение как наш массив filterPrice(массив чисел для минимального(первый элемент массива) и максимального(второй элемент массива) значения)

                                        max={data?.maxPriceAllProducts} // поле для максимального значения

                                        min={0} // поле для минимального значения

                                        value={filterPrice} // указываем поле value как наше состояние filterPrice(массив из 2 элементов для минимального и максимального значения фильтра цены),указываем это,чтобы при изменении состояния filterPrice, менялось и значение этого инпута range,то есть этого react slider(его ползунки и значения их),в данном случае это для того,чтобы при удалении фильтра цены,менялись значения ползунков этого react slider(инпут range)

                                        // вместо этого сами деструктуризируем дополнительные параметры из props в коде ниже,иначе выдает ошибку в версии react 19,так как библиотека react-slider давно не обновлялась,а сам react обновился
                                        // renderThumb={(props,state) => <div {...props}>{state.valueNow}</div>}

                                        // деструктуризируем поле key и ...restProps из props(параметр у этой функции callback),чтобы потом отдельно передать в div,так как выдает ошибку в версии react 19,если сделать как код выше
                                        renderThumb={(props, state) => {

                                            const { key, ...restProps } = props; // деструктуризируем отдельно поле key из props,и остальные параметры,которые есть у props,разворачиваем в этот объект и указываем им название restProps(...restProps),потом отдельно указываем этому div поле key и остальные параметры у props(restProps),разворачиваем restProps в объект,таким образом передаем их этому div {...restProps}

                                            return (
                                                <div key={key} {...restProps}>{state.valueNow}</div>
                                            );

                                        }}

                                        onChange={(value, index) => setFilterPrice(value)} // при изменении изменяем значение состояния массива filterPrice(в параметрах функция callback принимает value(массив текущих значений этого инпута) и index(индекс кнопки элемента массива,то есть за какую кнопку сейчас дергали))

                                    />

                                    {/* выводим минимальное текущее значение инпута range (наш ReactSlider) по индексу 0 из нашего массива filterPrice (filterPrice[0]) и выводим максимальное текущее значение по индексу 1 из нашего массива filterPrice (filterPrice[1]) */}
                                    <p className="priceFilterBlock__text">Price: ${filterPrice[0]} - ${filterPrice[1].toFixed(0)}</p>

                                </div>
                            </div>
                            <div className="sectionCatalog__mainBlock-productsBlock">
                                <div className="sectionCatalog__productsBlock-searchBlock">
                                    <div className="productsBlock__searchBlock-inputBlock">
                                        <input type="text" className="productsBlock__searchBlock-input" placeholder="Search for products..." value={searchValue} onChange={searchValueHandler} />
                                        <img src="/images/sectionCatalog/SearchImg.png" alt="" className="searchBlock__inputBlock-inputImg" />
                                    </div>
                                    <div className="searchBlock__sortBlock">
                                        <p className="sortBlock__text">Sort By:</p>
                                        <div className="sortBlock__inner">
                                            <div className="sortBlock__topBlock" onClick={() => setActiveSortBlock((prev) => !prev)}>
                                                {/* если sortBlockValue true,то есть если в sortBlockValue есть какое-то значение,то указываем такие классы,в другом случае другие,в данном случае делаем это для анимации появления текста */}
                                                <p className={sortBlockValue ? "sortBlock__topBlock-text sortBlock__topBlock-text--active" : "sortBlock__topBlock-text"}>{sortBlockValue}</p>
                                                <img src="/images/sectionCatalog/ArrowDown.png" alt="" className={activeSortBlock ? "sortBlock__topBlock-img sortBlock__topBlock-img--active" : "sortBlock__topBlock-img"} />
                                            </div>
                                            <div className={activeSortBlock ? "sortBlock__optionsBlock sortBlock__optionsBlock--active" : "sortBlock__optionsBlock"}>
                                                <div className="sortBlock__optionsBlock-item" onClick={sortItemHandlerRating}>
                                                    <p className="optionsBlock__item-text">Rating</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sectionCatalog__productsBlock-products">
                                    <div className="productsBlock__filtersBlock">
                                        <div className="productsBlock__filtersBlock-leftBlock">
                                            <p className="filtersBlock__leftBlock-text">Active Filters:</p>

                                            {/* если filterCategories не равно пустой строке,то показываем фильтр с текстом filterCategories,то есть выбран фильтр сортировки по категориям */}
                                            {filterCategories !== '' &&
                                                <div className="filtersBlock__leftBlock-item">

                                                    {/* если filterCaregories равно Fruits & Vegetables, то показывать текст Fruits & Vegetables,делаем это для того,чтобы при измененении фильтра категорий работала анимация появления текста,иначе,если поставить просто значение текста как filterCategories,то анимация будет работать только при первом появлении одного фильтра категорий */}
                                                    {filterCategories === 'Fruits & Vegetables' &&
                                                        <p className="filtersBlock__item-text">Fruits & Vegetables</p>
                                                    }

                                                    {filterCategories === 'Beverages' &&
                                                        <p className="filtersBlock__item-text">Beverages</p>
                                                    }

                                                    {filterCategories === 'Meats & Seafood' &&
                                                        <p className="filtersBlock__item-text">Meats & Seafood</p>
                                                    }

                                                    {filterCategories === 'Breads & Bakery' &&
                                                        <p className="filtersBlock__item-text">Breads & Bakery</p>
                                                    }


                                                    <button className="filtersBlock__item-btn" onClick={() => setFilterCategories('')}>
                                                        <img src="/images/sectionCatalog/CrossImg.png" alt="" className="filtersBlock__item-btnIMg" />
                                                    </button>
                                                </div>
                                            }

                                            {/* если элемент по индексу 0 из массива filterPrice не равно 0 или элемент по индексу 1 из массива filterPrice меньше priceFilterMax(максимальное значение цены товара,которое посчитали на бэкэнде и поместили в состояние priceFilterMax) (то есть это не дефолтные значения,то есть пользователь изменил фильтр цены),то показываем фильтр цены,в данном случае делаем условие именно таким образом(после условия ставим знак вопроса ? (то есть если условие выполняется), а потом ниже в коде ставим двоеточие : (то есть в противоположном случае,если это условие не выполняется) и пустую строку '' (то есть не показываем ничего) ),иначе не работает правильно условие */}
                                            {filterPrice[0] !== 0 || filterPrice[1] < priceFilterMax ?
                                                <div className="filtersBlock__leftBlock-item">

                                                    <p className="filtersBlock__item-text">Price: {filterPrice[0]} - {(filterPrice[1]).toFixed(0)}</p>

                                                    {/* в onClick(при нажатии на кнопку) изменяем состояние filterPrice на массив со значениями 0 и 50(дефолтные значения минимального и максимального значения фильтра цены),то есть убираем фильтр цены */}
                                                    <button className="filtersBlock__item-btn" onClick={() => setFilterPrice([0, priceFilterMax])}>
                                                        <img src="/images/sectionCatalog/CrossImg.png" alt="" className="filtersBlock__item-btnIMg" />
                                                    </button>
                                                </div> : ''
                                            }

                                            {/* если sortBlockValue не равно пустой строке,то показываем текст сортировки(item с текстом сортировки) */}
                                            {sortBlockValue !== '' &&
                                                <div className="filtersBlock__leftBlock-item">

                                                    <p className="filtersBlock__item-text">Sort By: {sortBlockValue}</p>

                                                    {/* в onClick указываем значение sortBlockValue на пустую строку,то есть убираем фильтр сортировки товаров */}
                                                    <button className="filtersBlock__item-btn" onClick={() => setSortBlockValue('')}>
                                                        <img src="/images/sectionCatalog/CrossImg.png" alt="" className="filtersBlock__item-btnIMg" />
                                                    </button>
                                                </div>
                                            }


                                        </div>

                                        <div className="productsBlock__filtersBlock-amountBlock">
                                            <p className="filtersBlock__amountBlock-amount">0</p>
                                            <p className="filtersBlock__amountBlock-text">Results found.</p>
                                        </div>
                                    </div>

                                    <div className="sectionCatalog__productsBlock-productsItems">

                                        {/* проходимся по массиву объектов товаров products,указываем data?.products,так как от сервера в поле data приходит объект с полями products(объекты товаров из базы данных для отдельной страници пагинации) и allProducts(все объекты товаров из базы данных без лимитов и состояния текущей страницы,то есть без пагинации,чтобы взять потом количество этих всех объектов блюд и использовать для пагинации) */}
                                        {data?.products.map(product =>

                                            <ProductItemCatalog key={product._id} product={product} />

                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default Catalog;