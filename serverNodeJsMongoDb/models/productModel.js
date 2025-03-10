
// если сохранили схему(Schema) для объектов в базе данных и она уже добавилась в mongodb,и мы хотим изменить ее,добавить или убрать ей поля,то нужно удалить ее из mongodb полностью,а потом сохранить в коде уже с изменениями,иначе не будет работать

import { model, Schema } from "mongoose";

// создаем schema(схему),она описывает какие поля будет содержать сущность(в данном случае товара) в базе данных mongodb,указываем поле name с типом String,указываем,что оно будет уникальное(unique:true),то есть одинаковых таких записей в базе данных быть не должно,и указываем,что оно должно быть обязательным(required:true),и также указываем другие поля 
const ProductSchema = new Schema({

    name:{type:String,unique:true,required:true},

    category:{type:String,required:true},

    descText:{type:String,required:true},

    price:{type:Number,required:true}, // указываем этому полю тип Number(для любых чисел,обычных и с запятой типа float)

    priceDiscount:{type:Number}, // указываем поле для цены со скидкой,не указываем ему,что оно должно быть обязательным,так как не у всех товаров будет скидка и потом будем просто проверять,есть ли это поле у товара или нет

    priceFilter:{type:String,required:true},

    amount:{type:Number,required:true},

    totalPrice:{type:Number,required:true},

    totalPriceDiscount:{type:Number}, // указываем поле для конечной цены со скидкой,не указываем ему,что оно должно быть обязательным,так как не у всех товаров будет скидка и потом будем просто проверять,есть ли это поле у товара или нет

    rating:{type:Number,required:true},

    mainImage:{type:String,required:true},

    descImages:{type:[String],required:true} // указываем этому полю,что это массив данных с типом string,это для дополнительных изображений товара

})

export default model('Product',ProductSchema);  // экспортируем модель,которая будет называться 'Product'(указываем это первым параметром),и построена на основе нашей схемы ProductSchema(передаем ее вторым параметром)