import productModel from "../models/productModel.js"; // указываем здесь вручную расширение файла .js,иначе выдает ошибку,что не может найти файл

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

        let { limit, skip, name, category, minPrice, maxPrice } = req.query; // берем из параметров запроса поля category и тд,указываем здесь let,чтобы  можно было изменять значения этих параметров(переменных),в данном случае это надо для limit и page,также берем параметр sort(в нем будет название поля,по которому нужно сортировать,это мы передаем с фронтенда),берем поле name,чтобы искать объекты блюд по этому полю name для поиска, берем поле minPrice(минимальное значение фильтра цены) и maxPrice(максимальное значение фильтра цены),чтобы фильтровать объекты товаров по цене


        // оборачиваем в try catch для обработки ошибок
        try {

            let categoryObj; // указываем переменную для объекта категории,указываем ей let,чтобы потом изменять ее значение

            let priceObj; // указываем переменную для объекта цены,указываем ей let,чтобы потом изменять ее значение


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


            const allProducts = await productModel.find({

                name: { $regex: `${name}`, $options: 'i' },

                ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено category:category(то есть ищем объекты,у которых поле category равно параметру category,который взяли из url с фронтенда),если проверка выше на category была true,если была false,то тут будет null)

                ...priceObj
                
            }); // ищем все объекты товаров в базе данных,чтобы отправить их на клиент и потом получить число сколько всего товаров в базе данных,для пагинации,а в переменную products поместим уже конкретно объекты товаров на отдельной странице пагинации,в find() в объекте указываем поле name(по нему будем делать поиск объектов блюд) и указываем через двоеточие объект, указываем поле $regex(по какому значению будем делать поиск по полю name,в данном случае указываем значение как `${name}` параметр,который взяли с фронтенда) и через запятую указываем поле $options(в нем указываем опции для поиска,то есть игнорировать ли пробелы в строке поиска,чувствительный регистр букв или нет(учитывать разницу больших букв и маленьких) и тд), в $options значение i указывает,что регистр букв не чувствительный,то есть можно писать в поиске маленькими буквами,а будут находиться названия с большими такими же буквами и наоборот, значение x указывает,игнорировать ли пробелы в поиске и символ решетки(#),эти значение типа i и x нужно писать вместе('ix'),чтобы они работали,также есть и другие опции типа этих,если они нужны,то их также нужно указывать вместе,без пробела,в данном случае используем опцию только i


            const products = await productModel.find({

                name: { $regex: `${name}`, $options: 'i' },

                ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено category:category(то есть ищем объекты,у которых поле category равно параметру category,который взяли из url с фронтенда),если проверка выше на category была true,если была false,то тут будет null)

                ...priceObj

            }); // находим объекты всех блюд в базе данных mongodb с помощью метода find() у модели(схемы) productModel(модель товара), через точку указываем метод limit() и передаем в него значение лимита,в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем в методах limit и skip значения query параметров limit и skip,которые взяли из url(передали их с фронтенда),в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем значение переменной offset, в find() в объекте указываем поле name(по нему будем делать поиск объектов блюд) и указываем через двоеточие объект, указываем поле $regex(по какому значению будем делать поиск по полю name,в данном случае указываем значение как `${name}` параметр,который взяли с фронтенда) и через запятую указываем поле $options(в нем указываем опции для поиска,то есть игнорировать ли пробелы в строке поиска,чувствительный регистр букв или нет(учитывать разницу больших букв и маленьких) и тд), в $options значение i указывает,что регистр букв не чувствительный,то есть можно писать в поиске маленькими буквами,а будут находиться названия с большими такими же буквами и наоборот, значение x указывает,игнорировать ли пробелы в поиске и символ решетки(#),эти значение типа i и x нужно писать вместе('ix'),чтобы они работали,также есть и другие опции типа этих,если они нужны,то их также нужно указывать вместе,без пробела,в данном случае используем опцию только i, указываем метод sort() для сортировки объектов,указываем в нем объект,в который разворачиваем наш объект sortedObj(вместо него будут подставлены поля,которые нужно сортировать,и значения сортировки этих полей,или же будет подставлен null,если параметры sort и order не будут иметь значения(если с фронтенда не передали значения в них))

            console.log(products);

            return res.json({ allProducts, products,maxPriceAllProducts }); // возвращаем на клиент объект с полями массива объектов товаров products,массива объектов allProducts и переменную maxPriceAllProdcuts(то есть максимальное значение цены товара,которое мы посчитали и поместили в переменную maxPriceAllProducts),указываем это в объекте,так как передаем уже 2 массива и еще одно поле maxPriceAllProducts

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getProducts) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProducts,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

}

export default new ProductController(); // экспортируем объект на основе класса ProductController,чтобы потом сразу можно было после импорта этого объекта из этого файла указывать через точку функции этого класса ProductController