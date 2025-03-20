import { Swiper, SwiperSlide } from "swiper/react"; // импортируем вручну таким образом сам Swiper(для слайдера) и SwiperSlide(для элементов в этом слайдере) из библиотеки swiper/react(перед этим мы установили библиотеку swiper(npm i swiper)),иначе автоматически неправильно импортирует и выдает ошибку

import { Autoplay, Navigation, Thumbs, Zoom } from "swiper/modules"; // импортируем модули для этого слайдера swiper,модули типа навигации(Navigation),пагинации(Pagination) и тд,нужно их импортировать,чтобы подключить и использовать в этом слайдере swiper,импортируем Thumbs для превью картинок слайдера,Autoplay для автоматической прокрутки слайдов

// импортируем стили для самого слайдера и его модулей(типа для навигации этого слайдера,пагинации и тд)
import 'swiper/css';
import 'swiper/css/navigation'; // импортируем стили для модуля навигации(navigation) этого слайдера swiper
import 'swiper/css/thumbs'; // импортируем стили для модуля превью картинок (thumbs) этого слайдера swiper

import 'swiper/css/zoom';


import { useState } from "react";

const ProductItemPage = () => {

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    return (
        <main className="main">
            <section className="sectionProductItemPage">
                <div className="container">
                    <div className="sectionProductItemPage__inner">
                        <div className="sectionProductItemPage__top sectionCatalog__topBlock">
                            <p className="sectionCatalog__topBlock-title">Home</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-title">Category</p>
                            <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="sectionCatalog__topBlock-img" />
                            <p className="sectionCatalog__topBlock-subtitle">Product Name</p>
                        </div>
                        <div className="sectionProductItemPage__itemBlock">
                            <div className="sectionProductItemPage__itemBlock-imgBlock">

                                <div className="sectionNewArrivals__item-saleBlock">20%</div>
                                <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                <div className="sectionProductItemPage__itemBlock-sliderBlock">
                                    <Swiper

                                        modules={[Navigation, Thumbs, Zoom, Autoplay]} // указываем модули этому слайдеру,чтобы они работали,в данном случае указываем модуль Navigation для навигации,чтобы могли меняться картинки 

                                        slidesPerView={1} // количество слайдов для показа в одном элементе слайдера(который сейчас активен у слайдера),можно указывать не только целые числа но и числа с точко(типа 2.5),можно указать еще значение 'auto',тогда будет автоматически формироваться ширина слайда контентом внутри него,или конкретно указанной шириной этому слайдеру в css

                                        zoom={true} // подключаем зум картинок,можно указать параметры maxRatio(максимальное увеличение) и minRation(минимальное увеличение),но в данном случае и так подходит на автоматических настройках

                                        thumbs={{
                                            swiper: thumbsSwiper
                                        }}

                                        navigation={true} // указываем navigation true,то есть подключаем конкретно навигацию для этого слайдера,чтобы могли меняться картинки(можно указать параметры этой навигации,но в данном случае они не нужны)

                                        //автопрокрутка слайдов
                                        autoplay={{
                                            delay: 2000, // пауза между прокруткой слайда в милисекундах

                                            disableOnInteraction:true // отключает автопрокрутку,когда вручную перелестнули или свайпнули слайд
                                        }}

                                        grabCursor={true} // меняет курсор мыши при свайпе слайда на руку

                                    >
                                        {/* указываем SwiperSlide(элемент слайдера) и в него помещаем картинку для этого слайдера */}
                                        <SwiperSlide>
                                            {/* добавляем блок div с классом swiper-zoom-container (это класс этому слайдеру для зума по дефолту,мы подключили стили для этого zoom),чтобы работал зум картинок*/}
                                            <div className="swiper-zoom-container">
                                                <img src="/images/sectionNewArrivals/BeerImg.png" alt="" className="sectionProductItemPage__imgBlock-img" />
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="swiper-zoom-container">
                                                <img src="/images/sectionNewArrivals/VodkaImg.png" alt="" className="sectionProductItemPage__imgBlock-img" />
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="swiper-zoom-container">
                                                <img src="/images/sectionNewArrivals/ChocolateImg.png" alt="" className="sectionProductItemPage__imgBlock-img" />
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>

                                    <div className="sliderBlock__previewSliderBlock">
                                        <Swiper

                                            className="sectionProductItemPage__sliderBlock-previewSlider"

                                            slidesPerView={3} // указываем количество слайдов для показа в одном элементе слайдера(который сейчас активен у слайдера),в данном случае указываем 3 картинки(у нас их и есть в главном слайдере 3),для активного слайда

                                            modules={[Thumbs]}

                                            watchSlidesProgress={true} // указываем это,чтобы был добавлен дополнительный класс видимости текущего активного слайда

                                            onSwiper={setThumbsSwiper}

                                            slideToClickedSlide={true} // перемещается к слайду,на который кликнули

                                            spaceBetween={10} // отступ в пикселях между слайдами

                                        >
                                            {/* указываем SwiperSlide(элемент слайдера) и в него помещаем картинку для этого слайдера */}
                                            <SwiperSlide className="sectionProductItemPage__sliderBlock__sliderPreview">
                                                <img src="/images/sectionNewArrivals/BeerImg.png" alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSliderPreview" />
                                            </SwiperSlide>
                                            <SwiperSlide className="sectionProductItemPage__sliderBlock__sliderPreview">
                                                <img src="/images/sectionNewArrivals/VodkaImg.png" alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSliderPreview" />
                                            </SwiperSlide>
                                            <SwiperSlide className="sectionProductItemPage__sliderBlock__sliderPreview">
                                                <img src="/images/sectionNewArrivals/ChocolateImg.png" alt="" className="sectionProductItemPage__imgBlock-img sectionProductItemPage__imgBlock-imgSliderPreview" />
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>

                                </div>


                            </div>
                            <div className="sectionProductItemPage__itemBlock-infoBlock">
                                <h1 className="sectionProductItemPage__infoBlock-title">Marketside Fresh Organic Bananas,
                                    Bunch</h1>
                                <div className="sectionNewArrivals__item-starsBlock">
                                    <div className="sectionNewArrivals__item-stars">
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                        <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    </div>
                                    <p className="starsBlock__text">(0)</p>
                                </div>
                                <p className="sectionProductItemPage__infoBlock-desc">Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent Vivamus adipiscing nisl ut dolor dignissim semper</p>
                                <div className="sectionNewArrivals__item-priceBlock">
                                    <p className="item__priceBlock-priceSale">$0.89</p>
                                    <p className="item__priceBlock-priceUsual">$1.99</p>
                                </div>
                                <div className="sectionProductItemPage__infoBlock-inputBlock">
                                    <div className="infoBlock__inputBlock-leftInputBlock">
                                        <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus">
                                            <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                                        </button>
                                        <input type="number" className="infoBlock__inputBlock-input" />
                                        <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus">
                                            <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                                        </button>
                                    </div>
                                    <button className="infoBlock__inputBlock-cartBtn">
                                        <img src="/images/sectionProductItemPage/CartBtnImg.png" alt="" className="inputBlock__cartBtn-img" />
                                        <p className="inputBlock__cartBtn-text">Add to cart</p>
                                    </button>
                                </div>
                                <div className="sectionProductItemPage__infoBlock-subInfoBlock">
                                    <div className="infoBlock__subInfoBlock-topBlock">
                                        <img src="/images/sectionProductItemPage/CardImg.png" alt="" className="subInfoBlock__topBlock-img" />
                                        <p className="subInfoBlock__topBlock-text"><span className="subInfoBlock__topBlock-textSpan">Payment.</span> Payment upon receipt of goods, Payment by card in the department, Google Pay,
                                            Online card, -5% discount in case of payment</p>
                                    </div>
                                    <div className="infoBlock__subInfoBlock-topBlock infoBlock__subInfoBlock-bottomBlock">
                                        <img src="/images/sectionProductItemPage/SecurityImg.png" alt="" className="subInfoBlock__topBlock-img" />
                                        <p className="subInfoBlock__topBlock-text"><span className="subInfoBlock__topBlock-textSpan">Warranty.</span> The Consumer Protection Act does not provide for the return of this product of proper
                                            quality.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default ProductItemPage;