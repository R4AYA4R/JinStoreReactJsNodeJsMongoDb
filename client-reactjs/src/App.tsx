
// лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js,поэтому сначала создаем папку с сервером(serverNodeJsMongoDb в данном случае) и в ней просто создаем файл,а потом в корневой папке проекта подключаем git(указываем в терминале git init и тд,делаем первый commit и push данных в git),а только после этого создаем папку для react js,указываем команду в корневой папке проекта в терминале npx create-react-app --template(шаблон) typescript(с typescript),чтобы развернуть шаблонное приложение react js с typescript,потом там будет вопрос,что нужно установить дополнительный пакет новой версии create-react-app,указываем y и enter и это установится

import { BrowserRouter } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import SectionBestSellers from "./components/SectionBestSellers";
import SectionCategoryItems from "./components/SectionCategoryItems";
import SectionDontMiss from "./components/SectionDontMiss";
import SectionNewArrivals from "./components/SectionNewArrivals";
import SectionPromo from "./components/SectionPromo";
import SectionTop from "./components/SectionTop";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    
    <>
      {/* оборачиваем все в BrowserRouter для роутинга страниц(маршрутов страниц),а также чтобы работал наш компонент <ScrollToTop/>,позже будем указывать конкретные маршруты с помощью <Routes> */}
      <BrowserRouter>
        <ScrollToTop/>
        <Header/>
        <main className="main">
          <SectionTop/>
          <SectionCategoryItems/>
          <div className="sectionOuterGradient">
            <SectionNewArrivals/>
            <SectionDontMiss/>
            <SectionBestSellers/>
            <SectionPromo/>
          </div>
        </main>
        <Footer/>
      </BrowserRouter>
    </>

  );
}

export default App;
