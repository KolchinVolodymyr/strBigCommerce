import React from 'react';
import OrderBulkProductsRow from './OrderBulkProductsRow';

export default class OrderBulkProductsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            variants: [],
        }
    }

    /**
     * Counts the sum of product variations
     * @param variantProductID
     * @param variantProductPrice
     */
    changeTotal(variantProductID, variantProductPrice) {
        let variantIndex = this.state.variants.findIndex((el) => el.id == variantProductID);
        // -1, not found
        if (variantIndex !== -1) {
            this.state.variants[variantIndex].value = variantProductPrice;
        } else {
            this.state.variants.push({id: variantProductID, value: variantProductPrice})
        }
        let total = this.state.variants.map((el) => el.value).reduce((a, b) => a + b, 0).toFixed(2);
        this.setState({
            total: total
        })
    }

    render() {
        return (
            <div className="containerDetailProduct">
                <div className='order-bulk-product-header'>
                    <div className='product-name-fixture-desc'>Fixture Desc</div> 
                    <div className='product-name-fixture-photo'>Fixture Photo</div> 
                    <div className='product-name-product-photo'>Product Photo</div>
                    <div className='product-name-product-information'>Product Information</div>
                    <div className='product-name-information'>Inventory</div>
                    <div className='product-name-unit-price'>Unit Price</div>
                    <div className='product-name-qty'>Qty</div>    
                </div>
                {this.props.productsList.map((el) => {
                    return (<OrderBulkProductsRow
                        key={el.product.id}
                        product={el.product}
                        urlImagesFixed={el.urlImagesFixed}
                        changeTotal={this.changeTotal.bind(this)}
                    /> )
                })
                }
                <div className="total">
                    <div className="total-price">
                        <span>Total cost: </span>
                        <span id="totalPriceValue"> {this.state.total}</span>
                        <span>UAH</span>
                    </div>
                    <button id="productVariants" className="button button--primary">Add to Cart</button>
                </div>
            </div>
        )
    }
}