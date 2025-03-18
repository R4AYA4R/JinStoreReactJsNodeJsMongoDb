
// функция для получения массива страниц пагинации
export const getPagesArray = (totalPages:number,page:number) => {

    let result = [];  // указываем переменную result с пустым массивом пока что,указываем ей let,чтобы можно было изменять ей значение

    // если всего страниц больше 3
    if(totalPages > 3){

        // если текущая страница больше 2
        if(page > 2){

            // пока i = текущая страница минус 2,увеличивать i на 1,до того,как i будет меньше или равно текущей странице + 1(то есть если текущая страница 3,то сразу i = 3-2=1,и это 1 поместилась в массив этих страниц(result),потом i = 3-2=1 и увеличить i на 1,то есть теперь уже i = 4 и она помещается в массив и так далее в данном случае до того,как i будет равно 12),в итоге при изменении страницы массив страниц каждый раз обновляется проходя этот цикл
            for(let i = page - 2; i <= page + 1; i++){
                
                result.push(i);

                if(i === totalPages) break; // если i(текущая страница) будет равна всему количеству страниц(то есть дойдет до самой последней),то остановить цикл(иначе массив страниц будет генерироваться дальше,после последней страницы)

            }

        } else {

            // в другом случае,если текущая страница < 2 или =(равно) 2,то i = 1,увеличивать i на 1,до того,как i будет меньше или равно 3
            for(let i = 1; i <= 3; i++){

                result.push(i);

                if(i === totalPages) break; // если i(текущая страница) будет равна всему количеству страниц(то есть дойдет до самой последней),то остановить цикл(иначе массив страниц будет генерироваться дальше,после последней страницы)

            }

        }

    } else {
        // в другом случае,если общее количество страниц меньше 3,то i = 0,увеличивать i на 1 до того,как i будет меньше общего количества страниц и записывать каждый раз эту i в массив страниц(result),но увеличенную на 1,чтобы массив начинался не с 0,а с 1
        for(let i = 0; i < totalPages; i++){
            
            result.push(i + 1); // в массив result записываем значение i + 1,то есть пока i будет меньше totalPages,каждое i(увеличенное на 1) будет записано в массив result

        }
    }

    return result; // возвращаем массив страниц

}