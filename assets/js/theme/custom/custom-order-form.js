import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import customerData from './gql/customerData.gql';
import getProductsSKU from './gql/getProductsSKU.gql';
import React from 'react';
import ReactDOM from 'react-dom';
import OrderBulkProductsTable from './reactComponent/OrderBulkProductsTable';
import ButtonOrderList from './reactComponent/ButtonOrderList';
import swal from '../global/sweet-alert';

export default class CustomOrderForm extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.productsList = [];
        this.$container = $('.custom-order-form-container')[0];
        this.arrForm = [];
        this.arrProductsData = null;
    }

    onReady() {
        this.gqlClient.query({
            query: customerData,
        }).then(res => {
            if (res.data.customer === null) {
                $('.error-registered-users').show();
                $('#brandsOverlay').hide();
            } else {
                $('#brandsOverlay').hide();
                this.arrForm.push({
                    'id': res.data.customer.attributes.showPage1.entityId,
                    'name': res.data.customer.attributes.productBulkOrderList1.name,
                    'value': res.data.customer.attributes.productBulkOrderList1.value,
                    'showPage': res.data.customer.attributes.showPage1.value,
                    })
                this.arrForm.push({
                    'id': res.data.customer.attributes.showPage2.entityId,
                    'name': res.data.customer.attributes.productBulkOrderList2.name,
                    'value': res.data.customer.attributes.productBulkOrderList2.value,
                    'showPage': res.data.customer.attributes.showPage2.value,
                    })
                this.arrForm.push({
                    'id': res.data.customer.attributes.showPage3.entityId,
                    'name': res.data.customer.attributes.productBulkOrderList3.name,
                    'value': res.data.customer.attributes.productBulkOrderList3.value,
                    'showPage': res.data.customer.attributes.showPage3.value,
                    })
                this.arrForm.push({
                    'id': res.data.customer.attributes.showPage4.entityId,
                    'name': res.data.customer.attributes.productBulkOrderList4.name,
                    'value': res.data.customer.attributes.productBulkOrderList4.value,
                    'showPage': res.data.customer.attributes.showPage4.value,
                    })
                this.arrForm.push({
                    'id': res.data.customer.attributes.showPage5.entityId,
                    'name': res.data.customer.attributes.productBulkOrderList5.name,
                    'value': res.data.customer.attributes.productBulkOrderList5.value,
                    'showPage': res.data.customer.attributes.showPage5.value,
                    })
                let count = 0;
                this.arrForm.forEach((el)=>{
                    $(`#${el.id}`).hide();
                    if(el.showPage !== null && el.value !== null) {
                        $(`#${el.id}`).show();
                        ReactDOM.render(<ButtonOrderList pageName={el.showPage} el={this.arrForm}/>, this.$container)
                    }
                    if(el.name.length>0) {
                        count++;
                    }
                })

                /**
                * If there is only 1 custom form, the page must display the
                * bulk order form right away (or redirect instantaneously)
                */
                if(count === 1) {
                    this.arrForm.forEach((el)=>{
                        if(el.value !== null) {
                            this.arrProductsData = el.value.replace(/\s/g, '').split(',');
                        }
                    })
                    this.getProductsData(this.arrProductsData);
                }

                /**
                *  The list of products displayed on the page is configured by the admin user
                */
                let elements = document.querySelectorAll(".button");
                let arrProductsData = null;
                for(var i = 0; i < elements.length; i++){
                    elements[i].onclick = function(e){
                        this.arrForm.forEach((el)=>{
                            if(el.id == e.target.dataset.id) {
                                arrProductsData = el.value.replace(/\s/g, '').split(',');
                            }
                        })
                        this.getProductsData(arrProductsData);
                    }.bind(this);
                }

            }
        })
    }

    /**
     *
     * @param {Array} productSKUs
     */
    getProductsData(productSKUs){
         this.forEachPromise(productSKUs)
             .then((res) => {
             ReactDOM.render(<OrderBulkProductsTable productsList={this.productsList}/>, this.$container)
                 $('#productVariants').on('click', () => this.addToCart());
                 $('#brandsOverlay').hide();
                 $('#productVariants')[0].setAttribute("disabled", "");
             });
    }

    /**
     *
     * @param items An array of items.
     * @returns {Promise}
     */
    forEachPromise(items) {
        return items.reduce(function (promise, item) {
            return promise.then(function () {
                return this.productsSKU(item);
            }.bind(this));
        }.bind(this), Promise.resolve());
    }

    /**
     *
     * @param {String} productSkuItem
     */
    productsSKU(productSkuItem) {
        return this.gqlClient.query({
            query: getProductsSKU,
            variables: { sku: productSkuItem },
        }).then(res => {
            if(res.data.site.product !== null) {
                this.productsList.push(res.data.site.product);
            }
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
                const product = this.productsList.find(product => product.sku === item.dataset.sku);
                if(product.variants.edges.length === 1) {
                    let lineItem = {
                        "quantity": parseInt(item.value),
                        "productId": this.productsList[i].entityId,
                    }
                    cartItems.push(lineItem);
                } else {
                    product.variants.edges.map((el)=>{
                        if(item.dataset.sku === el.node.sku) {
                            let lineItem = {
                                'quantity': parseInt(item.value, 10),
                                'productId': product.entityId,
                                'variantId': el.node.entityId
                            }
                            cartItems.push(lineItem);
                        }
                    })
                }
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
        .then(data => data.json())
        .then(res =>  {
            if(res.title !== undefined) {
                let tmp = res.detail.split(' ');
                tmp.splice(0, 2);
                return swal.fire({
                    text: tmp.join(' '),
                    icon: 'error',
                });
            }
            window.location = '/cart.php'
        })
    };

}