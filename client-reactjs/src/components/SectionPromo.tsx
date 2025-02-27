import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { Link } from "react-router-dom";

const SectionPromo = () => {

    const sectionDontMiss = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionDontMiss as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        // указываем такой же id как и у секции sectionDontMiss,так как эти секции находятся в разных друг от друга местах,и мы уже прописывали логику для этого id в файле useIsOnScreen,также используем такие же классы,как и для sectionDontMiss,просто добавляем свой отдельный для sectionPromo,это чтобы заново не прописывать отдельную такую же анимацию и проверку на id в файле useIsOnScreen
        <section className={onScreen.sectionDontMissIntersecting ? " sectionDontMiss sectionPromo sectionDontMiss__active" : "sectionPromo sectionDontMiss"} ref={sectionDontMiss} id="sectionDontMiss" >
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
                            <Link to="/catalog" className="sectionNewArrivals__top-link sectionDontMiss__item-link sectionPromo__item-link">
                                <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                                <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                            </Link>
                        </div>
                        <div className="sectionPromo__sales-item sectionPromo__sales-itemSecond">
                            <p className="sectionPromo__item-subtitle">Only This Week</p>
                            <h3 className="sectionPromo__item-title sectionPromo__item-titleSecond">We make your grocery shopping more exciting</h3>
                            <p className="sectionPromo__item-text">Eat one every day</p>
                            <Link to="/catalog" className="sectionNewArrivals__top-link sectionDontMiss__item-link sectionPromo__item-link">
                                <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                                <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                            </Link>
                        </div>
                        <div className="sectionPromo__sales-item sectionPromo__sales-itemThird">
                            <p className="sectionPromo__item-subtitle">Only This Week</p>
                            <h3 className="sectionPromo__item-title sectionPromo__item-titleThird">The one supermarket that saves your money</h3>
                            <p className="sectionPromo__item-text">Breakfast made better</p>
                            <Link to="/catalog" className="sectionNewArrivals__top-link sectionDontMiss__item-link sectionPromo__item-link">
                                <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                                <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionPromo;