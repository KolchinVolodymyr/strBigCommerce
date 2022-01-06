import React from 'react';

export default function MetadataInformationOrderPage(props) {
    if(props.noDataAvailable) {
        return (
            <div>{props.noDataAvailable}</div>
        )
    } else {
        return (
            <div className="Order-product-item">
                {props.newData.map(el => {
                    return (
                        <div className="product-item" key={el.id}>
                            <div>Name: {el.name}</div>
                            <div>Base price: {el.base_price}</div>
                            <div>Quantity: {el.quantity}</div>
                            <div>{el.product_options.map(i => {
                                return (
                                    <div key={i.display_name} className="product-options">
                                        <div>{i.display_name}: {i.display_value}</div>
                                    </div>
                                )
                            })}</div>
                        </div>
                    )

                })}
                <div className="product-item">
                    <div>IP address: {props.newData[0].ip_address}</div>
                    <div>Hash: {props.newData[0].hash}</div>
                    <div>User agent: {props.newData[0].user_agent}</div>
                </div>
            </div>
        )
    }
}