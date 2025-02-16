
// лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js,поэтому сначала создаем папку с сервером(serverNodeJsMongoDb в данном случае) и в ней просто создаем файл,а потом в корневой папке проекта подключаем git(указываем в терминале git init и тд,делаем первый commit и push данных в git),а только после этого создаем папку для react js,указываем команду в корневой папке проекта в терминале npx create-react-app --template(шаблон) typescript(с typescript),чтобы развернуть шаблонное приложение react js с typescript,потом там будет вопрос,что нужно установить дополнительный пакет новой версии create-react-app,указываем y и enter и это установится

import Header from "./components/header/Header";
import SectionTop from "./components/SectionTop";

function App() {
  return (
    
    <>
      <Header/>
      <main className="main">
        <SectionTop/>
      </main>
    </>

  );
}

export default App;
