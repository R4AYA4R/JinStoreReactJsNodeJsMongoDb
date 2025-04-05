import { RefObject, useEffect, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IResponseCatalog } from "../types/types";

const SectionCategoryItems = () => {

    const { catalogCategory } = useTypedSelector(state => state.catalogSlice); // указываем наш слайс(редьюсер) под названием catalogSlice и деструктуризируем у него поле состояния catalogCategory,используя наш типизированный хук для useSelector

    const { setCategoryCatalog } = useActions(); // берем action для изменения состояния категории каталога у слайса(редьюсера) catalogSlice у нашего хука useActions уже обернутый в диспатч,так как мы оборачивали это в самом хуке useActions

    const router = useNavigate();

    const sectionCategoryItems = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategoryItems as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    // скопировали функцию запроса на сервер для получения товаров каталога,обязательно указываем ей queryKey такой же,как и на странице Catalog.tsx,чтобы эти данные кешировались и отображались также изначально для страницы Catalog.tsx,если не указать эту функцию тут,то при первом рендеринге страницы каталога(то есть когда,например,перезагрузили страницу Home и перешли на страницу каталога) не будут правильно отображаться товары,даже если указан catalogCategory,там не будут срабатывать useEffect
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['getAllProductsCatalog'],
        queryFn: async () => {

            // выносим url на получение товаров в отдельную переменную,чтобы ее потом изменять,указываем тут url с параметром name и значением типа пустой строки,так как сделали так на бэкэнде,чтобы всегда нужно было указывать параметр name,даже если со значением пустой строки
            let url = `http://localhost:5000/api/getProductsCatalog?name=`;


            // указываем тип данных,который придет от сервера как тип на основе нашего интерфейса IResponseCatalog,у этого объекта будут поля products(объекты товаров из базы данных для отдельной страници пагинации) и allProducts(все объекты товаров из базы данных без лимитов и состояния текущей страницы,то есть без пагинации,чтобы взять потом количество этих всех объектов товаров и использовать для пагинации),вместо url будет подставлено значение,которое есть у нашей переменной url
            const response = await axios.get<IResponseCatalog>(url, {

                params: {

                    category: catalogCategory, // указываем query параметр category со значением catalogCategory
                    
                }

            });  // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера)

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля products и allProducts

        }

    })

    // при изменении catalogCategory переобновляем массив товаров каталога,то есть делаем повторный запрос с помощью refetch()
    useEffect(()=>{

        refetch();

    },[catalogCategory])

    const setFruitsAndVegetables = () => {

        setCategoryCatalog('Fruits & Vegetables'); // изменяем значение categoryCatalog на Fruits & Vegetables

        router('/catalog'); // перекидываем пользователя на страницу каталога(/catalog)

    }

    const setBeverages = () => {

        setCategoryCatalog('Beverages');

        router('/catalog');

    }

    const setMeatsAndSeafood = () => {

        setCategoryCatalog('Meats & Seafood');

        router('/catalog');

    }

    const setBreadsAndBakery = () => {

        setCategoryCatalog('Breads & Bakery');

        router('/catalog');

    }

    return (
        <section ref={sectionCategoryItems} id="sectionCategoryItems" className={onScreen.sectionCategoryItemsIntersecting ? "sectionCategoryItems sectionCategoryItems__active" : "sectionCategoryItems"}>
            <div className="container">
                <div className="sectionCategoryItems__inner">
                    <div className="sectionCategoryItems__item" onClick={setFruitsAndVegetables}>
                        <img src="/images/sectionCategoryItems/list02.png" alt="" className="sectionCategoryItems__item-img" />
                        <p className="sectionCategoryItems__item-text">Fruits & Vegetables</p>
                    </div>
                    <div className="sectionCategoryItems__item" onClick={setBeverages}>
                        <img src="/images/sectionCategoryItems/list08.png" alt="" className="sectionCategoryItems__item-img" />
                        <p className="sectionCategoryItems__item-text">Beverages</p>
                    </div>
                    <div className="sectionCategoryItems__item" onClick={setMeatsAndSeafood}>
                        <img src="/images/sectionCategoryItems/list11.png" alt="" className="sectionCategoryItems__item-img" />
                        <p className="sectionCategoryItems__item-text">Meats & Seafood</p>
                    </div>
                    <div className="sectionCategoryItems__item" onClick={setBreadsAndBakery}>
                        <img src="/images/sectionCategoryItems/list17.png" alt="" className="sectionCategoryItems__item-img" />
                        <p className="sectionCategoryItems__item-text">Breads & Bakery</p>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionCategoryItems;