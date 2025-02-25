import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionCategoryItems = () => {

    const sectionCategoryItems = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategoryItems as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section ref={sectionCategoryItems} id="sectionCategoryItems" className={onScreen.sectionCategoryItemsIntersecting ? "sectionCategoryItems sectionCategoryItems__active" : "sectionCategoryItems"}>
            <div className="container">
                <div className="sectionCategoryItems__inner">
                    <div className="sectionCategoryItems__item">
                        <img src="/images/sectionCategoryItems/list02.png" alt="" className="sectionCategoryItems__item-img" />
                        <p className="sectionCategoryItems__item-text">Fruits & Vegetables</p>
                    </div>
                    <div className="sectionCategoryItems__item">
                        <img src="/images/sectionCategoryItems/list08.png" alt="" className="sectionCategoryItems__item-img" />
                        <p className="sectionCategoryItems__item-text">Beverages</p>
                    </div>
                    <div className="sectionCategoryItems__item">
                        <img src="/images/sectionCategoryItems/list11.png" alt="" className="sectionCategoryItems__item-img" />
                        <p className="sectionCategoryItems__item-text">Meats & Seafood</p>
                    </div>
                    <div className="sectionCategoryItems__item">
                        <img src="/images/sectionCategoryItems/list17.png" alt="" className="sectionCategoryItems__item-img" />
                        <p className="sectionCategoryItems__item-text">Breads & Bakery</p>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionCategoryItems;