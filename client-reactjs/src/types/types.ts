
export interface IProduct{

    _id:number, // указываем поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием 
    name:string,
    category:string,
    price:number,
    priceDiscount:number, // указываем это поле для цены со скидкой
    priceFilter:string,
    amount:number,
    totalPrice:number,
    totalPriceDiscount:number, // указываем это поле для конечной цены со скидкой
    rating:number,
    mainImage:string, // указываем это поле для главной картинки товара
    descImages:string[] // указываем это поле для массива названий картинок с типом string,это будут дополнительные картинки товара для страницы о товаре(ProductItemPage)

}
