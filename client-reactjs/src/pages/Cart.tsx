import ProductItemCart from "../components/ProductItemCart";
import SectionCartTop from "../components/SectionCartTop";

const Cart = () => {

    return (
        <main className="main">
            <SectionCartTop/>
            <section className="sectionCart">
                <div className="container">
                    <div className="sectionCart__inner">
                        <div className="sectionCart__table">
                            <div className="sectionCart__table-names">
                                <p className="sectionCart__table-name">Products</p>
                                <p className="sectionCart__table-name">Price</p>
                                <p className="sectionCart__table-name">Quantity</p>
                                <p className="sectionCart__table-name">Subtotal</p>
                            </div>
                            <div className="sectionCart__table-mainBlock">
                                
                                <ProductItemCart/>
                                
                                <div className="sectionCart__table-bottomBlock">
                                    <button className="sectionCart__table-bottomBlockClearBtn">Clear Cart</button>

                                    <button className="sectionCart__table-bottomBlockUpdateBtn">Update Cart</button>
                                </div>

                            </div>
                        </div>
                        <div className="sectionCart__bill">
                            <div className="bill__topBlock">
                                <div className="bill__topBlock-item">
                                    <p className="bill__topBlock-itemText">Cart Subtotal</p>
                                    <p className="bill__topBlock-itemSubText">$15.00</p>
                                </div>
                                <div className="bill__topBlock-item">
                                    <p className="bill__topBlock-itemTextGrey">Shipping Charge</p>
                                    <p className="bill__topBlock-itemSubTextGrey">$10.00</p>
                                </div>
                            </div>
                            <div className="bill__bottomBlock">
                                <div className="bill__bottomBlock-item">
                                    <p className="bill__bottomBlock-itemText">Total</p>
                                    <p className="bill__bottomBlock-itemSubText">$25.00</p>
                                </div>
                                <button className="bill__bottomBlock-btn">
                                    <p className="bill__bottomBlock-btnText">Proceed to Checkout</p>
                                    <img src="/images/sectionCart/CheckSquareOffset.png" alt="" className="bill__bottomBlock-btnImg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default Cart;