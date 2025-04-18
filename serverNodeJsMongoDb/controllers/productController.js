import productModel from "../models/productModel.js"; // указываем здесь вручную расширение файла .js,иначе выдает ошибку,что не может найти файл

import commentModel from "../models/commentModel.js";
import cartProductModel from "../models/cartProductModel.js";

class ProductController {

    // первым параметром эти функции принимают req(запрос),а вторым параметром res(ответ),третьим параметром передаем функцию next(следующий по цепочке middleware,в данном случае это наш errorMiddleware)
    async getProducts(req, res, next) {

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)

        const { limit, skip } = req.query; // берем из параметров запроса поля limit и skip

        // оборачиваем в try catch для обработки ошибок
        try {

            const products = await productModel.find().limit(limit).skip(skip); // находим объекты всех блюд в базе данных mongodb с помощью метода find() у модели(схемы) productModel(модель товара), через точку указываем метод limit() и передаем в него значение лимита,в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем в методах limit и skip значения query параметров limit и skip,которые взяли из url(передали их с фронтенда) 

            console.log(products);

            return res.json(products); // возвращаем на клиент массив объектов товаров

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    // создаем функцию для получения товаров для каталога
    async getProductsCatalog(req, res, next) {

        let { limit, page, name, category, minPrice, maxPrice, sortBy } = req.query; // берем из параметров запроса поля category и тд,указываем здесь let,чтобы  можно было изменять значения этих параметров(переменных),в данном случае это надо для limit и page,также берем параметр sort(в нем будет название поля,по которому нужно сортировать,это мы передаем с фронтенда),берем поле name,чтобы искать объекты блюд по этому полю name для поиска, берем поле minPrice(минимальное значение фильтра цены) и maxPrice(максимальное значение фильтра цены),чтобы фильтровать объекты товаров по цене


        // оборачиваем в try catch для обработки ошибок
        try {

            let categoryObj; // указываем переменную для объекта категории,указываем ей let,чтобы потом изменять ее значение

            let priceObj; // указываем переменную для объекта цены,указываем ей let,чтобы потом изменять ее значение

            let sortedObj; // указываем переменную для объекта цены,указываем ей let,чтобы потом изменять ее значение

            page = page || 1; // указываем значение переменной page как параметр,который взяли из строки запроса,если он не указан,то делаем значение 1 

            limit = limit || 2; // указываем значение переменной limit как параметр,который взяли из строки запроса,если он не указан,то делаем значение 2

            let offset = page * limit - limit; // считаем отступ,допустим перешли на вторую страницу и первые 3 товара нужно пропустить(в данном случае это limit),поэтому умножаем page(текущую страницу) на limit и отнимаем лимит(чтобы правильно считались страницы,и показывалась последняя страница с товарами,если не отнять,то на последней странице товаров не будет,так как будет указано пропустить все объекты товаров из базы данных,прежде чем начать отправлять их),то есть offset считает,сколько нужно пропустить объектов до того,как отправлять объекты(например всего товаров 12, текущая страница 3,лимит 3, соответственно 3 * 3 - 3 будет 6,то есть 6 товаров пропустятся,на следующей странице(4) будет уже пропущено 4 * 3 - 3 равно 9(то есть 9 товаров пропущено будет), offset указывает пропустить указанное число строк(объектов в таблице в базе данных), прежде чем начать выдавать строки(объекты) )


            const allProductsPrice = []; // переменная для массива всех цен товаров

            const allProductsForPrice = await productModel.find(); // находим все объекты товаров с помощью find() у productModel и помещаем их в переменную allProductsForPrice

            // проходимся по массиву всех объектов товаров allProductsForPrice и на каждой итерации(то есть для каждого объекта) помещаем в массив allProductsPrice цену каждого товара(product.price)
            allProductsForPrice.forEach(product => {

                allProductsPrice.push(product.price);

            })

            const maxPriceAllProducts = Math.max(...allProductsPrice); // указываем значение переменной maxPriceAllProducts как максимальное значение из всех цен товаров,Math.max() - выбирает максимальное значение из чисел,в данном случае в Math.max() разворачиваем массив allProductsPrice,то есть вместо него будут подставлены все значения(элементы),которые есть в этом массиве

            minPrice = minPrice || 0;  // указываем значение полю minPrice как значение этого же поля minPrice или 0,то есть если minPrice true(то есть в нем есть какое-то значение,которые мы получили от фронтенда),то указываем значение ему его же(minPrice),в другом случае,если значение этому полю minPrice не указано с фронтенда,то указываем ему значение 0(дефолтное значение,когда нету фильтра цены),указываем конкретно другое значение (0 в данном случае),даже если с фронтенда его не указали,иначе не будет выполняться правильно условие для сортировки объектов товаров по цене

            maxPrice = maxPrice || maxPriceAllProducts; // указываем значение полю maxPrice как значение этого же поля maxPrice или maxPriceAllProducts(то есть максимальное значение цены товара,которое мы посчитали и поместили в переменную maxPriceAllProducts),то есть если maxPrice true(то есть в нем есть какое-то значение,которые мы получили от фронтенда),то указываем значение ему его же(maxPrice),в другом случае,если значение этому полю maxPrice не указано с фронтенда,то указываем ему значение maxPriceAllProducts(дефолтное значение,когда нету фильтра цены),указываем конкретно другое значение (maxPriceAllProducts в данном случае),даже если с фронтенда его не указали,иначе не будет выполняться правильно условие для сортировки объектов товаров по цене


            // если category true(то есть в параметре category есть какое-то значение,то указываем значение переменной categoryObj как объект с полем category и значением параметра category(который мы взяли из url),в другом случае указываем значение переменной categoryObj как null,это делаем,чтобы проверить,указана ли category,и если нет,то указываем этой переменной значение null,и потом эту переменную(этот объект) categoryObj разворачиваем в условии для получения объектов товаров из базы данных mongodb ниже в коде)
            if (category) {

                categoryObj = {
                    category: category
                }

            } else {

                categoryObj = null;

            }


            // если minPrice больше 0, или maxPrice меньше maxPriceAllProducts(то есть дефолтное максимальное значение цены товара,которое мы посчитали и поместили в переменную maxPriceAllProducts),то есть эти поля не равны своим первоначальным значениям,то есть когда пользователь указал фильтр цены,то указываем значение переменной priceObj(то есть ставим фильтр полю price у объекта товара,то есть делаем фильтр цены),в другом случае указываем значение priceObj как null,чтобы этот фильтр не применялся(чтобы если фильтра цены нет,то вместо priceObj был null,когда его разворачиваем в условии для получения объектов товаров ниже в коде),и потом эту переменную(этот объект) priceObj разворачиваем в условии для получения объектов товаров из базы данных mongodb ниже в коде)
            if (minPrice > 0 || maxPrice < maxPriceAllProducts) {

                priceObj = {

                    // $and соединяет два условия,оба которых должны выполниться,то есть оператор и, $gte - оператор больше или равно, $lte - оператор меньше или равно,то есть сортируем объеты по полю price(по цене)
                    $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }]

                }

            } else {

                priceObj = null;

            }


            // если sortBy равно 'rating',то есть пользователь на фронтенде выбрал сортировку по рейтингу
            if (sortBy === 'rating') {

                // указываем значение переменной sortedObj(объект для сортировки полей)
                sortedObj = {

                    rating: -1,

                    _id: 1

                } // вместо sort будет подставлено название поля,по которому нужно сортировать(это мы передали с фронтенда),а вместо order будет подставлен метод сортировки,например -1(сортировка по убыванию),или 1(сортировка по возрастанию),это мы передали с фронтенда, если нужно сортировать объекты товаров по нескольким полям,то можно просто их указывать через запятую в этом объекте, указываем поле _id(сортируем объекты по их id) и значение 1(сортировка по возрастанию, в данном случае можно поставить и -1,то есть сортировка по убыванию,оно тоже будет нормально работать(просто объекты будут в другом порядке,но это подойдет) или еще можно указать сортировку по полю name(со значениями тоже 1 или -1,оно тоже будет работать) вместо сортировки по _id,но главное поставить эту сортировку по _id или name),чтобы если значение рейтинга у объектов одинаковое,то они не дублировались и правильно отображались,если не указать еще сортировку по _id,то объекты с одинаковыми значениями поля рейтинга будут дублироваться и не правильно отображаться

            } else {

                sortedObj = null; // если условие выше не выполнилось,то есть параметр sort и order не true(то есть в них нету значения),то указываем значение переменной sortedObj(объект для сортировки полей) как null,делаем так,так как будем разворачивать объект sortedObj в метод sort() для сортировки полей товаров,и если этот объект будет со значением null,то сортировка не будет работать,но таким образом можно указать динамически этот объект,то есть если пользователь выберет сортировку товаров по какому-нибудь полю на фронтенде,то она будет работать,а если не выберет,то не будет работать,если не проверять так этот объект на условие если sort && order true,а просто в методе sort() сразу указать объект {sort:order},то будет ошибка,если в этих параметрах sort и order не будет значения

            }


            const allProducts = await productModel.find({

                name: { $regex: `${name}`, $options: 'i' },

                ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено category:category(то есть ищем объекты,у которых поле category равно параметру category,который взяли из url с фронтенда),если проверка выше на category была true,если была false,то тут будет null)

                ...priceObj

            }); // ищем все объекты товаров в базе данных,чтобы отправить их на клиент и потом получить число сколько всего товаров в базе данных,для пагинации,а в переменную products поместим уже конкретно объекты товаров на отдельной странице пагинации,в find() в объекте указываем поле name(по нему будем делать поиск объектов блюд) и указываем через двоеточие объект, указываем поле $regex(по какому значению будем делать поиск по полю name,в данном случае указываем значение как `${name}` параметр,который взяли с фронтенда) и через запятую указываем поле $options(в нем указываем опции для поиска,то есть игнорировать ли пробелы в строке поиска,чувствительный регистр букв или нет(учитывать разницу больших букв и маленьких) и тд), в $options значение i указывает,что регистр букв не чувствительный,то есть можно писать в поиске маленькими буквами,а будут находиться названия с большими такими же буквами и наоборот, значение x указывает,игнорировать ли пробелы в поиске и символ решетки(#),эти значение типа i и x нужно писать вместе('ix'),чтобы они работали,также есть и другие опции типа этих,если они нужны,то их также нужно указывать вместе,без пробела,в данном случае используем опцию только i


            const products = await productModel.find({

                name: { $regex: `${name}`, $options: 'i' },

                ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено category:category(то есть ищем объекты,у которых поле category равно параметру category,который взяли из url с фронтенда),если проверка выше на category была true,если была false,то тут будет null)

                ...priceObj

            }).sort({ ...sortedObj }).limit(limit).skip(offset); // находим объекты всех товаров в базе данных mongodb с помощью метода find() у модели(схемы) productModel(модель товара), через точку указываем метод limit() и передаем в него значение лимита,в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb,в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем значение переменной offset, в find() в объекте указываем поле name(по нему будем делать поиск объектов товаров) и указываем через двоеточие объект, указываем поле $regex(по какому значению будем делать поиск по полю name,в данном случае указываем значение как `${name}` параметр,который взяли с фронтенда) и через запятую указываем поле $options(в нем указываем опции для поиска,то есть игнорировать ли пробелы в строке поиска,чувствительный регистр букв или нет(учитывать разницу больших букв и маленьких) и тд), в $options значение i указывает,что регистр букв не чувствительный,то есть можно писать в поиске маленькими буквами,а будут находиться названия с большими такими же буквами и наоборот, значение x указывает,игнорировать ли пробелы в поиске и символ решетки(#),эти значение типа i и x нужно писать вместе('ix'),чтобы они работали,также есть и другие опции типа этих,если они нужны,то их также нужно указывать вместе,без пробела,в данном случае используем опцию только i, указываем метод sort() для сортировки объектов,указываем в нем объект,в который разворачиваем наш объект sortedObj(вместо него будут подставлены поля,которые нужно сортировать,и значения сортировки этих полей,или же будет подставлен null,если параметры sort и order не будут иметь значения(если с фронтенда не передали значения в них))

            console.log(products);

            return res.json({ allProducts, products, maxPriceAllProducts }); // возвращаем на клиент объект с полями массива объектов товаров products,массива объектов allProducts и переменную maxPriceAllProdcuts(то есть максимальное значение цены товара,которое мы посчитали и поместили в переменную maxPriceAllProducts),указываем это в объекте,так как передаем уже 2 массива и еще одно поле maxPriceAllProducts

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    // функция для получения блюда по id
    async getProductId(req, res, next) {

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)

        const { id } = req.params; // берем из параметров запроса поле id

        // оборачиваем в try catch для обработки ошибок
        try {

            const product = await productModel.findById(id); // находим объект товара по id,который мы передали с фронтенда с помощью функции findById

            return res.json(product); // возвращаем на клиент объект товара

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    async updateProductRating(req, res, next) {

        // оборачиваем в try catch для обработки ошибок
        try {

            const product = req.body;  // достаем из тела запроса весь объект запроса со всеми полями,которые мы передали с фронтенда(не используем здесь деструктуризацию типа деструктурировать из req.body {product} в квадратных скобках,так как просто берем все тело запроса,то есть весь объект тела запроса,а не отдельные поля)

            const productFounded = await productModel.findById(product._id); // находим товар по _id(указываем нижнее подчеркивание _ перед id,так как id объектов в базе данных mongodb по дефолту указываются с нижним подчеркиванием),который равен _id у product(то есть весь объект тела запроса)

            productFounded.rating = product.rating; // изменяем поле rating у найденного объекта товара в базе данных(productFounded) на значение поля rating у product(объект тела запроса)

            await productFounded.save(); // сохраняем обновленный объект товара в базе данных

            return res.json(productFounded); // возвращаем обновленный товар на фронтенд

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async createProductCart(req, res, next) {

        // оборачиваем в try catch для обработки ошибок
        try {

            const productCart = req.body;  // достаем из тела запроса весь объект запроса со всеми полями,которые мы передали с фронтенда(не используем здесь деструктуризацию типа деструктурировать из req.body {product} в квадратных скобках,так как просто берем все тело запроса,то есть весь объект тела запроса,а не отдельные поля)

            const createdProductCart = await cartProductModel.create({ ...productCart }); // создаем объект товара корзины в базе данных,разворачивая весь объект productCart(это весь объект тела запроса),вместо ...productCart будут подставлены все поля с их значениями,которые есть в объекте тела запроса

            return res.json(createdProductCart); // возвращаем созданный объект товара корзины на фронтенд

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async getAllProductsCart(req, res, next) {

        // оборачиваем в try catch для обработки ошибок
        try {

            let { userId, page, limit } = req.query; // берем из url(строки) запроса параметр userId,чтобы получить все товары корзины для определенного авторизованного пользователя

            page = page || 1; // указываем значение переменной page как параметр,который взяли из строки запроса,если он не указан,то делаем значение 1 

            limit = limit || 3; // указываем значение переменной limit как параметр,который взяли из строки запроса,если он не указан,то делаем значение 3

            let offset = page * limit - limit; // считаем отступ,допустим перешли на вторую страницу и первые 3 товара нужно пропустить(в данном случае это limit),поэтому умножаем page(текущую страницу) на limit и отнимаем лимит(чтобы правильно считались страницы,и показывалась последняя страница с товарами,если не отнять,то на последней странице товаров не будет,так как будет указано пропустить все объекты товаров из базы данных,прежде чем начать отправлять их),то есть offset считает,сколько нужно пропустить объектов до того,как отправлять объекты(например всего товаров 12, текущая страница 3,лимит 3, соответственно 3 * 3 - 3 будет 6,то есть 6 товаров пропустятся,на следующей странице(4) будет уже пропущено 4 * 3 - 3 равно 9(то есть 9 товаров пропущено будет), offset указывает пропустить указанное число строк(объектов в таблице в базе данных), прежде чем начать выдавать строки(объекты) )

            const allProductsCart = await cartProductModel.find({ forUser: userId }); // получаем все объекты товаров корзины у которых поле forUser равно параметру userId который мы взяли из query параметров url(строки) запроса,то есть получаем все объекты товаров для определенного авторизованного пользователя,это ищем для пагинации

            const productsCart = await cartProductModel.find({ forUser: userId }).sort({ _id: -1 }).limit(limit).skip(offset); // получаем все объекты товаров корзины у которых поле forUser равно параметру userId который мы взяли из query параметров url(строки) запроса,то есть получаем все объекты товаров для определенного авторизованного пользователя, через точку указываем метод limit() и передаем в него значение лимита,в данном случае указываем,что лимит будет 4,то есть из базы данных придут максимум 4 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb,в данном случае указываем,что лимит будет 4,то есть из базы данных придут максимум 4 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем значение переменной offset, указываем метод sort() для сортировки объектов,указываем в нем объект и поле _id со значением -1( -1(сортировка по убыванию),а 1(сортировка по возрастанию)),то есть будут сортироваться объекты по полю _id по убыванию,то есть самые последние добавленные объекты будут показываться первыми,что и нужно для товаров корзины

            return res.json({ allProductsCart, productsCart }); // возвращаем найденные товары корзины на фронтенд

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async updateProductCart(req, res, next) {

        // оборачиваем в try catch для обработки ошибок
        try {

            const productCart = req.body; // достаем(деструктуризируем) из тела запроса весь объект запроса со всеми полями,которые мы передали с фронтенда(не используем здесь деструктуризацию типа деструктурировать из req.body {productCart} в квадратных скобках,так как просто берем все тело запроса,то есть весь объект тела запроса,а не отдельные поля)

            const productCartFounded = await cartProductModel.findById(productCart._id); // находим объект товара в базе данных по id,который взяли у объекта тела запроса productCart(это будет объект с обновленными данными товара корзины,если пользователь изменил эти данные товара корзины на фронтенде,если пользователь эти данные товара не изменил,то это будет объект товара такой же,как и был)

            // если productCartFounded.amount не равно productCart.amount(то есть если количество найденного товара корзины в базе данных(productCartFounded) не равно количеству товара корзины productCart(который мы передали с фронтенда),то тогда изменяем данные товара корзины,в другом случае возвращаем текст типа с ошибкой на клиент(фронтенд))
            if (productCartFounded.amount !== productCart.amount) {

                productCartFounded.amount = productCart.amount; // изменяем поле amount у productCartFounded(у этого объекта товара корзины,который мы нашли в базе данных) на значение поля amount у productCart(объекта товара,который мы передали с фронтенда)

                productCartFounded.totalPrice = productCart.totalPrice; // изменяем поле totalPrice у productCartFounded(у этого объекта товара корзины,который мы нашли в базе данных) на значение поля totalPrice у productCart(объекта товара,который мы передали с фронтенда)

                await productCartFounded.save(); // сохраняем обновленный объект товара в базе данных

                return res.json(productCartFounded);  // возвращаем обновленный объект товара на клиент(фронтенд)

            } else {

                return res.json(`Данные товара с id = ${productCartFounded._id} не были изменены`); // вместо ошибки просто возвращаем текст с сообщением,в данном случае просто,чтобы не было куча ошибок в консоли,так как это не критичная ошибка,а просто больше как уведомление

            }


        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async deleteProductCart(req, res, next) {

        // оборачиваем в try catch для обработки ошибок
        try {

            const { productId } = req.params; // берем productId из параметров запроса(мы указали этот динамический параметр productId в url к эндпоинту,поэтому можем его взять из req.params)

            const deleteProductCart = await cartProductModel.findByIdAndDelete(productId);  // находим объект товара у которого id равен параметру productId(который мы взяли из url(строки) запроса) и удаляем его с помощью функции findByIdAndDelete(),если здесь использовать функцию deleteOne() и удалять объект товара по id,то не будет работать,потому что по id так не найдет,поэтому в данном случае используем функцию findByIdAndDelete()

            return res.json(deleteProductCart); // возвращаем на клиент удаленный объект товара

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async updateProductRatingCart(req, res, next) {

        // оборачиваем в try catch для обработки ошибок
        try {

            const product = req.body; // достаем(деструктуризируем) из тела запроса весь объект запроса со всеми полями,которые мы передали с фронтенда(не используем здесь деструктуризацию типа деструктурировать из req.body {product} в квадратных скобках,так как просто берем все тело запроса,то есть весь объект тела запроса,а не отдельные поля)

            const productCartFounded = await cartProductModel.find({ usualProductId: product._id }); // находим все товары корзины,у которых поле usualProductId равно полю _id у product(весь объект тела запроса,то есть обычный объект товара каталога),находим все эти товары корзины,так как одинаковые товары могут быть у разных пользователей в корзине(только эти товары могут отличаться количеством,в зависимости от того,сколько выбрал пользователь положить их в корзину)

            // если productCartFounded true,то есть в корзине есть такие товары,как и в каталоге с таким usualProductId
            if (productCartFounded) {

                // можно обновить таким образом,но сделали по-другому чуть ниже в коде,потому что другой вариант короче,оба работают
                // productCartFounded.forEach(async (productCart) => {

                //     productCart.rating = product.rating; // изменяем поле rating у найденного объекта товара в базе данных(productFounded) на значение поля rating у product(объект тела запроса)

                //     await productCart.save();

                // })

                await cartProductModel.updateMany({ usualProductId: product._id }, { rating: product.rating }); // обновляем все объекты товаров корзины с помощью updateMany(), у которых поле usualProductId равно полю _id у product(весь объект тела запроса,то есть обычный объект товара каталога),обновляем у них поле rating на значение поля rating у product(весь объект тела запроса,то есть обычный объект товара каталога)

            }

            return res.json(productCartFounded); // возвращаем массив найденных товаров корзины(если он пустой,то значение будет null)

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

}

export default new ProductController(); // экспортируем объект на основе класса ProductController,чтобы потом сразу можно было после импорта этого объекта из этого файла указывать через точку функции этого класса ProductController