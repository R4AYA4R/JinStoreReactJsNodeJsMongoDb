


import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { Link } from "react-router-dom";

const SectionDelivery = () => {

    const sectionCategoryItems = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategoryItems as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return (
        <section ref={sectionCategoryItems} id="sectionCategoryItems" className={onScreen.sectionCategoryItemsIntersecting ? "sectionCategoryItems sectionCategoryItems__active sectionDelivery" : "sectionCategoryItems sectionDelivery"}>
            <div className="container">
                <div className="sectionTrusted__inner">
                    <div className="sectionTrusted__info sectionDelivery__info">
                        <h2 className="sectionTrusted__info-title">We Delivered, You Enjoy Your Order.</h2>
                        <p className="sectionTrusted__info-subtitle sectionDelivery__info-subtitle">Ut suscipit egestas suscipit. Sed posuere pellentesque nunc, ultrices consectetur velit dapibus eu. Mauris sollicitudin dignissim diam, ac mattis eros accumsan rhoncus. Curabitur auctor bibendum nunc eget elementum.</p>
                        <div className="sectionDelivery__items">
                            <div className="sectionDelivery__items-item">
                                <img src="/images/sectionDelivery/Check.png" alt="" className="sectionDelivery__item-img" />
                                <p className="sectionDelivery__item-text">Sed in metus pellentesque.</p>
                            </div>
                            <div className="sectionDelivery__items-item">
                                <img src="/images/sectionDelivery/Check.png" alt="" className="sectionDelivery__item-img" />
                                <p className="sectionDelivery__item-text">Fusce et ex commodo, aliquam nulla efficitur, tempus lorem.</p>
                            </div>
                            <div className="sectionDelivery__items-item">
                                <img src="/images/sectionDelivery/Check.png" alt="" className="sectionDelivery__item-img" />
                                <p className="sectionDelivery__item-text">Maecenas ut nunc fringilla erat varius.</p>
                            </div>
                            <Link to="/catalog" className="sectionDelivery__btn">
                                <p className="sectionTop__link-text">Shop Now</p>
                                <img src="/images/sectionTop/ArrowRight.png" alt="" className="sectionTop__link-arrowImg" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionDelivery;