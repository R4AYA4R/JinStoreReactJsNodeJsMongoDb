
const SectionTop = () => {

    return (
        <section className="sectionTop">
            <div className="container">
                <div className="sectionTop__inner">
                    <p className="sectionTop__subtitle">Weekend Discount</p>
                    <h1 className="sectionTop__title">Shopping with us for better quality and the best price</h1>
                    <p className="sectionTop__desc">We have prepared special discounts for you on grocery products.
                    Don't miss these opportunities...</p>
                    <a href="#" className="sectionTop__link">
                        <p className="sectionTop__link-text">Shop Now</p>
                        <img src="/images/sectionTop/ArrowRight.png" alt="" className="sectionTop__link-arrowImg" />
                    </a>
                </div>
            </div>
        </section>
    )

}

export default SectionTop;