
// создали компонент Header в отдельной папке,так как будем здесь для стилей использовать css модули,то есть файл .module.css(в данном случае Header.module.css),в нем будем описывать стили для этого Header и их импортировать,в файле Header.module.css будем их называть и 

import cl from './Header.module.css'; // импортируем cl(классы,можем по-любому назвать это) из нашего файла Header.module.css,чтобы потом указывать классы через точку типа cl.header(header в данном случае название класса в файле Header.module.css и так указываем остальные классы)

const Header = () => {
    
    return(

        // импортируем cl(классы,можем по-любому назвать это) из нашего файла Header.module.css,чтобы потом указывать классы через точку типа cl.header(header в данном случае название класса в файле Header.module.css и так указываем остальные классы),но при указании классов таким образом нельзя использовать - (знак минуса,типа черточки),иначе выдает ошибку
        <header className={cl.header}>
            <div className={cl.headerContainer}>
                <div className={cl.header__inner}>
                    <a href="#" className={cl.header__logoLink}>
                        {/* в src(пути картинки) указываем путь из папки images,которую создали в папке public в папке для всего react приложения(сайта),создаем папку images в public,чтобы было удобно сразу указывать путь до картинки, указывая сразу /images и тд */}
                        <img src="/images/header/Group 70.png" alt="" className={cl.header__logoImg} />
                    </a>
                    <ul className={cl.header__menu}>
                        <li className={cl.header__menuItem}>
                            <a href="#" className={cl.header__menuLink}>Home</a>
                        </li>
                        <li className={cl.header__menuItem}>
                            <a href="#" className={cl.header__menuLink}>Catalog</a>
                        </li>
                        <li className={cl.header__menuItem}>
                            <a href="#" className={cl.header__menuLink}>About Us</a>
                        </li>
                        <li className={cl.header__menuItem}>
                            <a href="#" className={cl.header__menuLink}>
                                <img src="/images/header/Vector.png" alt="" className={cl.menuLink__img} />
                            </a>
                        </li>
                        <li className={cl.header__menuItem}>
                            {/* указываем 2 модульных класса таким образом в виде строки с такими ковычками ``,и между ними указываем пробел */}
                            <a href="#" className={`${cl.header__menuLink} ${cl.header__menuLinkCart}`}>
                                <img src="/images/header/Cart.png" alt="" className={cl.menuLink__img} />
                                <span className={cl.menuLink__span}>0</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>

    )

}

export default Header;