
export interface IProduct{

    _id:string, // указываем поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием 
    name:string,
    category:string,
    descText:string,
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

// создаем и экспортируем тип для объекта,который придет от сервера при запросе на товары каталога,указываем поле products(массив объектов товаров) с типом на основе нашего интерфейса IProduct[],также для allProducts(в нем будут все объекты товаров без лимитов и состояния страницы пагинации) и поле maxPriceAllProducts(то есть максимальное значение цены товара,которое мы посчитали на бэкэнде и поместили в поле maxPriceAllProducts) с типом number
export interface IResponseCatalog{
    allProducts:IProduct[],
    products:IProduct[],
    maxPriceAllProducts:number
}