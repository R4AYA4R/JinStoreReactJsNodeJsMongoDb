// лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js,поэтому сначала создаем папку с сервером(serverNodeJsMongoDb в данном случае) и в ней просто создаем файл,а потом в корневой папке проекта подключаем git(указываем в терминале git init и тд,делаем первый commit и push данных в git),а только после этого создаем папку для react js

// прописали npm init в проект,чтобы инициализировать npm менеджер пакетов,чтобы устанавливать зависимости и пакеты(после npm init на все вопросы можно нажать enter и они будут тогда по дефолту указаны,или же указать npm init -y,тогда будут настройки по дефолту),устанавливаем express,cors(для отправки запросов через браузер),cookie-parser, устанавливаем с помощью npm i,устанавливаем nodemon(npm i nodemon --save-dev(чтобы устанавилось только для режима разработки)),чтобы перезагружался сервер автоматически при изменении файлов,указываем в package json в поле scripts поле dev и значение nodemon index.js(чтобы запускался index.js с помощью nodemon,чтобы перезагружался сервер автоматически при изменении файлов),используем команду npm run dev,чтобы запустить файл index.js,добавляем поле type со значение module в package.json,чтобы работали импорты типа import from,устанавливаем dotenv(npm i dotenv),чтобы использовать переменные окружения,создаем файл .env в корне папки server,чтобы указывать там переменные окружения(переменные среды),устанавливаем npm i mongodb mongoose,для работы с базой данных mongodb,на сайте mongodb создаем новый проект для базы данных,и потом берем оттуда ссылку для подключения к базе данных,устанавливаем еще jsonwebtoken(для генерации jwt токена),bcrypt(для хеширования пароля),uuid(для генерации рандомных строк) (npm i jsonwebtoken bcrypt uuid),все модули для backend(бэкэнда,в данном случае в папке server) нужно устанавливать в папку для бэкэнда(в данном случае это папка server),для этого нужно каждый раз из корневой папки переходить в папку server(cd server) и уже там прописывать npm i,устанавливаем еще пакет nodemailer(npm i nodemailer) для работы с отправкой сообщений на почту,устанавливаем библиотеку express-validator(npm i express-validator) для валидации паролей,почт и тд(для их проверки на правилно введенную информацию),для работы с файлами в express, нужно установить модуль npm i express-fileupload,лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js

//authMiddleware нужен,чтобы защитить пользователя от мошенников,так как,когда истекает access токен,идет запрос на refresh токен,и после этого обновляется и access токен,и refresh токен,соответственно мошенник уже не может получить доступ к этому эндпоинту(маршруту по url),так как его refresh и access токен будут уже не действительны,а функция checkAuth нужна для проверки только refresh токена(то есть,если пользователь вообще не пользовался сервисом какое-то время(которое указали у жизни refresh токена),нужно именно не переобновлять страницы и тд,чтобы не шел запрос на /refresh(иначе refresh токен будет переобновляться с каждым запросом,нужно,чтобы refresh токен истек до запроса на /refresh),то его refresh токен истечет и его выкинет с аккаунта после обновления страницы,но если пользователь будет использовать в данном случае,например,функцию authMiddleware,то его access токен и refresh токен будут заново перезаписаны и таймер на время жизни refresh токена будет обновлен и заново запущен,поэтому его не будет выкидывать из аккаунта) 

import cookieParser from 'cookie-parser'; // импортируем cookieParser для использования cookie

import cors from 'cors'; // импортируем cors,чтобы можно было отправлять запросы на сервер из браузера(в данном случае импортируем это вручную,потому что автоматически не импортируется)

import dotenv from 'dotenv';  // импортируем dotenv(в данном случае импортируем это вручную,потому что автоматически не импортируется)

import express from 'express'; // импортируем express(express типа для node js express,в данном случае импортируем это вручную,потому что автоматически не импортируется)
import errorMiddleware from './middlewares/errorMiddleware.js';  // указываем здесь вручную расширение файла .js,иначе выдает ошибку,что не может найти файл
import mongoose from 'mongoose';
import productModel from './models/productModel.js';

dotenv.config();

const PORT = process.env.PORT || 5000; // указываем переменную PORT и даем ей значение как у переменной PORT из файла .env,если такой переменной нет,то указываем значение 5000

const app = express(); // создаем экземпляр нашего приложения с помощью express()

app.use(cookieParser()); // подключаем cookieParser,чтобы работали cookie


app.use(express.json()); // подключаем express.json(),чтобы наш сервер мог парсить json формат данных,то есть обмениваться с браузером json форматом данных



app.use(errorMiddleware);  // подключаем наш middleware для обработки ошибок,middleware для обработки ошибок нужно подключать в самом конце всех подключений use()

// делаем эту функцию start асинхронной,так как все операции с базой данных являются асинхронными
const start = async () => {
    // оборачиваем в try catch,чтобы отлавливать ошибки
    try{

        await mongoose.connect(process.env.DB_URL); // подключаемся к базе данных,используя функцию connect(),в ее параметрах указываем ссылку для подключения к базе данных,которую взяли на сайте mongodb,в данном случае вынесли эту ссылку в конфигурационный файл .env,и берем его оттуда с помощью process.env,в этой ссылке для подключения к базе данных mongoDb нужно будет вставить(указать) пароль пользователя в эту строку вместо <db_password>,который указывали при создании кластера(cluster) на сайте mongoDb

        app.listen(PORT,() => console.log(`Server started on PORT = ${PORT}`)); // запускаем сервер,говоря ему прослушивать порт 5000(указываем первым параметром у listen() нашу переменную PORT) с помощью listen(),и вторым параметром указываем функцию,которая выполнится при успешном запуске сервера

        // использовали это 1 раз,чтобы создать такие объекты в базе данных 1 раз,чтобы они просто там были,после этого этот код закомментировали
        // await productModel.create({name:"Simply Orange Pulp Free Juice – 52 fl oz",category:"Beverages",price:4.13,priceDiscount:2.45,priceFilter:"Under $10",amount:1,rating:0,totalPrice:4.13,totalPriceDiscount:2.45,mainImage:"ItemImg (3).png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"California Pizza Kitchen Margherita, Crispy Thin",category:"Breads & Bakery",price:5.27,priceFilter:"Under $10",amount:1,rating:0,totalPrice:5.27,mainImage:"ItemImg (2).png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"Cantaloupe Melon Fresh Organic Cut",category:"Fruits & Vegetables",price:2.98,priceDiscount:1.35,priceFilter:"Under $10",amount:1,rating:0,totalPrice:2.98,totalPriceDiscount:1.35,mainImage:"ItemImg (6).png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"100 Percent Apple Juice – 64 fl oz Bottle",category:"Beverages",price:1.99,priceDiscount:0.50,priceFilter:"Under $10",amount:1,rating:0,totalPrice:1.99,totalPriceDiscount:0.50,mainImage:"ItemImg (5).png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"Great Value Rising Crust Frozen Pizza, Supreme",category:"Breads & Bakery",price:14.77,priceFilter:"Under $10",amount:1,rating:0,totalPrice:14.77,mainImage:"ItemImg (4).png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"USDA Choice Angus Beef T - Bone Steak – 0.70-1.50 lbs",category:"Meats & Seafood",price:14.35,priceDiscount:12.89,priceFilter:"Under $10",amount:1,rating:0,totalPrice:14.35,totalPriceDiscount:12.89,mainImage:"BeefImg.png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"All Natural 85_15 Ground Beef – 1lb",category:"Meats & Seafood",price:8.75,priceFilter:"Under $10",amount:1,rating:0,totalPrice:8.75,mainImage:"GroundBeefImg.png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"A&W Caffeine-Free, Low Sodium Root Beer Soda Pop, 2 Liter Bottles",category:"Beverages",price:11.20,priceDiscount:9.50,priceFilter:"Under $10",amount:1,rating:0,totalPrice:11.20,totalPriceDiscount:9.50,mainImage:"BeerImg.png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"Absolut Grapefruit Paloma Sparkling Vodka Cocktail – 355ml",category:"Beverages",price:9.99,priceDiscount:6.99,priceFilter:"Under $10",amount:1,rating:0,totalPrice:9.99,totalPriceDiscount:6.99,mainImage:"VodkaImg.png",descImages:["BeerImg.png","BeerImg.png"]});

        // await productModel.create({name:"Real Plant-Powered Protein Shake – Double Chocolate",category:"Beverages",price:17.59,priceFilter:"Under $10",amount:1,rating:0,totalPrice:17.59,mainImage:"ChocolateImg.png",descImages:["BeerImg.png","BeerImg.png"]});


    }catch(e){
        console.log(e);
    }
}

start(); // вызываем нашу функцию start(),чтобы запустить сервер