
// лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js,поэтому сначала создаем папку с сервером(serverNodeJsMongoDb в данном случае) и в ней просто создаем файл,а потом в корневой папке проекта подключаем git(указываем в терминале git init и тд,делаем первый commit и push данных в git),а только после этого создаем папку для react js,указываем команду в корневой папке проекта в терминале npx create-react-app --template(шаблон) typescript(с typescript),чтобы развернуть шаблонное приложение react js с typescript,потом там будет вопрос,что нужно установить дополнительный пакет новой версии create-react-app,указываем y и enter и это установится,устанавливаем npm i react-router-dom для работы с роутингом страниц(маршрутами страниц), устанавливаем библиотеку npm i react-slider --force,указываем --force,чтобы установить эту библиотеку через силу,так как для версии react 19,выдает ошибку при установке этой библиотеки (в терминале в папку с фронтенд приложением(сайтом),в данном случае в папку client-reactjs),чтобы сделать input range(инпут с ползунками), устанавливаем типы для библиотеки react-slider npm install --save-dev @types/react-slider --force( указываем --force,чтобы установить эту библиотеку через силу,так как для версии react 19,выдает ошибку при установке этой библиотеки),устанавливаем эти типы,чтобы не было ошибки у typescript при импорте ReactSlider

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import SectionBestSellers from "./components/SectionBestSellers";
import SectionCategoryItems from "./components/SectionCategoryItems";
import SectionDontMiss from "./components/SectionDontMiss";
import SectionNewArrivals from "./components/SectionNewArrivals";
import SectionPromo from "./components/SectionPromo";
import SectionTop from "./components/SectionTop";
import ScrollToTop from "./utils/ScrollToTop";
import HomePage from "./pages/HomePage";
import Catalog from "./pages/Catalog";
import ProductItemPage from "./pages/ProductItemPage";
import AboutUs from "./pages/AboutUs";
import Cart from "./pages/Cart";
import UserPage from "./pages/UserPage";

function App() {
  return (
    
    <>
      {/* оборачиваем все в BrowserRouter для роутинга страниц(маршрутов страниц),а также чтобы работал наш компонент <ScrollToTop/>,позже будем указывать конкретные маршруты с помощью <Routes> */}
      <BrowserRouter>
        <ScrollToTop/>
        <div className="wrapper">
          <Header/>
          <Routes>
            <Route path="/" element={<HomePage/>} /> {/* указываем путь до страницы <HomePage/> как / */}

            <Route path="/catalog" element={<Catalog/>} /> 

            <Route path="/catalog/:id" element={<ProductItemPage/>} />  {/* указываем после /catalog/ :id,для динамического id,чтобы потом открывалась отдельная страница товара по конкретному id  */}

            <Route path="/aboutUs" element={<AboutUs/>} /> 

            <Route path="/cart" element={<Cart/>} /> 

            <Route path="/userPage" element={<UserPage/>} /> 

            <Route path="/*" element={<Navigate to="/" />} /> {/* если пользователь введет в url несуществующую страницу,то его перекинет на главную(в данном случае если пользователь введет в url несуществующую страницу( в path= "/*" - любое значение,кроме тех,которые уже есть в Route), то его перекинет на главную страницу с помощью Navigate(импортировали этот модуль из библиотеки react-router-dom) и в to= указываем на какую страницу(на какой из существующих Route(маршрутов)) перекинуть пользователя) */}

          </Routes>
          <Footer/>
        </div>
      </BrowserRouter>
    </>

  );
}

export default App;
