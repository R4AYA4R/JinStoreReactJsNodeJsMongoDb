import { useState } from "react";

import ReactSlider from 'react-slider'; // импортируем ReactSlider из 'react-slider' вручную,так как автоматически не импортируется,перед этим устанавливаем(npm install --save-dev @types/react-slider --force( указываем --force,чтобы установить эту библиотеку через силу,так как для версии react 19,выдает ошибку при установке этой библиотеки) типы для react-slider,иначе выдает ошибку,если ошибка сохраняется,что typescript не может найти типы для ReactSlider,после того,как установили для него типы,то надо закрыть запущенный локальный хост для нашего сайта в терминале и заново его запустить с помощью npm start

const Catalog = () => {

    const [filterCategories, setFilterCategories] = useState('');

    const [filterPrice, setFilterPrice] = useState<number[]>([0, 50]); // массив для значений нашего инпута range(ReactSlider),первым значением указываем значение для первого ползунка у этого инпута,а вторым для второго,указываем ему в generic тип как number и что это массив [],иначе выдает ошибку

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
                                        sortBy
                                    </div>
                                </div>
                                <div className="sectionCatalog__productsBlock-products">
                                    products
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