import { RefObject, useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../types/types";
import axios from "axios";
import ProductItemSideBestSellers from "./ProductItemSideBestSellers";
import ProductItemMidBlockBestSellers from "./ProductItemMidBlockBestSellers";

const SectionBestSellers = () => {

    const sectionBestSellers = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionBestSellers as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер,в данном случае делаем этот запрос для левой колонки карточек товаров
    const { data: dataLeftSideBlock } = useQuery({
        queryKey: ['getProductsLeftSideBlockBestSellers'], // указываем здесь такое же название,как и в файле SectionDeals для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другом компоненте(в данном случае в SectionDeals),а не после обновления страницы
        queryFn: async () => {
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts?limit=3&skip=2'); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных mongodb) и skip(сколько объектов пропустить,прежде чем начать брать их из базы данных mongodb)

            console.log(response.data);

            return response; // возвращаем этот массив объектов товаров(он будет помещен в поле data у data,которую мы берем из этого useQuery)

        }

    })

    // в данном случае делаем этот запрос для левой колонки карточек товаров
    const { data: dataRightSideBlock } = useQuery({
        queryKey: ['getProductsRightSideBlockBestSellers'], // указываем здесь такое же название,как и в файле SectionDeals для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другом компоненте(в данном случае в SectionDeals),а не после обновления страницы
        queryFn: async () => {
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts?limit=3&skip=5'); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных mongodb) и skip(сколько объектов пропустить,прежде чем начать брать их из базы данных mongodb)

            console.log(response.data);

            return response; // возвращаем этот массив объектов товаров(он будет помещен в поле data у data,которую мы берем из этого useQuery)

        }

    })

    // в данном случае делаем этот запрос для центральной колонки карточек товаров
    const { data: dataMidBlock } = useQuery({
        queryKey: ['getProductsMidBlockBestSellers'], // указываем здесь такое же название,как и в файле SectionDeals для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другом компоненте(в данном случае в SectionDeals),а не после обновления страницы
        queryFn: async () => {
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts?limit=1&skip=8'); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных mongodb) и skip(сколько объектов пропустить,прежде чем начать брать их из базы данных mongodb)

            console.log(response.data);

            return response; // возвращаем этот массив объектов товаров(он будет помещен в поле data у data,которую мы берем из этого useQuery)

        }

    })


    const leftBlockItemsRef = useRef<HTMLDivElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную leftBlockItemsRef,указываем тип в generic этому useRef как HTMLDivElement(иначе выдает ошибку,так как эта ссылка уже будет для блока div),указываем в useRef null,так как используем typeScript,делаем еще одну ссылку на html элемент,чтобы сделать дополнительные анимации отдельные для каждого блока

    const rightBlockItemsRef = useRef<HTMLDivElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную leftBlockItems,указываем тип в generic этому useRef как HTMLDivElement(иначе выдает ошибку,так как эта ссылка уже будет для блока div),указываем в useRef null,так как используем typeScript,делаем еще одну ссылку на html элемент,чтобы сделать дополнительные анимации отдельные для каждого блока

    const midBlockItemRef = useRef<HTMLDivElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную leftBlockItems,указываем тип в generic этому useRef как HTMLDivElement(иначе выдает ошибку,так как эта ссылка уже будет для блока div),указываем в useRef null,так как используем typeScript,делаем еще одну ссылку на html элемент,чтобы сделать дополнительные анимации отдельные для каждого блока

    const onScreenLeftBlock = useIsOnScreen(leftBlockItemsRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на leftBlockItemsRef),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen,передаем в наш хук useIsOnScreen еще одну ссылку на html элемент,чтобы сделать дополнительные анимации отдельные для каждого блока

    const onScreenRightBlock = useIsOnScreen(rightBlockItemsRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на leftBlockItemsRef),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen,передаем в наш хук useIsOnScreen еще одну ссылку на html элемент,чтобы сделать дополнительные анимации отдельные для каждого блока

    const onScreenMidBlock = useIsOnScreen(midBlockItemRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на leftBlockItemsRef),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen,передаем в наш хук useIsOnScreen еще одну ссылку на html элемент,чтобы сделать дополнительные анимации отдельные для каждого блока

    return (
        <section id="sectionBestSellers" className={onScreen.sectionBestSellersIntersecting ? "sectionBestSellers sectionBestSellers__active" : "sectionBestSellers"} ref={sectionBestSellers}>
            <div className="container">
                <div className="sectionBestSellers__inner">
                    <div className="sectionBestSellers__top">
                        <div className="sectionBestSellers__top-leftBlock">
                            <h3 className="sectionBestSellers__top-title">BEST SELLERS</h3>
                            <p className="sectionBestSellers__top-text">Dont miss this opportunity at a special discount just for this week.</p>
                        </div>
                        <Link to="/catalog" className="sectionNewArrivals__top-link">
                            <p className="sectionNewArrivals__top-linkText">View All</p>
                            <img src="/images/sectionNewArrivals/Icon.png" alt="" className="sectionNewArrivals__top-linkImg" />
                        </Link>
                    </div>
                    <div className="sectionBestSellers__itemsBlock">
                        <div className={onScreenLeftBlock.sectionLeftBlockItemsIntersecting ? "sectionBestSellers__itemsBlockSide sectionBestSellers__itemsBlockSideLeft sectionBestSellers__itemsBlockSideLeft-active" : "sectionBestSellers__itemsBlockSide sectionBestSellers__itemsBlockSideLeft"} ref={leftBlockItemsRef} id="leftBlockItems">

                            {dataLeftSideBlock?.data.map(product =>
                                <ProductItemSideBestSellers key={product._id} product={product} />
                            )}

                        </div>

                        <div className={onScreenMidBlock.sectionMidBlockItemsIntersecting ? "sectionBestSellers__itemsBlock-midBlock sectionBestSellers__itemsBlock-midBlockPassive sectionBestSellers__itemsBlock-midBlock--active" : "sectionBestSellers__itemsBlock-midBlock sectionBestSellers__itemsBlock-midBlockPassive"} ref={midBlockItemRef} id="midBlockItems">

                            {dataMidBlock?.data.map(product =>
                                <ProductItemMidBlockBestSellers key={product._id} product={product}/>
                            )}

                        </div>

                        <div className={onScreenRightBlock.sectionRightBlockItemsIntersecting ? "sectionBestSellers__itemsBlockSide sectionBestSellers__itemsBlockSideRight sectionBestSellers__itemsBlockSideRight-active" : "sectionBestSellers__itemsBlockSide sectionBestSellers__itemsBlockSideRight"} ref={rightBlockItemsRef} id="rightBlockItems">

                            {dataRightSideBlock?.data.map(product =>
                                <ProductItemSideBestSellers key={product._id} product={product} />
                            )}

                        </div>

                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionBestSellers;