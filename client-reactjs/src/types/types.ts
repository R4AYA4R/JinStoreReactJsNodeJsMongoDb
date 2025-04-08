
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

// создаем и экспортируем наш тип для объекта товара корзины(IProductCart),указываем,что этот тип IProductCart расширяется(extends) на основе нашего интерфейса(типа) IProduct,то есть в этом типе IProductCart будут все поля,которые есть в типе IProduct и к этим полям будут добавлены поля,которые мы указываем при создании этого типа IProductCart(в данном случае добавляются еще поля usualProductId и forUser)
export interface IProductCart extends IProduct{

    usualProductId:string,  // указываем это поле,чтобы туда потом указывать значение id обычного товара из каталога,чтобы потом можно было перейти на страницу этого обычного товара из корзины
 
    forUser:number // указываем это поле,чтобы указать значение id объекта пользователя,чтобы потом показывать в корзине товары только для определенного авторизованного пользователя

}

// создаем и экспортируем тип для объекта,который придет от сервера при запросе на товары каталога,указываем поле products(массив объектов товаров) с типом на основе нашего интерфейса IProduct[],также для allProducts(в нем будут все объекты товаров без лимитов и состояния страницы пагинации) и поле maxPriceAllProducts(то есть максимальное значение цены товара,которое мы посчитали на бэкэнде и поместили в поле maxPriceAllProducts) с типом number
export interface IResponseCatalog{
    allProducts:IProduct[],
    products:IProduct[],
    maxPriceAllProducts:number
}

// создаем и экспортируем интерфейс для объекта пользователя,который приходит от сервера
export interface IUser{
    email:string,
    userName:string,
    id:number,
    role:string
}

// создаем и экспортируем интерфейс для объекта состояния редьюсера для пользователя,указываем ему поле user на основе нашего интерфейса IUser,и остальные поля
export interface IUserInitialState{
    user:IUser,
    isAuth:boolean,
    isLoading:boolean
}

export interface ICatalogInitialState{
    catalogCategory:string
}

// создаем и экспортируем наш интерфейс для AuthResponse
export interface AuthResponse {

    // указываем здесь поля этого интерфейса(типа) для объекта
    accessToken:string,
    refreshToken:string,
    user:IUser // указываем,что поле user - это объект на основе нашего интерфеса IUser(с теми полями, которые описаны в IUser)
}

export interface IComment {
    _id:number,  // указываем поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием по дефолту
    name:string,
    text:string,
    rating:number,
    createdTime:string,
    productNameFor:string
}

// создаем и экспортируем наш интерфейс для ответа от сервера для получения комментариев для товара
export interface ICommentResponse{
    allComments:IComment[], // указываем поле для всех комментариев,еще не отфильтрованных для отдельного товара
    allCommentsForName:IComment[], // указываем поле для всех комментариев,уже отфильтрованных для отдельного товара
    comments:IComment[] // указываем поле для всех комментариев для одной страницы пагинации
}
