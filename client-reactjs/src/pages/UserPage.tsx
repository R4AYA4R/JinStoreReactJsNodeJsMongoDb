import axios from "axios";
import SectionUserPageTop from "../components/SectionUserPageTop";
import UserPageFormComponent from "../components/UserPageFormComponent";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { AuthResponse } from "../types/types";
import $api, { API_URL } from "../http/http";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import AuthService from "../service/AuthService";

const UserPage = () => {

    const [tab, setTab] = useState('Dashboard');

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setLoadingUser, authorizationForUser, logoutUser, setUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    const [inputNameAccSettings, setInputNameAccSettings] = useState('');

    const [inputEmailAccSettings, setInputEmailAccSettings] = useState('');

    const [errorAccSettings, setErrorAccSettings] = useState('');


    const [inputPassCurrent, setInputPassCurrent] = useState('');

    const [inputNewPass, setInputNewPass] = useState('');

    const [inputConfirmPass, setInputConfirmPass] = useState('');


    const [hideInputCurrentPass, setHideInputCurrentPass] = useState(true);

    const [hideInputNewPass, setHideInputNewPass] = useState(true);

    const [hideInputConfirmPass, setHideInputConfirmPass] = useState(true);

    const [errorPassSettings, setErrorPassSettings] = useState('');


    const [inputNameProduct, setInputNameProduct] = useState('');

    const [errorAdminForm, setErrorAdminForm] = useState('');

    const [errorAdminFormForImg, setErrorAdminFormForImg] = useState('');

    const [activeSortBlock, setActiveSortBlock] = useState(false);

    const [sortBlockValue, setSortBlockValue] = useState(''); // состояние для значения селекта сортировки товаров по рейтингу и тд

    const [inputPriceValue, setInputPriceValue] = useState(1);

    const [inputPriceDiscountValue, setInputPriceDiscountValue] = useState(0);

    const [inputFileMainImage, setInputFileMainImage] = useState<File | null>();  // состояние для файла картинки продукта,которые пользователь выберет в инпуте для файлов,указываем тут тип any,чтобы не было ошибки,в данном случае указываем тип как File или null

    const [imgPath, setImgPath] = useState(''); // состояние для пути картинки,который мы получим от сервера,когда туда загрузим картинку(чтобы отобразить выбранную пользователем(админом) картинку уже полученную от сервера, когда туда ее загрузим)

    const newMainProductImage = useRef<HTMLImageElement>(null); // используем useRef для подключения к html тегу картинки нового товара,чтобы взять у него ширину и проверить ее,в generic типе этого useRef указываем,что в этом useRef будет HTMLImageElement(то есть картинка)


    // фукнция для запроса на сервер на изменение информации пользователя в базе данных,лучше описать эту функцию в сервисе(отдельном файле для запросов типа AuthService),например, но в данном случае уже описали здесь,также можно это сделать было через useMutation с помощью react query,но так как мы в данном случае обрабатываем ошибки от сервера вручную,то сделали так
    const changeAccInfoInDb = async (userId: string, name: string, email: string) => {

        return $api.put('/changeAccInfo', { userId, name, email }); // возвращаем put запрос на сервер на эндпоинт /changeAccInfo для изменения данных пользователя и передаем вторым параметром объект с полями,используем здесь наш axios с определенными настройками,которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде,чтобы когда будет ошибка от бэкэнда от authMiddleware,то будет сразу идти повторный запрос на /refresh на бэкэнде для переобновления access токена и refresh токена(refresh и access токен будут обновляться только если текущий refresh токен еще годен по сроку годности,мы это прописали в функции у эндпоинта /refresh на бэкэнде) и опять будет идти запрос на изменение данных пользователя в базе данных(на /changeAccInfo в данном случае) но уже с переобновленным access токеном,который теперь действителен(это чтобы предотвратить доступ к аккаунту мошенникам,если они украли аккаунт,то есть если access токен будет не действителен уже,то будет запрос на /refresh для переобновления refresh и access токенов, и тогда у мошенников уже будут не действительные токены и они не смогут пользоваться аккаунтом,но если текущий refresh токен тоже будет не действителен,то будет ошибка,и пользователь не сможет получить доступ к этой функции(изменения данных пользователя в данном случае),пока заново не войдет в аккаунт)

    }

    // фукнция для запроса на сервер на изменение пароля пользователя в базе данных
    const changePassInDb = async (userId: string, currentPass: string, newPass: string) => {

        return $api.put('/changeAccPass', { userId, currentPass, newPass }); // возвращаем put запрос на сервер на эндпоинт /changeAccPass для изменения данных пользователя и передаем вторым параметром объект с полями,используем здесь наш axios с определенными настройками,которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде,чтобы когда будет ошибка от бэкэнда от authMiddleware,то будет сразу идти повторный запрос на /refresh на бэкэнде для переобновления access токена и refresh токена(refresh и access токен будут обновляться только если текущий refresh токен еще годен по сроку годности,мы это прописали в функции у эндпоинта /refresh на бэкэнде) и опять будет идти запрос на изменение пароля пользователя в базе данных(на /changePass в данном случае) но уже с переобновленным access токеном,который теперь действителен(это чтобы предотвратить доступ к аккаунту мошенникам,если они украли аккаунт,то есть если access токен будет не действителен уже,то будет запрос на /refresh для переобновления refresh и access токенов, и тогда у мошенников уже будут не действительные токены и они не смогут пользоваться аккаунтом,но если текущий refresh токен тоже будет не действителен,то будет ошибка,и пользователь не сможет получить доступ к этой функции(изменения данных пользователя в данном случае),пока заново не войдет в аккаунт)

    }

    const checkAuth = async () => {

        setLoadingUser(true); // изменяем поле isLoading состояния пользователя в userSlice на true(то есть пошла загрузка)

        try {

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse,указываем наш url до нашего роутера(/api) на бэкэнде(API_URL мы импортировали из другого нашего файла) и через / указываем refresh(это тот url,где мы проверяем,валиден(не иссяк ли у него срок годности и тд) ли текущий refresh токен,и если да,то выдаем новые access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });

            console.log(response.data);

            authorizationForUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        } finally {

            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)

        }

    }

    // при запуске сайта(в данном случае при рендеринге этого компонента,то есть этой страницы) будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть,то есть пользователь уже когда-то регистрировался или авторизовывался и у него уже есть refresh токен в cookies
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(user.userName);
        console.log(isAuth);

    }, [])


    // функция для выхода из аккаунта
    const logout = async () => {

        // оборачиваем в try catch,чтобы отлавливать ошибки 
        try {

            await AuthService.logout(); // вызываем нашу функцию logout() у AuthService

            logoutUser(); // вызываем нашу функцию(action) для изменения состояния пользователя для выхода из аккаунта и в данном случае не передаем туда ничего

            setTab('Dashboard'); // изменяем состояние таба на dashboard то есть показываем секцию dashboard(в данном случае главный отдел пользователя),чтобы при выходе из аккаунта и входе обратно у пользователя был открыт главный отдел аккаунта,а не настройки или последний отдел,который пользователь открыл до выхода из аккаунта


            // очищаем поля инпутов форм для изменения данных пользователя
            setInputEmailAccSettings(''); // изменяем состояние инпута почты на пустую строку,чтобы когда пользователь выходил из аккаунта очищался инпут почты,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то в инпуте почты может быть текст,который он до этого там вводил

            setInputNameAccSettings(''); // изменяем состояние инпута имени на пустую строку,чтобы когда пользователь выходил из аккаунта очищался инпут имени,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то в инпуте имени может быть текст,который он до этого там вводил

            setErrorAccSettings(''); // изменяем состояние ошибки формы изменения данных пользователя на пустую строку,чтобы когда пользователь выходил из аккаунта убиралась ошибка,даже если она там была,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то может показываться ошибка,которую пользователь до этого получил


            // изменяем состояния инпутов у формы для изменения пароля пользователя на пустую строку,чтобы когда пользователь выходил из аккаунта очищались эти поля,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то могут остаться те значения в этих инпутах,которые пользователь вводил до этого
            setInputPassCurrent('');
            setInputNewPass('');
            setInputConfirmPass('');

            // изменяем значения состояний для типов инпутов(чтобы менять инпутам тип на password или text при нажатии на кнопку скрытия или показа пароля) у формы для изменения пароля пользователя,чтобы когда пользователь выходил из аккаунта эти состояния опять принимали дефолтное значение(то есть скрывали текст пароля изначально),иначе,когда пользователь выйдет из аккаунта и войдет обратно,то могут по-разному отображаться инпуты для паролей,какие-то скрыты,какие-то открыты,в зависимости от того,что пользователь до этого нажимал
            setHideInputConfirmPass(true);
            setHideInputNewPass(true);
            setHideInputCurrentPass(true);

            setErrorPassSettings(''); // изменяем состояние ошибки формы изменения пароля пользователя на пустую строку,чтобы когда пользователь выходил из аккаунта убиралась ошибка,даже если она там была,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то может показываться ошибка,которую пользователь до этого получил

            // если user.role равно 'ADMIN',то есть роль у пользователя 'ADMIN',то есть пользователь сейчас авторизован как админ,делаем эту проверку,чтобы шел запрос на удаление папки checkStatic только если пользователь авторизован как админ
            if (user.role === 'ADMIN') {

                deleteCheckStatic(); // вызываем нашу функцию для удаления папки checkStatic на бэкэнде,это тестовая папка,которая создается,когда админ выбирает картинки для нового товара,удаляем ее,при редндеринге(запуске) страницы и при изменении состояния пользователя user

            }

        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e 

        }

    }

    // функция для формы изменения имени и почты пользователя,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitAccSettings = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если inputEmailAccSettings true(то есть в inputEmailAccSettings есть какое-то значение) или inputNameAccSettings.trim() не равно пустой строке(то есть в inputNameAccSettings(отфильтрованное по пробелам с помощью trim()) есть какое-то значение), то делаем запрос на сервер для изменения данные пользователя,если же в поля инпутов имени или почты пользователь ничего не ввел,то не будет отправлен запрос
        if (inputEmailAccSettings || inputNameAccSettings.trim() !== '') {

            // оборачиваем в try catch для отлавливания ошибок
            try {

                let name = inputNameAccSettings.trim(); // помещаем в переменную значение инпута имени и убираем у него пробелы с помощю trim() (указываем ей именно let,чтобы можно было изменять ее значение)

                // если name true(то есть в name есть какое-то значение),то изменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,делаем эту проверку,иначе ошибка,так как пользователь может не ввести значение в инпут имени и тогда будет ошибка при изменении первой буквы инпута имени
                if (name) {

                    name = name.replace(name[0], name[0].toUpperCase());  // заменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,чтобы имя начиналось с большой буквы,даже если написали с маленькой

                }

                const response = await changeAccInfoInDb(user.id, name, inputEmailAccSettings); // вызываем нашу функцию запроса на сервер для изменения данных пользователя,передаем туда user.id(id пользователя) и инпуты имени и почты

                setUser(response.data); // изменяем сразу объект пользователя на данные,которые пришли от сервера,чтобы не надо было обновлять страницу для обновления данных


                setErrorAccSettings(''); // изменяем состояние ошибки на пустую строку,то есть убираем ошибку

                setInputEmailAccSettings(''); // изменяем состояние инпута почты на пустую строку,чтобы убирался текст в инпуте почты после успешного запроса

                setInputNameAccSettings(''); // изменяем состояние инпута имени на пустую строку,чтобы убирался текст в инпуте имени после успешного запроса

            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorAccSettings(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка

            }

        }

    }

    // функция для формы изменения пароля пользователя,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitPassSettings = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если инпут текущего пароля равен пустой строке,то показываем ошибку
        if (inputPassCurrent === '') {

            setErrorPassSettings('Enter current password');

        } else if (inputNewPass.length < 3 || inputNewPass.length > 32) {
            // если инпут нового пароля по длине(по количеству символов) меньше 3 или больше 32,то показываем ошибку
            setErrorPassSettings('New password must be 3 - 32 characters');
        } else if (inputNewPass !== inputConfirmPass) {
            // если значение инпута нового пароля не равно значению инпута подтвержденного пароля,то показываем ошибку
            setErrorPassSettings('Passwords don`t match');
        } else {

            // здесь обрабатываем запрос на сервер для изменения пароля пользователя с помощью try catch(чтобы отлавливать ошибки,можно было сделать это с помощью react query,но в данном случае уже сделали так)

            try {

                const response = await changePassInDb(user.id, inputPassCurrent, inputNewPass);  // вызываем нашу функцию запроса на сервер для изменения пароля пользователя,передаем туда user.id(id пользователя) и значения инпутов текущего пароля и нового пароля

                console.log(response.data);

            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorPassSettings(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка

            }

            setErrorPassSettings(''); // изменяем состояние ошибки в форме для изменения пароля пользователя на пустую строку,то есть убираем ошибку 

            // изменяем состояния инпутов на пустые строки(то есть убираем у них значения)
            setInputPassCurrent('');
            setInputNewPass('');
            setInputConfirmPass('');

        }

    }

    // функция для формы админа для создания нового товара,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitAdminForm = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение инпута названия продукта,из которого убрали пробелы с помощью trim() равно пустой строке,то выводим ошибку(то есть если без пробелов это значение равно пустой строке,то показываем ошибку) или если это значение меньше 3
        if (inputNameProduct.trim() === '' || inputNameProduct.length < 3) {

            setErrorAdminForm('Product name must be more than 2 characters');

        } else if (sortBlockValue === '') {
            // если состояние значения селекта категорий равно пустой строке,то показываем ошибку
            setErrorAdminForm('Choose category');

        } else if (inputPriceValue < 1) {
            // если состояние цены нового товара меньше 1,то показываем ошибку
            setErrorAdminForm('Product price must be more than 0');

        } else if (!inputFileMainImage) {
            // если состояние файла false(или null),то есть его(файла) нет,то показываем ошибку,в данном случае указываем ошибку у состояния errorAdminFormForImg,так как разделии состояния ошибок всяких инпутов формы и ошибки,связанные с картинкой для нового товара,так сделали,чтобы правильно обработать ошибки
            setErrorAdminFormForImg('Choose main image');

        } else {



        }

    }

    // функция для удаления файла главной картинки нового товара на сервере,указываем тип imageName как string | undefined,так как иначе показывает ошибку,что нельзя передать параметр этой функции,если значение этого параметра undefined
    const deleteMainImageRequest = async (imageName:string | undefined) => {

        try{

            const response = await axios.delete(`${API_URL}/deleteMainImage/${imageName}`);  // делаем запрос на сервер для удаления файла на сервере и указываем в ссылке на эндпоинт параметр imageName,чтобы на бэкэнде его достать,здесь уже используем обычный axios вместо нашего axios с определенными настройками ($api в данном случае),так как на бэкэнде у этого запроса на удаление файла с сервера уже не проверяем пользователя на access токен,так как проверяем это у запроса на загрузку файла на сервер(поэтому будет и так понятно,валидный(годен ли по сроку годности еще) ли access токен у пользователя или нет)

            console.log(response.data); // выводим в логи ответ от сервера

            setImgPath(''); // изменяем состояние imgPath(пути картинки) на пустую строку,чтобы картинка не показывалась,если она не правильная по размеру и была удалена с сервера(иначе картинка показывается,даже если она удалена с сервера)


        }catch(e:any){

            setErrorAdminFormForImg(e.response?.data?.message); // показываем ошибку в форме создания нового товара для админа

        }

    }

    // при изменении imgPath проверяем ширину и высоту картинки,которую выбрал пользователь(мы помещаем путь до картинки на нашем сервере node js в тег img и к этому тегу img привязали useRef с помощью которого берем ширину и высоту картинки)
    useEffect(() => {

        // используем тут setTimeout(код в этом callback будет выполнен через время,которое указали вторым параметром в setTimeout после запятой,это время указывается в миллисекундах,в данном случае этот код будет выполнен через 0.1 секунду(через 100 миллисекунд)),в данном случае это делаем для того,чтобы успела появится новая картинка,после того,как пользователь ее выбрал в ипнуте файлов,иначе не успевает появиться и показывает ширину картинки как 0
        setTimeout(() => {

            console.log(newMainProductImage.current?.width);
            console.log(newMainProductImage.current?.height);

            // если newProductImage.current true,то есть в этом useRef что-то есть(эта проверка просто потому что этот useRef может быть undefined и выдает ошибку об этом)
            if (newMainProductImage.current) {

                if (newMainProductImage.current.width < 177 || newMainProductImage.current.height < 177) {
                    // если newProductImage.current.width меньше 312(то есть если ширина картинки меньше 312),или если высота картинки меньше 267,то показываем ошибку


                    setErrorAdminFormForImg('Width and height of main image must be more than 176px');

                    setInputFileMainImage(null); // изменяем состояние для инпута файла главной картинки для нового товара,указываем ему значение как null,чтобы если админ получил ошибку,что размер картинки неправильный,то это состояние для файла картинки становилось null,иначе будет идти запрос на сервер,когда состояние файла картинки пустое,и тогда будет ошибка на сервере,что файл картинки пустой

                    // делаем удаление файла(картинки) на сервере,который не правильного размера ширины и высоты,так как если не удалять,а нужна конкретная ширина и высота картинки,то файлы будут просто скачиваться на наш node js сервер и не удаляться,поэтому отдельно делаем запрос на сервер на удаление файла
                    deleteMainImageRequest(inputFileMainImage?.name); // передаем в нашу функцию название файла,который пользователь выбрал в инпуте файлов(мы поместили его в состояние inputFileMainImage),наша функция deleteMainImageRequest делает запрос на сервер на удаление файла картинки и возвращает ответ от сервера(в данном случае при успешном запросе ответ от сервера будет объект с полями)

                }

            }

        }, 100)

    }, [imgPath])

    // функция для выбора картинки с помощью инпута для файлов
    const inputLoadImageHandler = async (e: ChangeEvent<HTMLInputElement>) => {

        // e.target.files - массив файлов,которые пользователь выбрал при клике на инпут для файлов, если e.target.files true(делаем эту проверку,потому что выдает ошибку,что e.target.files может быть null) и e.target.files[0] true,то есть пользователь выбрал файл
        if (e.target.files && e.target.files[0]) {

            setInputFileMainImage(e.target.files[0]); // помещаем в состояние файл,который выбрал пользователь,у files указываем тут [0],то есть берем первый элемент массива(по индексу 0) этих файлов инпута

            const formData = new FormData(); // создаем объект на основе FormData(нужно,чтобы передавать файлы на сервер)

            formData.append('image', e.target.files[0]); // добавляем в этот объект formData по ключу(названию) 'image' сам файл в e.target.files[0] по индексу 0 (первым параметром тут передаем название файла,вторым сам файл)

            console.log(e.target.files[0]);

            // оборачиваем в try catch,чтобы отлавливать ошибки и делаем пока такой запрос на сервер для загрузки файла на сервер,загружаем объект formData(лучше вынести это в отдельную функцию запроса на сервер но и так можно),указываем здесь наш инстанс axios ($api в данном случае),чтобы обрабатывать правильно запросы с access токеном и refresh токеном,в данном случае делаем запрос на бэкэнд для загрузки файла и там сразу будет проверка нашего authMiddleware на нашем node js сервере для проверки на access токен
            try {

                const response = await $api.post(`${API_URL}/uploadFile`, formData); // делаем запрос на сервер для сохранения файла на сервере и как тело запроса тут передаем formData

                console.log(response);

                setImgPath(`http://localhost:5000/${response.data.name}`); // помещаем в состояние imgPath путь до файла,то есть пишем путь до нашего сервера (http://localhost:5000/) в данном случае и добавляем название файла,который нужно показать,который есть в папке (в данном случае static) на нашем сервере,это название пришло от сервера

                setErrorAdminForm(''); // убираем ошибку формы создания нового товара(чтобы если до этого пользователь выбрал неправильный файл и получил ошибку,то при повторном выборе файла эта ошибка убиралась)

                setErrorAdminFormForImg(''); // убираем ошибку(это состояние конкретно для ошибки,связанной с картинкой) формы создания нового товара(чтобы если до этого пользователь выбрал неправильный файл и получил ошибку,то при повторном выборе файла эта ошибка убиралась)

            } catch (e: any) {

                setInputFileMainImage(null); // изменяем состояние файла на null,чтобы если ошибка,то название картинки не показывались

                return setErrorAdminFormForImg(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка

            }

        }

    }

    // функция для удаления папки checkStatic на бэкэнде
    const deleteCheckStatic = async () => {

        // оборачиваем в try catch для обработки ошибок
        try {

            const response = await axios.delete(`${API_URL}/deleteCheckStatic`); // делаем delete запрос на удаление папки checkStatic на бэкэнде,используем здесь обычный axios,а не наш $api(наш инстанс axios с определенными настройками),так здесь не нужна проверка на авторизацию пользователя

            console.log(response);

        } catch (e: any) {

            console.log(e.response?.data?.message);

        }

    }

    // при редндеринге(запуске) страницы и при изменении состояния пользователя user будет отработан код в этом useEffect
    useEffect(() => {

        // если user.role равно 'ADMIN',то есть роль у пользователя 'ADMIN',то есть пользователь сейчас авторизован как админ,делаем эту проверку,чтобы шел запрос на удаление папки checkStatic только если пользователь авторизован как админ
        if (user.role === 'ADMIN') {

            deleteCheckStatic(); // вызываем нашу функцию для удаления папки checkStatic на бэкэнде,это тестовая папка,которая создается,когда админ выбирает картинки для нового товара,удаляем ее,при редндеринге(запуске) страницы и при изменении состояния пользователя user

        }


    }, [user])

    const sortItemHandlerFruitsAndVegetables = () => {

        setSortBlockValue('Fruits & Vegetables'); // изменяем состояние sortBlockValue на значение Fruits & Vegetables

        setActiveSortBlock(false); // изменяем состояние activeSortBlock на значение false,то есть убираем появившийся селект блок

    }

    const sortItemHandlerBeverages = () => {

        setSortBlockValue('Beverages'); // изменяем состояние sortBlockValue на значение Beverages

        setActiveSortBlock(false); // изменяем состояние activeSortBlock на значение false,то есть убираем появившийся селект блок

    }

    const sortItemHandlerMeatsAndSeafood = () => {

        setSortBlockValue('Meats & Seafood'); // изменяем состояние sortBlockValue на значение Meats & Seafood

        setActiveSortBlock(false); // изменяем состояние activeSortBlock на значение false,то есть убираем появившийся селект блок

    }

    const sortItemHandlerBreadsAndBakery = () => {

        setSortBlockValue('Breads & Bakery'); // изменяем состояние sortBlockValue на значение Breads & Bakery

        setActiveSortBlock(false); // изменяем состояние activeSortBlock на значение false,то есть убираем появившийся селект блок

    }

    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputPriceValue = (e: ChangeEvent<HTMLInputElement>) => {

        // здесь нужно убирать ошибку формы

        // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
        if (+e.target.value <= 0) {

            setInputPriceValue(0);

        } else {

            setInputPriceValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusAmountBtn = () => {

        // здесь нужно еще убирать ошибку формы

        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля или 1 не отнимало - 1
        if (inputPriceValue > 1) {

            setInputPriceValue((prev) => prev - 1);

        } else {

            setInputPriceValue(1);

        }

    }

    const handlerPlusAmountBtn = () => {

        // здесь нужно убирать ошибку формы

        // изменяем текущее значение инпута цены на + 1
        setInputPriceValue((prev) => prev + 1);



    }


    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputPriceDiscountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // здесь нужно убирать ошибку формы

        // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
        if (+e.target.value <= 0) {

            setInputPriceDiscountValue(0);

        } else {

            setInputPriceDiscountValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusAmountBtnDiscount = () => {

        // здесь нужно еще убирать ошибку формы

        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 0,чтобы после нуля не отнимало - 1
        if (inputPriceDiscountValue > 1) {

            setInputPriceDiscountValue((prev) => prev - 1);

        } else {

            setInputPriceDiscountValue(0);

        }

    }

    const handlerPlusAmountBtnDiscount = () => {

        // здесь нужно убирать ошибку формы

        // изменяем текущее значение инпута цены на + 1
        setInputPriceDiscountValue((prev) => prev + 1);



    }

    // если состояние загрузки true,то есть идет загрузка запроса на сервер для проверки,авторизован ли пользователь,то показываем лоадер(загрузку),если не отслеживать загрузку при функции checkAuth(для проверки на refresh токен при запуске страницы),то будет не правильно работать(только через некоторое время,когда запрос на /refresh будет отработан,поэтому нужно отслеживать загрузку и ее возвращать как разметку страницы,пока грузится запрос на /refresh)
    if (isLoading) {

        // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
        return (
            <main className="main">
                <div className="container">
                    <div className="innerForLoader">
                        <div className="loader"></div>
                    </div>
                </div>
            </main>
        )

    }

    // если isAuth false,то есть пользователь не авторизован(когда возвращается ошибка от сервера от эндпоинта /refresh в функции checkAuth,то isAuth становится типа false,и тогда пользователя типа выкидывает из аккаунта,то есть в данном случае возвращаем компонент формы регистрации и авторизации),то возвращаем компонент формы,вместо страницы пользователя,когда пользотватель логинится и вводит правильно данные,то эта проверка на isAuth тоже работает правильно и если данные при логине были введены верно,то сразу показывается страница пользователя(даже без использования отдельного useEffect)
    if (!isAuth) {

        return (
            <main className="main">

                <SectionUserPageTop />

                <UserPageFormComponent />

            </main>
        )

    }

    return (
        <main className="main">

            <SectionUserPageTop />

            <section className="sectionUserPage">
                <div className="container">
                    <div className="sectionUserPage__inner">
                        <div className="sectionUserPage__leftBar">
                            <ul className="sectionUserPage__leftBar-menu">
                                <li className="sectionUserPage__menu-item">
                                    <button className={tab === 'Dashboard' ? "sectionUserPage__menu-btn sectionUserPage__menu-btnDashboard sectionUserPage__menu-btn--active" : "sectionUserPage__menu-btn sectionUserPage__menu-btnDashboard"} onClick={() => setTab('Dashboard')}>
                                        <img src="/images/sectionUserPage/dashboard 2.png" alt="" className="sectionUserPage__menu-btnImg" />
                                        <p className="sectionUserPage__menu-btnText">Dashboard</p>
                                    </button>
                                </li>

                                {/* если user.role === 'USER'(то есть если роль пользователя равна "USER"),то показываем таб с настройками профиля пользователя */}
                                {user.role === 'USER' &&

                                    <li className="sectionUserPage__menu-item">
                                        <button className={tab === 'Account Settings' ? "sectionUserPage__menu-btn sectionUserPage__menu-btn--active" : "sectionUserPage__menu-btn"} onClick={() => setTab('Account Settings')}>
                                            <img src="/images/sectionUserPage/dashboard 2 (1).png" alt="" className="sectionUserPage__menu-btnImg" />
                                            <p className="sectionUserPage__menu-btnText">Account Settings</p>
                                        </button>
                                    </li>

                                }

                                {/* если user.role === "ADMIN"(то есть если роль пользователя равна "ADMIN"),то показываем таб с панелью администратора */}
                                {user.role === 'ADMIN' &&

                                    <li className="sectionUserPage__menu-item">
                                        <button className={tab === 'Admin Panel' ? "sectionUserPage__menu-btn sectionUserPage__menu-btn--active" : "sectionUserPage__menu-btn"} onClick={() => setTab('Admin Panel')}>
                                            <img src="/images/sectionUserPage/dashboard 2 (1).png" alt="" className="sectionUserPage__menu-btnImg" />
                                            <p className="sectionUserPage__menu-btnText">Admin Panel</p>
                                        </button>
                                    </li>

                                }


                            </ul>

                            <div className="sectionUserPage__menu-item">
                                <button className="sectionUserPage__menu-btn sectionUserPage__menu-btnLogout" onClick={logout}>
                                    <img src="/images/sectionUserPage/dashboard 2 (2).png" alt="" className="sectionUserPage__menu-btnImg" />
                                    <p className="sectionUserPage__menu-btnText">Logout</p>
                                </button>
                            </div>
                        </div>
                        <div className="sectionUserPage__mainBlock">

                            {tab === 'Dashboard' &&
                                <div className="sectionUserPage__mainBlock-inner">
                                    <div className="sectionUserPage__mainBlock-dashboard">
                                        <img src="/images/sectionUserPage/Ellipse 5.png" alt="" className="sectionUserPage__dashboard-img" />
                                        <h3 className="sectionUserPage__dashboard-title">{user.userName}</h3>
                                        <p className="sectionUserPage__dashboard-text">{user.email}</p>

                                        {/* если user.role === 'USER'(то есть если роль пользователя равна "USER"),то показываем кнопку, по которой можно перейти в настройки аккаунта пользователя*/}
                                        {user.role === 'USER' &&
                                            <button className="sectionUserPage__dashboard-btn" onClick={() => setTab('Account Settings')}>Edit Profile</button>
                                        }

                                        {/* если user.role === "ADMIN"(то есть если роль пользователя равна "ADMIN"),то показываем кнопку,по которой можно перейти в админ панель */}
                                        {user.role === 'ADMIN' &&
                                            <button className="sectionUserPage__dashboard-btn" onClick={() => setTab('Admin Panel')}>Go to Admin Panel</button>
                                        }


                                    </div>
                                </div>
                            }

                            {/* если user.role === 'USER'(то есть если роль пользователя равна "USER") и tab === 'Account Settings',то показываем таб с настройками профиля пользователя */}
                            {user.role === 'USER' && tab === 'Account Settings' &&
                                <div className="sectionUserPage__mainBlock-inner sectionUserPage__mainBlock-accSettings">
                                    <form className="sectionUserPage__mainBlock-formInfo" onSubmit={onSubmitAccSettings}>
                                        <h2 className="sectionUserPage__formInfo-title">Account Settings</h2>
                                        <div className="sectionUserPage__formInfo-main">
                                            <div className="sectionUserPage__formInfo-item">
                                                <p className="sectionUserPage__formInfo-itemText">Name</p>
                                                <input type="text" className="sectionUserPage__formInfo-itemInput" placeholder={`${user.userName}`} value={inputNameAccSettings} onChange={(e) => setInputNameAccSettings(e.target.value)} />
                                            </div>
                                            <div className="sectionUserPage__formInfo-item">
                                                <p className="sectionUserPage__formInfo-itemText">Email</p>
                                                <input type="text" className="sectionUserPage__formInfo-itemInput" placeholder={`${user.email}`} value={inputEmailAccSettings} onChange={(e) => setInputEmailAccSettings(e.target.value)} />
                                            </div>

                                            {/* если errorAccSettings true(то есть в состоянии errorAccSettings что-то есть),то показываем текст ошибки */}
                                            {errorAccSettings && <p className="formErrorText">{errorAccSettings}</p>}

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button className="sectionUserPage__formInfo-btn" type="submit">Save Changes</button>

                                        </div>
                                    </form>

                                    <form className="sectionUserPage__mainBlock-formInfo sectionUserPage__formPassSettings" onSubmit={onSubmitPassSettings}>
                                        <h2 className="sectionUserPage__formInfo-title">Change Password</h2>
                                        <div className="sectionUserPage__formInfo-main">
                                            <div className="sectionUserPage__formInfo-item signInMainForm__inputEmailBlock">
                                                <p className="sectionUserPage__formInfo-itemText">Current Password</p>

                                                {/* если состояние hideInputCurrentPass true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                                <input type={hideInputCurrentPass ? "password" : "text"} className="sectionUserPage__formInfo-itemInput" placeholder='Current Password' value={inputPassCurrent} onChange={(e) => setInputPassCurrent(e.target.value)} />
                                                <button className="inputEmailBlock__btn sectionUserPage__formPassSettings-hideBtn" type="button" onClick={() => setHideInputCurrentPass((prev) => !prev)}>
                                                    <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMainForm__inputEmailBlock-imgHide" />
                                                </button>
                                            </div>
                                            <div className="sectionUserPage__formInfo-item signInMainForm__inputEmailBlock">
                                                <p className="sectionUserPage__formInfo-itemText">New Password</p>
                                                <input type={hideInputNewPass ? "password" : "text"} className="sectionUserPage__formInfo-itemInput" placeholder='New Password' value={inputNewPass} onChange={(e) => setInputNewPass(e.target.value)} />
                                                <button className="inputEmailBlock__btn sectionUserPage__formPassSettings-hideBtn" type="button" onClick={() => setHideInputNewPass((prev) => !prev)}>
                                                    <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMainForm__inputEmailBlock-imgHide" />
                                                </button>
                                            </div>
                                            <div className="sectionUserPage__formInfo-item signInMainForm__inputEmailBlock">
                                                <p className="sectionUserPage__formInfo-itemText">Confirm Password</p>
                                                <input type={hideInputConfirmPass ? "password" : "text"} className="sectionUserPage__formInfo-itemInput" placeholder='Confirm Password' value={inputConfirmPass} onChange={(e) => setInputConfirmPass(e.target.value)} />
                                                <button className="inputEmailBlock__btn sectionUserPage__formPassSettings-hideBtn" type="button" onClick={() => setHideInputConfirmPass((prev) => !prev)}>
                                                    <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMainForm__inputEmailBlock-imgHide" />
                                                </button>
                                            </div>

                                            {/* если errorPassSettings true(то есть в состоянии errorPassSettings что-то есть),то показываем текст ошибки */}
                                            {errorPassSettings && <p className="formErrorText">{errorPassSettings}</p>}

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button className="sectionUserPage__formInfo-btn" type="submit">Change Password</button>

                                        </div>
                                    </form>

                                </div>
                            }

                            {/* если user.role === "ADMIN"(то есть если роль пользователя равна "ADMIN") и tab === 'Admin Panel',то показываем таб с панелью администратора */}
                            {user.role === 'ADMIN' && tab === 'Admin Panel' &&
                                <div className="sectionUserPage__mainBlock-inner sectionUserPage__mainBlock-accSettings">

                                    <form className="sectionUserPage__mainBlock-formInfo" onSubmit={onSubmitAdminForm}>
                                        <h2 className="sectionUserPage__formInfo-title">New Product</h2>
                                        <div className="sectionUserPage__formInfo-main">
                                            <div className="sectionUserPage__formInfo-item">
                                                <p className="sectionUserPage__formInfo-itemText">Name</p>
                                                <input type="text" className="sectionUserPage__formInfo-itemInput" placeholder="Name" value={inputNameProduct} onChange={(e) => setInputNameProduct(e.target.value)} />
                                            </div>
                                            <div className="sectionUserPage__formInfo-item sectionUserPage__formInfo-itemCategoryBlock">
                                                <div className="searchBlock__sortBlock">
                                                    <p className="sortBlock__text adminForm__categoryBlock-text">Category:</p>
                                                    <div className="sortBlock__inner">
                                                        <div className="sortBlock__topBlock" onClick={() => setActiveSortBlock((prev) => !prev)}>
                                                            {/* если sortBlockValue true,то есть если в sortBlockValue есть какое-то значение,то указываем такие классы,в другом случае другие,в данном случае делаем это для анимации появления текста */}
                                                            <p className={sortBlockValue ? "sortBlock__topBlock-text sortBlock__topBlock-text--active" : "sortBlock__topBlock-text"}>{sortBlockValue}</p>
                                                            <img src="/images/sectionCatalog/ArrowDown.png" alt="" className={activeSortBlock ? "sortBlock__topBlock-img sortBlock__topBlock-img--active" : "sortBlock__topBlock-img"} />
                                                        </div>
                                                        <div className={activeSortBlock ? "sortBlock__optionsBlock sortBlock__optionsBlock--active sortBlock__optionsBlockAdminForm--active" : "sortBlock__optionsBlock"}>
                                                            <div className="sortBlock__optionsBlock-item" onClick={sortItemHandlerFruitsAndVegetables}>
                                                                <p className="optionsBlock__item-text">Fruits & Vegetables</p>
                                                            </div>
                                                            <div className="sortBlock__optionsBlock-item" onClick={sortItemHandlerBeverages}>
                                                                <p className="optionsBlock__item-text">Beverages</p>
                                                            </div>
                                                            <div className="sortBlock__optionsBlock-item" onClick={sortItemHandlerMeatsAndSeafood}>
                                                                <p className="optionsBlock__item-text">Meats & Seafood</p>
                                                            </div>
                                                            <div className="sortBlock__optionsBlock-item" onClick={sortItemHandlerBreadsAndBakery}>
                                                                <p className="optionsBlock__item-text">Breads & Bakery</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sectionUserPage__formInfo-item sectionUserPage__adminForm-inputBlockMain">
                                                <div className="sectionProductItemPage__infoBlock-inputBlock sectionUserPage__adminForm-inputBlock">
                                                    <p className="sectionUserPage__formInfo-itemText">Price</p>
                                                    <div className="infoBlock__inputBlock-leftInputBlock">
                                                        {/* указываем этой кнопке тип button(type="button"),чтобы при нажатии на нее не отправлялась эта форма(для создания нового товара),указываем тип submit только одной кнопке формы,по которой она должна отправляться(то есть при нажатии на которую должен идти запрос на сервер для создания нового товара),всем остальным кнопкам формы указываем тип button */}
                                                        <button type="button" className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                                                            <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                                                        </button>
                                                        <input type="number" className="infoBlock__inputBlock-input" value={inputPriceValue} onChange={changeInputPriceValue} />
                                                        <button type="button" className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                                                            <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="sectionProductItemPage__infoBlock-inputBlock sectionUserPage__adminForm-inputBlock">
                                                    <p className="sectionUserPage__formInfo-itemText">Price with Discount</p>
                                                    <div className="infoBlock__inputBlock-leftInputBlock infoBlock__inputBlock-leftInputBlockAdminForm">
                                                        <button type="button" className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtnDiscount}>
                                                            <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                                                        </button>
                                                        <input type="number" className="infoBlock__inputBlock-input" value={inputPriceDiscountValue} onChange={changeInputPriceDiscountValue} />
                                                        <button type="button" className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtnDiscount}>
                                                            <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="sectionUserPage__adminForm-loadImageBlock">
                                                <h3 className="adminForm__loadImageBlock-title">Main Image</h3>

                                                {/* если imgPath не равно пустой строке,то показываем картинку */}
                                                {imgPath !== '' &&

                                                    <div className="adminForm__imageBlock">
                                                        <img src={imgPath} alt="" className="adminForm__imageBlock-previewImg" ref={newMainProductImage} />
                                                        <p className="adminForm__imageBlock-previewImgText">{inputFileMainImage?.name}</p> {/* указываем название файла у состояния inputFile у поля name,указываем здесь ? перед name,так как иначе ошибка,что состояние inputFile может быть undefined */}
                                                    </div>

                                                }

                                                <label htmlFor="inputFileImage" className="adminForm__loadImageBlock-label">
                                                    Load Image

                                                    {/* указываем multiple этому инпуту для файлов,чтобы можно было выбирать несколько файлов одновременно для загрузки(в данном случае убрали multiple,чтобы был только 1 файл),указываем accept = "image/*",чтобы можно было выбирать только изображения любого типа */}
                                                    <input id="inputFileImage" type="file" className="adminForm__loadImageBlock-input" accept="image/*" onChange={inputLoadImageHandler} />
                                                </label>
                                            </div>





                                            {/* <div className="sectionUserPage__adminForm-loadImageBlock">
                                                <h3 className="adminForm__loadImageBlock-title">Description Images</h3>
                                                <label htmlFor="inputFileImage" className="adminForm__loadImageBlock-label">
                                                    Load Images

                                                    {/* указываем multiple этому инпуту для файлов,чтобы можно было выбирать несколько файлов одновременно для загрузки(в данном случае убрали multiple,чтобы был только 1 файл),указываем accept = "image/*",чтобы можно было выбирать только изображения любого типа 
                                                    <input id="inputFileImage" type="file" className="adminForm__loadImageBlock-input" accept="image/*" />
                                                </label>
                                            </div> */}

                                            {/* <div className="adminForm__imageBlock">
                                                <img src="" alt="" className="adminForm__imageBlock-previewImg" />
                                                <p className="adminForm__imageBlock-previewImgText">name</p> {/* указываем название файла у состояния inputFile у поля name,указываем здесь ? перед name,так как иначе ошибка,что состояние inputFile может быть undefined 
                                            </div> */}

                                            {/* если errorAdminForm true(то есть в состоянии errorAdminForm что-то есть),то показываем текст ошибки */}
                                            {errorAdminForm && <p className="formErrorText">{errorAdminForm}</p>}

                                            {/* если errorAdminFormForImg true(то есть в состоянии errorAdminFormForImg что-то есть),то показываем текст ошибки */}
                                            {errorAdminFormForImg && <p className="formErrorText">{errorAdminFormForImg}</p>}


                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button className="sectionUserPage__formInfo-btn" type="submit">Save Product</button>

                                        </div>
                                    </form>

                                </div>
                            }

                        </div>
                    </div>
                </div>
            </section>

        </main>
    )


}

export default UserPage;