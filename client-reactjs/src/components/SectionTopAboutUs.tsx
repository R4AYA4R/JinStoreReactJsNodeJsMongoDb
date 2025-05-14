
import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionTopAboutUs = () => {

    const sectionBestSellers = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionBestSellers as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return (
        <section id="sectionBestSellers" className={onScreen.sectionBestSellersIntersecting ? "sectionBestSellers sectionBestSellers__active sectionUserPageTop" : "sectionBestSellers sectionUserPageTop"} ref={sectionBestSellers}>
            <div className="container">
                <div className="sectionUserPageTop__inner">
                    <div className="sectionCatalog__topBlock sectionUserPageTop__topBlock sectionTopAboutUs__topBlock">
                        <p className="sectionCatalog__topBlock-title">Home</p>
                        <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                        <p className="sectionCatalog__topBlock-subtitle">About Us</p>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionTopAboutUs;