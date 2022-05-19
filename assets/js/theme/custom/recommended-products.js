import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import getProductMetafields from './gql/getProductMetafields.gql';
import getProductsSKU from './gql/getProductsSKU.gql';
import React from 'react';
import ReactDOM from 'react-dom';
import SliderRecommendedProduct from './reactComponent/SliderRecommendedProduct';
import 'regenerator-runtime/runtime';


export default class RecommendedProducts extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.productSKUsArray = [];
        this.productsList = [];
        this.$container = $('.recommended-product-block')[0];
        this.loading = $('.product-section-slider >.loadingOverlay').show();
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

    categoryMetafields() {
        this.gqlClient
        .query({
            query: getProductMetafields,
            variables: { productId: parseInt(this.context.productId), },
            }).then((response) => {
                response.data.site.product.metafields.edges.map(el => {
                    this.productSKUsArray.push(...el.node.value.replace(/\s/g, '').split(','))
                })
            }).then(()=>{
                this.getProductsData(this.productSKUsArray);
            })
    }

    /**
     *
     * @param {Array} productSKUs
     */
     getProductsData(productSKUs){
        this.forEachPromise(productSKUs)
            .then(() => {
                ReactDOM.render(<SliderRecommendedProduct productsList={this.productsList}/>, this.$container)
            })
            .then(()=>{
                this.loading.hide();
            })
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

    onReady() {
        this.categoryMetafields();
    }
}