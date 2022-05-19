import React from 'react'; 
import Slider from "react-slick";

export default class SliderRecommendedProduct extends React.Component {
    constructor(props) {
        super(props);
    }
    

    render() {
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
          };
        
        return (
            <>
            {this.props.productsList.length > 4  
            ? <Slider {...settings}>
                {this.props.productsList.map(el => {
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
            </Slider> 
            : this.props.productsList.map(el =>{
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
            </>
        )
    }
}

