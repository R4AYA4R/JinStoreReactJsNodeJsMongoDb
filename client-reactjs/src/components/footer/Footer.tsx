
import cl from './Footer.module.css'; // импортируем cl(классы,можем по-любому назвать это) из нашего файла Footer.module.css,чтобы потом указывать классы через точку типа cl.footer(footer в данном случае название класса в файле Footer.module.css и так указываем остальные классы)

const Footer = () => {

    return(
        <footer className={cl.footer}>
            <div className={cl.footer__container}>
                <div className={cl.footer__inner}>
                    <div className={cl.footer__topBlock}>
                        <div className={cl.topBlock__leftBlock}>
                            <h3 className={cl.leftBlock__title}>Do You Need Help ?</h3>
                            <p className={cl.leftBlock__text}>Autoseligen syr. Nek diarask frobomba. Ner
                            antipol kynoda nynat. Pressa famoska.</p>
                            <div className={cl.leftBlock__infoItem}>
                                <img src="/images/footer/phoneImg.png" alt="" className={cl.infoItem__img} />
                                <div className={cl.infoItem__infoBlock}>
                                    <p className={cl.infoItem__text}>Monday-Friday: 08am-9pm</p>
                                    {/* для ссылки на номер телефона,в href нужно указывать tel: и без пробела номер телефона,чтобы сразу типа звонить по нему,но в данном случае указываем пока так */}
                                    <a href="#" className={cl.infoItem__link}>0 800 300-353</a>
                                </div>
                            </div>
                            <div className={cl.leftBlock__infoItem}>
                                <img src="/images/footer/mailImg.png" alt="" className={cl.infoItem__img} />
                                <div className={cl.infoItem__infoBlock}>
                                    <p className={cl.infoItem__text}>Need help with your order?</p>
                                    {/* для ссылки на почту,в href нужно указывать mailto: и без пробела почту,чтобы сразу типа писать туда,но в данном случае указываем пока так */}
                                    <a href="#" className={cl.infoItem__link}>info@example.com</a>
                                </div>
                            </div>
                        </div>
                        <div className={cl.topBlock__mainBlock}>
                            <ul className={cl.mainBlock__list}>
                                <h3 className={cl.list__title}>Make Money with Us</h3>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Sell on JinStore</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Become an Affilate</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Advertise Your Products</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Sell-Publish with Us</a>
                                </li>
                            </ul>
                            <ul className={cl.mainBlock__list}>
                                <h3 className={cl.list__title}>Let Us Help You</h3>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Accessibility Statement</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Returns & Replacements</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Shipping Rates & Policies</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Privacy Policy</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Terms and Conditions</a>
                                </li>
                            </ul>
                            <ul className={cl.mainBlock__list}>
                                <h3 className={cl.list__title}>Get to Know Us</h3>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Careers for JinStore</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>About JinStore</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Customer reviews</a>
                                </li>
                                <li className={cl.list__item}>
                                    <a href="#" className={cl.list__link}>Social Responsibility</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={cl.footer__bottomBlock}>
                        <p className={cl.bottomBlock__text}>Copyright 2024 © Jinstore WooCommerce WordPress Theme. All right reserved. Powered by BlackRise Themes.</p>
                    </div>
                </div>
            </div>
        </footer>
    )

}

export default Footer;