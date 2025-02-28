import { useState } from "react";

const Catalog = () => {

    const [filterCategories,setFilterCategories] = useState('');

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
                                    <label className="filterBar__categories-label" onClick={()=>setFilterCategories('Fruits & Vegetables')}>
                                        <input type="radio" name="radio" className="categories__label-input" />
                                        <span className={filterCategories === 'Fruits & Vegetables' ? "categories__label-radioStyle categories__label-radioStyle--active" : "categories__label-radioStyle"}>
                                            <span className={filterCategories === 'Fruits & Vegetables' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Fruits & Vegetables' ? "categories__label-text categories__label-text--active" : "categories__label-text"}>Fruits & Vegetables</p>
                                        <p className="categories__label-amount">(0)</p>
                                    </label>
                                    <label className="filterBar__categories-label" onClick={()=>setFilterCategories('Beverages')}>
                                        <input type="radio" name="radio" className="categories__label-input" />
                                        <span className={filterCategories === 'Beverages' ? "categories__label-radioStyle categories__label-radioStyle--active" : "categories__label-radioStyle"}>
                                            <span className={filterCategories === 'Beverages' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Beverages' ? "categories__label-text categories__label-text--active" : "categories__label-text"}>Beverages</p>
                                        <p className="categories__label-amount">(0)</p>
                                    </label>
                                    <label className="filterBar__categories-label" onClick={()=>setFilterCategories('Meats & Seafood')}>
                                        <input type="radio" name="radio" className="categories__label-input" />
                                        <span className={filterCategories === 'Meats & Seafood' ? "categories__label-radioStyle categories__label-radioStyle--active" : "categories__label-radioStyle"}>
                                            <span className={filterCategories === 'Meats & Seafood' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Meats & Seafood' ? "categories__label-text categories__label-text--active" : "categories__label-text"}>Meats & Seafood</p>
                                        <p className="categories__label-amount">(0)</p>
                                    </label>
                                    <label className="filterBar__categories-label" onClick={()=>setFilterCategories('Breads & Bakery')}>
                                        <input type="radio" name="radio" className="categories__label-input" />
                                        <span className={filterCategories === 'Breads & Bakery' ? "categories__label-radioStyle categories__label-radioStyle--active" : "categories__label-radioStyle"}>
                                            <span className={filterCategories === 'Breads & Bakery' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Breads & Bakery' ? "categories__label-text categories__label-text--active" : "categories__label-text"}>Breads & Bakery</p>
                                        <p className="categories__label-amount">(0)</p>
                                    </label>
                                </div>
                            </div>
                            <div className="sectionCatalog__mainBlock-productsBlock">
                                productsBlock
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default Catalog;