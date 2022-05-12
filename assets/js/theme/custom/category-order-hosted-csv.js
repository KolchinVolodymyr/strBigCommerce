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
    //var csv is the CSV file with headers
    // csvJSON(csv){
    //     let lines=csv.split("\n").slice(2);
    //     // var result = [];
    //     // NOTE: If your columns contain commas in their values, you'll need
    //     // to deal with those before doing the next step 
    //     // (you might convert them to &&& or something, then covert them back later)
    //     // jsfiddle showing the issue https://jsfiddle.net/
    //     let headers=lines[0].split(",");
    //     for(let i=1;i<lines.length;i++){
    //         let obj = {};
    //         let currentline=lines[i].split(",");
    
    //         for(let j=0;j<headers.length;j++){
    //             obj[headers[j]] = currentline[j];
    //         }
    //         console.log('obj', obj);
    //         this.result.push(obj);
    //     }
        
    //     this.result.map(el=>{
    //         this.productsSKU(el.SKU, el.urlImages);
    //     })
    //     return JSON.stringify(this.result); //JSON
    // }
    
    // /**
    //  *
    //  * @param {String} productSkuItem
    //  */
    // productsSKU(productSkuItem, urlImagesFixed) {
    //     return this.gqlClient.query({
    //         query: getProductsSKU,
    //         variables: { sku: productSkuItem },
    //     }).then(res => {
    //         if(res.data.site.product !== null) {
    //             this.productsList.push({product:res.data.site.product, urlImagesFixed: urlImagesFixed});
    //         } 
    //     }).then(()=>{
    //         ReactDOM.render(<OrderBulkProductsTable productsList={this.productsList}/>, this.$container)
    //     })
    // }
    
    onReady() {   
        console.log('category'); 
        // fetch(this.urlContent).then((response) => {
        //     // The API call was successful!
        //     return response.text();
        // }).then((html) => {
        //     // Convert the HTML string into a document object
        //     let parser = new DOMParser();
        //     let doc = parser.parseFromString(html, 'text/html');

        //     // Get the csv file
        //     let csv = doc.querySelector('meta[property="og:description"]');
        //     // 
        //     console.log('csv.content', csv.content);
        //     console.log('csv.content', csv.content.length);
        //     this.csvJSON(csv.content);
        // }).catch((err) => {
        //     // There was an error
        //     console.warn('Something went wrong.', err);
        // });
    }
}