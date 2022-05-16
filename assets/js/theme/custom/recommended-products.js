import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import getProductMetafields from './gql/getProductMetafields.gql';
import getProductsSKU from './gql/getProductsSKU.gql';
import 'regenerator-runtime/runtime';


export default class RecommendedProducts extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.productSKUsArray = [];
        this.productsList = [];
        // this.$container = $('.bulk-order-container')[0];
        // this.showPage = null;
        // this.productVariants = [];
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
            this.productsList.push(res.data.site.product);
        }).then(()=> {
            console.log('this.productsList', this.productsList);
        })
    }

    async categoryMetafields() {
        this.gqlClient
        .query({
            query: getProductMetafields,
            variables: { productId: parseInt(this.context.productId), },
            }).then((response) => {
                response.data.site.product.metafields.edges.map(el => {
                    this.productSKUsArray.push(...el.node.value.replace(/\s/g, '').split(','))
                })
            }).then(()=>{
                this.productSKUsArray.map(el => {
                    console.log('element', el);
                    this.productsSKU(el);
                })
            })
    }

    onReady() {
        // console.log('this.context', this.context.productId);
        // console.log('recommernded-product');
        this.categoryMetafields();
       
    }
}