import { Router } from "express";
import productController from "../controllers/productController.js"; // указываем здесь вручную расширение файла .js,иначе выдает ошибку,что не может найти файл

const router = new Router();  // создаем объект на основе этого класса Router

router.get('/getProducts',productController.getProducts); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getProductsCatalog',productController.getProductsCatalog); // описываем get запрос на сервере для получения товаров для каталога

router.get('/getProductsCatalog/:id',productController.getProductId); // описываем get запрос на сервере для получения объекта блюда по id,указываем этот динамический параметр id через : (двоеточие) в url к этому эндпоинту

export default router; // экспортируем наш router