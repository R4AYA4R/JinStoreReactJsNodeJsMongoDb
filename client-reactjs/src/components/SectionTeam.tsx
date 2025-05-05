



import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { Link } from "react-router-dom";

const SectionTeam = () => {

    const sectionBestSellers = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionBestSellers as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return (
        <section ref={sectionBestSellers} id="sectionBestSellers" className={onScreen.sectionBestSellersIntersecting ? "sectionBestSellers sectionBestSellers__active sectionTeam" : "sectionBestSellers sectionTeam"}>
            <div className="container">
                <div className="sectionTeam__inner">
                    <h3 className="sectionTeam__title">Our Awesome Team</h3>
                    <p className="sectionTeam__subtitle">Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a mi.</p>
                    <div className="sectionTeam__items">
                        <div className="sectionTeam__items-item">
                            <img src="/images/sectionTeam/Image.png" alt="" className="sectionTeam__item-img" />
                            <div className="sectionTeam__item-textBlock">
                                <p className="sectionTeam__item-title">Jenny Wilson</p>
                                <p className="sectionTeam__item-text">Ceo & Founder</p>
                            </div>
                        </div>
                        <div className="sectionTeam__items-item">
                            <img src="/images/sectionTeam/Image (1).png" alt="" className="sectionTeam__item-img" />
                            <div className="sectionTeam__item-textBlock">
                                <p className="sectionTeam__item-title">Jane Cooper</p>
                                <p className="sectionTeam__item-text">Worker</p>
                            </div>
                        </div>
                        <div className="sectionTeam__items-item">
                            <img src="/images/sectionTeam/Image (2).png" alt="" className="sectionTeam__item-img" />
                            <div className="sectionTeam__item-textBlock">
                                <p className="sectionTeam__item-title">Cody Fisher</p>
                                <p className="sectionTeam__item-text">Security Guard</p>
                            </div>
                        </div>
                        <div className="sectionTeam__items-item">
                            <img src="/images/sectionTeam/Image (3).png" alt="" className="sectionTeam__item-img" />
                            <div className="sectionTeam__item-textBlock">
                                <p className="sectionTeam__item-title">Robert Fox</p>
                                <p className="sectionTeam__item-text">Senior Farmer Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionTeam;