import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import getProductsSKU from './gql/getProductsSKU.gql';
import React from 'react';
import ReactDOM from 'react-dom';
import OrderBulkProductsTable from './reactComponent/OrderBulkProductsTable';
import 'regenerator-runtime/runtime';

export default class CustomBulkOrder extends PageManager {
    constructor(context) {
        super(context); 
        this.urlContent = document.querySelector('meta[name="description"]').content;
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.result = [];
        this.productsList = [];
        this.$container = $('.bulk-order-hosted-csv-container')[0];
    }
    
    /**
     *
     * @param {String} productSkuItem
     */
    productsSKU(productSkuItem, urlImagesFixed) {
        return this.gqlClient.query({
            query: getProductsSKU,
            variables: { sku: productSkuItem },
        }).then(res => {
            if(res.data.site.product !== null) {
                this.productsList.push({product:res.data.site.product, urlImagesFixed: urlImagesFixed});
            }
        }).then(()=>{
            ReactDOM.render(<OrderBulkProductsTable productsList={this.productsList}/>, this.$container)
            $('#productVariants').on('click', () => this.addToCart());
        })
    }
    /**
    * Adds a product to the cart
    */
    addToCart() {
        let cartItems = [];
        let qtyFields = Array.from(document.getElementsByClassName('qtyField'));
        for (const [i, item] of qtyFields.entries()) {
            if (item.value > 0 && parseInt(item.value)) {
                let lineItem = {
                    "quantity": parseInt(item.value),
                    "productId": this.productsList[i].product.entityId,
                }
                cartItems.push(lineItem);
                console.log('lineItem', lineItem);
            }
        }
        this.createCart(cartItems);
    }

    /**
    * Adds a line items to the Cart
    */
    createCart(lineItems) {
        fetch(`/api/storefront/cart`)
            .then(response => response.json())
            .then(cart => {
                this.cartItemsID = cart[0]?.id;
            })
            .then(()=> {
                this.createCartItems(`/api/storefront/carts/${this.cartItemsID ? `${this.cartItemsID}/item` : ''}`, lineItems)
            })
    }

    /**
    * Creates a Cart
    */
    createCartItems(url, cartItems) {
        return fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ lineItems: cartItems}),
        })
        .then(response =>{
            console.log('response', response);
            response.json()})
        // .then(()=> {window.location = '/cart.php'})
    };
    
    onReady() {    
        fetch(this.urlContent)
            .then((response) => {
                // The API call was successful!
                return response.json();
            }).then((data) => { 
                data.products.map(el =>{
                    this.productsSKU(el.SKU, el.urlImages);
                })
            }).catch((err) => {
                // There was an error
                console.warn('Something went wrong.', err);
            });
    }
}