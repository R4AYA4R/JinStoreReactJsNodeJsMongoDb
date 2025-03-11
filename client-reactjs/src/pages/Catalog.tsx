import { useEffect, useState } from "react";

import ReactSlider from 'react-slider'; // импортируем ReactSlider из 'react-slider' вручную,так как автоматически не импортируется,перед этим устанавливаем(npm install --save-dev @types/react-slider --force( указываем --force,чтобы установить эту библиотеку через силу,так как для версии react 19,выдает ошибку при установке этой библиотеки) типы для react-slider,иначе выдает ошибку,если ошибка сохраняется,что typescript не может найти типы для ReactSlider,после того,как установили для него типы,то надо закрыть запущенный локальный хост для нашего сайта в терминале и заново его запустить с помощью npm start
import ProductItemCatalog from "../components/ProductItemCatalog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "../types/types";

const Catalog = () => {

    const [filterCategories, setFilterCategories] = useState('');

    const [filterPrice, setFilterPrice] = useState<number[]>([0, 50]); // массив для значений нашего инпута range(ReactSlider),первым значением указываем значение для первого ползунка у этого инпута,а вторым для второго,указываем ему в generic тип как number и что это массив [],иначе выдает ошибку

    const [activeSortBlock, setActiveSortBlock] = useState(false);

    const [sortBlockValue, setSortBlockValue] = useState('');

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер,берем isFetching у useQuery,чтобы отслеживать,загружается ли сейчас запрос на сервер,разница isFetching и isLoading в том,что isFetching всегда будет проверять загрузку запроса на сервер при каждом запросе,а isLoading будет проверять только первый запрос на сервер,в данном случае нужен isFetching,так как идут повторные запросы на сервер
    const { data } = useQuery({
        queryKey: ['getAllProducts'],
        queryFn: async () => {
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProductsCatalog'); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных mongodb) и skip(сколько объектов пропустить,прежде чем начать брать их из базы данных mongodb)

            console.log(response.data);

            return response; // возвращаем этот массив объектов товаров(он будет помещен в поле data у data,которую мы берем из этого useQuery)

        }

    })


    const sortItemHandlerRating = () => {

        setSortBlockValue('Rating'); // изменяем состояние sortBlockValue на значение Rating

        setActiveSortBlock(false); // изменяем состояние activeSortBlock на значение false,то есть убираем появившийся селект блок

    }

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

                                        defaultValue={[0, 50]} // поле для дефолтного значения минимального(первый элемент массива) и максимального(второй элемент массива)

                                        max={50} // поле для максимального значения

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
                                    <p className="priceFilterBlock__text">Price: ${filterPrice[0]} - ${filterPrice[1]}</p>

                                </div>
                            </div>
                            <div className="sectionCatalog__mainBlock-productsBlock">
                                <div className="sectionCatalog__productsBlock-searchBlock">
                                    <div className="productsBlock__searchBlock-inputBlock">
                                        <input type="text" className="productsBlock__searchBlock-input" placeholder="Search for products..." />
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

                                            {/* если элемент по индексу 0 из массива filterPrice не равно 0 или элемент по индексу 1 из массива filterPrice не равен 50(то есть это не дефолтные значения,то есть пользователь изменил фильтр цены),то показываем фильтр цены,в данном случае делаем условие именно таким образом(после условия ставим знак вопроса ? (то есть если условие выполняется), а потом ниже в коде ставим двоеточие : (то есть в противоположном случае,если это условие не выполняется) и пустую строку '' (то есть не показываем ничего) ),иначе не работает правильно условие */}
                                            {filterPrice[0] !== 0 || filterPrice[1] !== 50 ?
                                                <div className="filtersBlock__leftBlock-item">

                                                    <p className="filtersBlock__item-text">Price: {filterPrice[0]} - {filterPrice[1]}</p>

                                                    {/* в onClick(при нажатии на кнопку) изменяем состояние filterPrice на массив со значениями 0 и 50(дефолтные значения минимального и максимального значения фильтра цены),то есть убираем фильтр цены */}
                                                    <button className="filtersBlock__item-btn" onClick={() => setFilterPrice([0, 50])}>
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

                                        {data?.data.map(product =>

                                            <ProductItemCatalog key={product._id} product={product}/>

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