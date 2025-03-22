
import { RefObject, useEffect, useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../types/types";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductItemPageItemBlock from "../components/ProductItemPageItemBlock";

const ProductItemPage = () => {


    // скопировали это из файла SectionNewArrivals,так как здесь тоже самое,чтобы дополнительно не писать
    const sectionNewArrivals = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionNewArrivals as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [tab, setTab] = useState('Desc'); // состояние для таба описания

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)


    const { data, refetch } = useQuery({
        queryKey: ['getProductById'],
        queryFn: async () => {

            const response = await axios.get<IProduct>(`http://localhost:5000/api/getProductsCatalog/${params.id}`); // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IProduct для объекта товара)

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет объект товара) и тд

        }

    })



    return (
        <main className="main">
            {/* скопировали id и тд из файла sectionNewArrivals,так как здесь такая же анимация и это страница товара,поэтому здесь не будет такой секции как в sectionNewArrivals,поэтому id будут нормально работать,это просто,чтобы не писать больше дополнительного */}
            <section className={onScreen.sectionNewArrivalsIntersecting ? "sectionNewArrivals sectionNewArrivals__active sectionProductItemPage" : "sectionNewArrivals sectionProductItemPage"} ref={sectionNewArrivals} id="sectionNewArrivals">
                <div className="container">
                    <div className="sectionProductItemPage__inner">
                        <div className="sectionProductItemPage__top sectionCatalog__topBlock">
                            <p className="sectionCatalog__topBlock-title">Home</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-title">{data?.data.category}</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-subtitle">{data?.data.name}</p>
                        </div>

                        {/* вынесли блок с информацией о товара и слайдером в наш компонент ProductItemPageItemBlock,так как там много кода,передаем туда как пропс(параметр) product со значением data?.data(объект товара) */}
                        <ProductItemPageItemBlock product={data?.data} />

                        <div className="sectionProductItemPage__descBlock">
                            <div className="sectionProductItemPage__descBlock-tabs">
                                <button className={tab === 'Desc' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={()=>setTab('Desc')}>Description</button>
                                <button className={tab === 'Reviews' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={()=>setTab('Reviews')}>Reviews (0)</button>
                            </div>

                            <div className="sectionProductItemPage__descBlock-desc">

                                {/* если tab равно 'Desc',то показываем блок с описанием */}
                                {tab === 'Desc' &&
                                
                                    <div className="descBlock__desc-inner">
                                        <p className="descBlock__desc-descText">{data?.data.descText}</p>
                                        <p className="descBlock__desc-subText"> Sapien vitae odio accumsan gravida. Morbi vitae erat auctor, eleifend nunc a, lobortis neque. Praesent aliquam dignissim viverra. Maecenas lacus odio, feugiat eu nunc sit amet,maximus sagittis dolor. Vivamus nisi sapien, elementum sit amet eros sit amet, ultricies cursus ipsum. Sed consequat luctus ligula. Curabitur laoreet rhoncus blandit. Aenean vel diam utarcu pharetra dignissim ut sed leo. Vivamus faucibus, ipsum in vestibulum vulputate, lorem orci convallis quam, sit amet consequat nulla felis pharetra lacus. Duis semper erat mauris, sed egestas purus commodo vel.</p>
                                    </div>

                                }

                                {tab === 'Reviews' &&

                                    <div className="descBlock__reviews-inner">
                                        Reviews
                                    </div>

                                }


                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </main>
    )

}

export default ProductItemPage;