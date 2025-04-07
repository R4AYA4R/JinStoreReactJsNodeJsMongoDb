import { ChangeEvent, useState } from "react";

const ProductItemCart = () => {

    const [inputAmountValue, setInputAmountValue] = useState(1);


    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputAmountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение инпута > 99,то изменяем состояние инпута цены на 99,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        if (+e.target.value > 99) {

            setInputAmountValue(99);

        } else if (+e.target.value <= 0) {

            // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
            setInputAmountValue(0);

        } else {

            setInputAmountValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusAmountBtn = () => {

        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля или 1 не отнимало - 1
        if (inputAmountValue > 1) {

            setInputAmountValue((prev) => prev - 1);

        } else {

            setInputAmountValue(1);

        }

    }

    const handlerPlusAmountBtn = () => {

        // если значение инпута количества товара меньше 99 и больше или равно 0,то изменяем это значение на + 1,в другом случае указываем ему значение 99,чтобы больше 99 не увеличивалось
        if (inputAmountValue < 99 && inputAmountValue >= 0) {

            setInputAmountValue((prev) => prev + 1);

        } else {

            setInputAmountValue(99);

        }

    }


    return (
        <div className="sectionCart__table-item">
            <div className="sectionCart__item-leftBlock">
                <div className="sectionProductItemPage__itemBlock-imgBlock">

                    {/* здесь еще надо будет сделать слайдер */}

                    <div className="sectionNewArrivals__item-saleBlock sectionCart__item-saleBlock">10%</div> 
                    <div className="sectionNewArrivals__item-saleBlockHot sectionCart__item-saleBlockHot">HOT</div>

                    <img src="/images/sectionNewArrivals/BeerImg.png" alt="" className="sectionCart__item-img" />
                </div>
                <div className="sectionCart__item-leftBlockInfo">
                    <p className="sectionCart__item-leftBlockInfoName">Name</p>
                    <div className="sectionNewArrivals__item-starsBlock sectionCart__item-starsBlock">
                        <div className="sectionNewArrivals__item-stars">
                            {/* если product.rating равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                            <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                        </div>
                        <p className="starsBlock__text">(0)</p>
                    </div>
                </div>
            </div>
            <div className="sectionNewArrivals__item-priceBlock">
                <p className="item__priceBlock-priceSale sectionCart__item-priceSale">$8.00</p>
                <p className="item__priceBlock-priceUsual">$10.00</p>
            </div>
            <div className="sectionProductItemPage__infoBlock-inputBlock sectionCart__item-inputBlock">
                <div className="infoBlock__inputBlock-leftInputBlock">
                    <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                        <img src="/images/sectionProductItemPage/Minus.png" alt="" className="infoBlock__btn-img" />
                    </button>
                    <input type="number" className="infoBlock__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                    <button className="infoBlock__inputBlock-btn infoBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                        <img src="/images/sectionProductItemPage/Plus.png" alt="" className="infoBlock__btn-img" />
                    </button>
                </div>
            </div>
            <p className="sectionCart__item-totalPrice">$10.00</p>
            <button className="sectionCart__item-removeBtn">
                <img src="/images/sectionCart/X.png" alt="" className="sectionCart__item-removeBtnImg" />
            </button>
        </div>
    )

}

export default ProductItemCart;