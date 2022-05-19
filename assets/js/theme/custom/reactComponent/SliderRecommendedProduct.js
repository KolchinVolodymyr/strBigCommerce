import React from 'react'; 

export default class SliderRecommendedProduct extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            {this.props.productsList.length > 4  
            ? <div data-slick='{"slidesToShow": 4, "slidesToScroll": 1}'>
                <div className="productCarousel-slide">
                    1
                </div>
                <div className="productCarousel-slide">
                    2
                </div>
                <div className="productCarousel-slide">
                    3
                </div>
                <div className="productCarousel-slide">
                    4
                </div>
                <div className="productCarousel-slide">
                    5
                </div>
                <div className="productCarousel-slide">
                    6
                </div>
            </div> 
            : this.props.productsList.map(el =>{
                console.log('this.props.productsList', this.props.productsList.length);
                return(
                    
                    <div className='card-custom' key={el.entityId}>
                        <div className='card-img-container-item'>
                            <img src={el.defaultImage.url} className='card-img'/>
                        </div>
                        <div className='brand-item'>
                            {el?.brand?.name}
                        </div>
                        <a href={el.path}>
                            <h3 className='card-title'>{el.name}</h3>
                        </a>
                        <div className='card-text'>₴{el.prices.price.value}</div>
                    </div> 
                )
            })}
                {/* {this.props.productsList.map(el =>{
                    console.log('this.props.productsList', this.props.productsList.length);
                    return(
                        
                        <div className='card-custom' key={el.entityId}>
                            <div className='card-img-container-item'>
                                <img src={el.defaultImage.url} className='card-img'/>
                            </div>
                            <div className='brand-item'>
                                {el?.brand?.name}
                            </div>
                            <a href={el.path}>
                                <h3 className='card-title'>{el.name}</h3>
                            </a>
                            <div className='card-text'>₴{el.prices.price.value}</div>
                        </div> 
                    )
                })} */}
            </>
        )
    }
}

