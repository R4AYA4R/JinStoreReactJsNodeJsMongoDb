import { useEffect } from "react";
import { useLocation } from "react-router-dom"

// функция,чтобы при переходе на другую страницу(или при обновлении страницы) при открытии экран и скролл находился вверху страницы,это также нужно,чтобы не багались анимации появления секций,чтобы при обновлении страницы пользователя всегда перекидывало вверх страницы
const ScrollToTop = () => {

    const {pathname} = useLocation(); // достаем pathname(url страницы) из useLocation

    // перемещаем скрол в верх экрана(по координате x 0, и y 0,с помощью window.scrollTo()),когда меняется переменная pathname(то есть когда переходим на другую страницу),а также при запуске страницы
    useEffect(()=>{

        window.scrollTo(0,0);

    },[pathname])

    return null; // возвращаем null,чтобы можно было использовать эту функцию как react компонент типа <ScrollToTop/> и указывать потом так в коде

}

export default ScrollToTop;