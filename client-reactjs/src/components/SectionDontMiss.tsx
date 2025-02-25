import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionDontMiss = () => {

    const sectionDontMiss = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionDontMiss as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section ref={sectionDontMiss} id="sectionDontMiss" className={onScreen.sectionDontMissIntersecting ? "sectionDontMiss sectionDontMiss__active" : "sectionDontMiss"}>
            <div className="container">
                <div className="sectionDontMiss__inner">
                    <div className="sectionDontMiss__item sectionDontMiss__itemProvides">
                        <p className="sectionDontMiss__item-subtitle">Only This Week</p>
                        <h2 className="sectionDontMiss__item-title">Provides you experienced quality products</h2>
                        <p className="sectionDontMiss__item-desc">Feed your family the best</p>
                        <a href="#" className="sectionNewArrivals__top-link sectionDontMiss__item-link">
                            <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                            <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                        </a>
                    </div>
                    <div className="sectionDontMiss__item sectionDontMiss__itemShopping">
                        <p className="sectionDontMiss__item-subtitle">Only This Week</p>
                        <h2 className="sectionDontMiss__item-title">Shopping with us for better quality and the best price</h2>
                        <p className="sectionDontMiss__item-desc">Only this week. Don’t miss...</p>
                        <a href="#" className="sectionNewArrivals__top-link sectionDontMiss__item-link">
                            <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                            <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                        </a>
                    </div>
                    <div className="sectionDontMiss__item sectionDontMiss__itemGet">
                        <p className="sectionDontMiss__item-subtitle">Only This Week</p>
                        <h2 className="sectionDontMiss__item-title">Get the best quality products at the lowest prices</h2>
                        <p className="sectionDontMiss__item-desc">A different kind of grocery store</p>
                        <a href="#" className="sectionNewArrivals__top-link sectionDontMiss__item-link">
                            <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                            <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                        </a>
                    </div>
                    <div className="sectionDontMiss__item sectionDontMiss__itemWhere">
                        <p className="sectionDontMiss__item-subtitle">Only This Week</p>
                        <h2 className="sectionDontMiss__item-title">Where you get your all favorite brands under one roof</h2>
                        <p className="sectionDontMiss__item-desc">Shine the morning...</p>
                        <a href="#" className="sectionNewArrivals__top-link sectionDontMiss__item-link">
                            <p className="sectionNewArrivals__top-linkText">Shop Now</p>
                            <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionDontMiss;