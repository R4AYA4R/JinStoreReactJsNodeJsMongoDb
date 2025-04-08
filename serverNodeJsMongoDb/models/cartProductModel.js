

// если сохранили схему(Schema) для объектов в базе данных и она уже добавилась в mongodb,и мы хотим изменить ее,добавить или убрать ей поля,то нужно удалить ее из mongodb полностью,а потом сохранить в коде уже с изменениями,иначе не будет работать

import { model, Schema } from "mongoose";

// создаем schema(схему),она описывает какие поля будет содержать сущность(в данном случае товара) в базе данных mongodb,указываем поле name с типом String,указываем,что оно будет уникальное(unique:true),то есть одинаковых таких записей в базе данных быть не должно,и указываем,что оно должно быть обязательным(required:true),и также указываем другие поля 
const CartProductSchema = new Schema({

    usualProductId: { type: String, required: true }, // указываем поле для id объекта товара из обычного каталога,потом на фронтенде будем использовать это поле,чтобы перейти на страницу товара каталога

    name: { type: String, required: true },

    category: { type: String, required: true },

    price: { type: Number, required: true }, // указываем этому полю тип Number(для любых чисел,обычных и с запятой типа float)

    priceDiscount: { type: Number }, // указываем поле для цены со скидкой,не указываем ему,что оно должно быть обязательным,так как не у всех товаров будет скидка и потом будем просто проверять,есть ли это поле у товара или нет

    priceFilter: { type: String, required: true },

    amount: { type: Number, required: true },

    totalPrice: { type: Number, required: true },

    totalPriceDiscount: { type: Number }, // указываем поле для конечной цены со скидкой,не указываем ему,что оно должно быть обязательным,так как не у всех товаров будет скидка и потом будем просто проверять,есть ли это поле у товара или нет

    rating: { type: Number, required: true },

    mainImage: { type: String, required: true },

    descImages: { type: [String], required: true }, // указываем этому полю,что это массив данных с типом string,это для дополнительных изображений товара

    forUser: { type: String, required: true }  // указываем поле,в котором будем хранить id пользователя,для которого этот объект товара в корзине

})

export default model('cartProduct', CartProductSchema);  // экспортируем модель,которая будет называться 'cartProduct'(указываем это первым параметром),и построена на основе нашей схемы CartProductSchema(передаем ее вторым параметром)