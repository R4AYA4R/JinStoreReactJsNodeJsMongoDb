

import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionTrustedAboutUs = () => {

    const sectionNewArrivals = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionNewArrivals as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return (
        <section ref={sectionNewArrivals} id="sectionNewArrivals" className={onScreen.sectionNewArrivalsIntersecting ? 'sectionNewArrivals sectionNewArrivals__active sectionTrusted' :'sectionNewArrivals sectionTrusted'}>
            <div className="container">
                <div className="sectionTrusted__inner">
                    <img src="/images/sectionTrusted/Image.png" alt="" className="sectionTrusted__img" />
                    <div className="sectionTrusted__info">
                        <h2 className="sectionTrusted__info-title">100% Trusted Food Store</h2>
                        <p className="sectionTrusted__info-subtitle">Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a mi. Nulla eu eros consequat tortor tincidunt feugiat. </p>
                        <div className="sectionTrusted__info-items">
                            <div className="sectionTrusted__items-leftBlock">
                                <div className="sectionTrusted__items-item">
                                    <img src="/images/sectionTrusted/Icon.png" alt="" className="sectionTrusted__item-img" />
                                    <div className="sectionTrusted__item-textBlock">
                                        <p className="sectionTrusted__item-title">100% Organic food</p>
                                        <p className="sectionTrusted__item-subtitle">100% healthy & Fresh food</p>
                                    </div>
                                </div>
                                <div className="sectionTrusted__items-item">
                                    <img src="/images/sectionTrusted/Icon (1).png" alt="" className="sectionTrusted__item-img" />
                                    <div className="sectionTrusted__item-textBlock">
                                        <p className="sectionTrusted__item-title">Customer Feedback</p>
                                        <p className="sectionTrusted__item-subtitle">Our happy customer</p>
                                    </div>
                                </div>
                                <div className="sectionTrusted__items-item">
                                    <img src="/images/sectionTrusted/Icon (2).png" alt="" className="sectionTrusted__item-img" />
                                    <div className="sectionTrusted__item-textBlock">
                                        <p className="sectionTrusted__item-title">Free Shipping</p>
                                        <p className="sectionTrusted__item-subtitle">Free shipping with discount</p>
                                    </div>
                                </div>
                            </div>
                            <div className="sectionTrusted__items-rightBlock">
                                <div className="sectionTrusted__items-item">
                                    <img src="/images/sectionTrusted/Icon (3).png" alt="" className="sectionTrusted__item-img" />
                                    <div className="sectionTrusted__item-textBlock">
                                        <p className="sectionTrusted__item-title">Great Support 24/7</p>
                                        <p className="sectionTrusted__item-subtitle">Instant access to Contact</p>
                                    </div>
                                </div>
                                <div className="sectionTrusted__items-item">
                                    <img src="/images/sectionTrusted/Icon (4).png" alt="" className="sectionTrusted__item-img" />
                                    <div className="sectionTrusted__item-textBlock">
                                        <p className="sectionTrusted__item-title">100% Secure Payment</p>
                                        <p className="sectionTrusted__item-subtitle">We ensure your money is save</p>
                                    </div>
                                </div>
                                <div className="sectionTrusted__items-item">
                                    <img src="/images/sectionTrusted/Icon (5).png" alt="" className="sectionTrusted__item-img" />
                                    <div className="sectionTrusted__item-textBlock">
                                        <p className="sectionTrusted__item-title">100% Trusted Food</p>
                                        <p className="sectionTrusted__item-subtitle">100% Trusted healthy & Fresh food.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionTrustedAboutUs;