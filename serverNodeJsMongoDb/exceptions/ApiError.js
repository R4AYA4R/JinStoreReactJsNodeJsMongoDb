
// создаем и экспортируем наш класс ApiError,этот наш класс расширает дефолтный javascript класс Error(чтобы обрабатывать свои ошибки)
export default class ApiError extends Error{

    status; // указываем поле status у этого класса
    errors;

    // создаем конструктор,параметр errors делаем по дефолту пустым массивом
    constructor(status,message,errors = []){

        super(message); // вызываем родительский конструктор и туда передаем сообщение(то есть в данном случае передаем сообщение в дефолтный javaScript класс Error)

        // в переменные этого класса помещаем status и errors(параметры,которые будем передавать при создании объекта на основе этого класса)
        this.status = status;
        this.errors = errors;

    }   

    // создаем static функцию,static функции можно использовать,не создавая экземпляр класса
    static UnauthorizedError(){
        return new ApiError(401,"User is not authorized"); // возвращаем экземпляр этого класса ApiError,то есть создаем объект на основе этого класса,куда передаем параметры status код ошибки и сообщение ошибки
    }

    static BadRequest(message,errors = []){
        return new ApiError(400,message,errors); // возвращаем экземпляр этого класса,то есть создаем объект на основе этого класса,куда передаем параметры
    }

}