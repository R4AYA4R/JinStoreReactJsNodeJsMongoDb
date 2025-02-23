
const SectionPromo = () => {

    return (
        <section className="sectionPromo">
            <div className="container">
                <div className="sectionPromo__inner">
                    <div className="sectionPromo__promoTop">
                        <h2 className="sectionPromo__promoTop-title">In store or online your health & safety is our top priority</h2>
                        <p className="sectionPromo__promoTop-desc">The only supermarket that makes your life easier, makes you enjoy life and makes it better</p>
                    </div>
                    <div className="sectionPromo__sales">
                        <div className="sectionPromo__sales-item sectionPromo__sales-itemFirst">
                            <p className="sectionPromo__item-subtitle">Only This Week</p>
                            <h3 className="sectionPromo__item-title sectionPromo__item-titleFirst">We provide you the best quality products</h3>
                            <p className="sectionPromo__item-text">A family place for grocery</p>
                            <a href="#" className="sectionNewArrivals__top-link sectionDontMiss__item-link sectionPromo__item-link">
                                <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                                <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                            </a>
                        </div>
                        <div className="sectionPromo__sales-item sectionPromo__sales-itemSecond">
                            <p className="sectionPromo__item-subtitle">Only This Week</p>
                            <h3 className="sectionPromo__item-title sectionPromo__item-titleSecond">We make your grocery shopping more exciting</h3>
                            <p className="sectionPromo__item-text">Eat one every day</p>
                            <a href="#" className="sectionNewArrivals__top-link sectionDontMiss__item-link sectionPromo__item-link">
                                <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                                <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                            </a>
                        </div>
                        <div className="sectionPromo__sales-item sectionPromo__sales-itemThird">
                            <p className="sectionPromo__item-subtitle">Only This Week</p>
                            <h3 className="sectionPromo__item-title sectionPromo__item-titleThird">The one supermarket that saves your money</h3>
                            <p className="sectionPromo__item-text">Breakfast made better</p>
                            <a href="#" className="sectionNewArrivals__top-link sectionDontMiss__item-link sectionPromo__item-link">
                                <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                                <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionPromo;