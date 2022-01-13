import React from 'react';

export default function ButtonOrderList(props) {
    return (
        <div>
            {props.el.map((index)=> {
                return (
                    <div key={index.id}>
                        <button id={index.id} data-id={index.id} className="button button--primary">{index.showPage}</button>
                    </div>
                )
            })}
        </div>
    )
}