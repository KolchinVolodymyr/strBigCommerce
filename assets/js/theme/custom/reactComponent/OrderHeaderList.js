import React from 'react';

export default class OrderHeaderList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.orderItem  === 0) {
            <div className="containerDetailProduct">
                You have {this.props.orderItem} incomplete orders
            </div>
        } else {
            return (
                <div className="containerDetailProduct">
                    You have {this.props.orderItem} incomplete orders
                </div>
            )
        }
    }
}