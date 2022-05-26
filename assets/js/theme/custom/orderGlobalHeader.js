import React from 'react';
import ReactDOM from 'react-dom';
import OrderHeaderList from '../custom/reactComponent/OrderHeaderList'
import initApolloClient from '../global/graphql/client';
import customerData from './gql/customerData.gql';

export default function (context) {
    let gqlClient = initApolloClient(context.storefrontAPIToken);

    gqlClient.query({
        query: customerData,
    }).then(res => {
        if (res.data.customer === null) {
             console.log('res.data.customer', res.data.customer);
        } else { 
            fetch('http://localhost:8080/orders', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: res.data.customer.entityId})
                })
            .then(res => res.json())
            .then((data)=> {
                const orderItem = [];
                data.map(el=>{
                    if(el.status === 'Declined' || el.status === 'Completed' || el.status === 'Cancelled') {
                    } else {
                        orderItem.push(el)
                    }
                }) 
                ReactDOM.render(<OrderHeaderList orderItem={orderItem.length}/>, $('#order-list')[0])
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
    
}