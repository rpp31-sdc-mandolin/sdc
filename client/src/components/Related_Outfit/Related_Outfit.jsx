import React from 'React';
import Related_ProductInfo from './Related_ProductInfo.jsx';
import Comparison from './Comparison.jsx';
import data from '../../../data/Related_Outfit.js';
import PropTypes from 'prop-types';
import $ from 'jquery';
import fetch from './fetchData';
class Related_Outfit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      productId: this.props.productId,
      productInfo:{},
      relatedProductIds:[],
      relatedProducts:[],
      outfitIds:[],
      outfits:[],
      popup: false,
      popup_style:{"display":"none"}
    };
    this.starButtonClick = this.starButtonClick.bind(this);
  }
  starButtonClick(event){
    console.log('event on click');
    var popup = !(this.state.popup);
    var style = {};
    if(popup) {
      style = {"display":"block"}
    } else {
      style = {"display":"none"}
    }

    this.setState({
      popup: popup,
      popup_style:style
    });

  }
  //fetch related product ids and their details for a particular productId
  fetchRelatedInfo(productId) {
     // fetch related product ids
     fetch.relatedProductIDs(this.props.productId)
     .then((relatedProductIds) => {
       console.log('result from server:', relatedProductIds);
       var related = [];
       //get unique product Ids
       relatedProductIds.forEach((productId, index) => {
          if(relatedProductIds.indexOf(productId) === index){
           related.push(productId);
          }
       })
       //set the state
       this.setState({
         relatedProductIds: related
       })
       return related;
     })
     .then((related) => {
       console.log('unique ids:', related);
       fetch.relatedProductDetails(related)
       .then((relatedProductDetails) => {
         console.log('result from server the DETAILS:', relatedProductDetails);
         this.setState({
           relatedProducts: relatedProductDetails
         })
       })
       .catch((error) => {
         console.log('error in fetching DETAILS', error);
       })
     })
     .catch((error) => {
       console.log('error:',error);
     })
  }
  addToOutfit(){
    var outfitIds = this.state.outfitIds.slice(0);
    var outfits = this.state.outfits.slice(0);
    if(outfitIds.indexOf(this.props.productId) === -1) {
      outfitIds.push(this.props.productId);
      outfits.push(this.state.productInfo);
    }

    this.setState({
      outfitIds: outfitIds,
      outfits: outfits
    })
    console.log('outfits', outfits);
  }
  //fetching the current product info
  fetchProductInfo(productId) {
    fetch.productInfo(productId)
    .then((result) => {
      console.log('result product Info:', result);
      this.setState({
        productInfo: result
      })
    })
    .catch((error) => {
      console.log('error:',error);
    });
  }

  fetchProductStyles(productId) {
    fetch.productStyles(productId)
    .then((styles) => {
      console.log('result product Styles:', styles);
      var productInfo = this.state.productInfo;
      if(productInfo.styles === undefined) {
        productInfo.styles = styles.results;
      }
      console.log('after updating styles', productInfo);
      this.setState({
        productInfo: productInfo
      })

    })
    .catch((error) => {
      console.log('error:',error);
    });
  }
  componentDidMount(){
    this.setState({
      productId:this.props.productId
    });
    this.fetchRelatedInfo(this.props.productId);
    this.fetchProductInfo(this.props.productId);
    this.fetchProductStyles(this.props.productId);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.productId !== this.props.productId) {
      this.fetchRelatedInfo(this.props.productId);
      this.fetchProductInfo(this.props.productId);
      this.fetchProductStyles(this.props.productId);
    }
  }
  scroll(event, scrollOffset){

    var element = event;
    var element1 = $('div#Related_Outfit div.Related_products');
    console.log('element1:', element1)
    console.log('event:',event);
    if(event.target.className === 'PreviousProd Related' || event.target.className ==='PreviousProd Outfit') {
      element = event.target.nextElementSibling;
    }else{
      element = event.target.previousElementSibling;
    }
    console.log('element:',element);
    console.log('scrollleft before:',element.scrollLeft);
    element.scrollLeft= element.scrollLeft + scrollOffset;
    console.log('scrollleft:',element.scrollLeft);
  }
  render() {
   console.log("this.state", this.state.relatedProducts);
   if(this.state.relatedProducts.length === 0) {
     return (
       <div id='Related_Outfit'>
         Related Products and your outfits here
       </div>
     )
   }

    return(

      <div id='Related_Outfit'>
        <h1 id="Related_Header">Related Products</h1>
          <button className="PreviousProd Related"  onClick={(event)=>this.scroll(event,-250)}><i className="fa fa-angle-left"></i></button>
            <div className="Related_products">
              {this.state.relatedProducts.map((product) => (
                <Related_ProductInfo key={product.id} product={product} component={'Related'} starButtonClick={this.starButtonClick} productClick={this.props.productClick}/>
              ))}

            </div>

            <button className="NextProd Related" onClick={(event)=>this.scroll(event,+250)}><i className="fa fa-angle-right"></i></button>



          <h1 id="Outfit_Header">Your Outfit</h1>
          <button className="PreviousProd Outfit" onClick={(event)=>this.scroll(event,-250)}><i className="fa fa-angle-left"></i></button>

            <div id="Outfit">
              <button id="Related_Plus" onClick={()=>this.addToOutfit()}><i className="fa fa-plus"></i><div>Add to Outfit</div></button>
              {this.state.outfits.map((product) => (
                <Related_ProductInfo key={product.id} product={product} component={'Outfit'} productClick={this.props.productClick}/>
              ))}
            </div>
            <button className="NextProd Outfit" onClick={(event)=>this.scroll(event,+250)}><i className="fa fa-angle-right"></i></button>
          <div id="Comparison">
             <Comparison popup={this.state.popup} style={this.state.popup_style} />
            </div>
      </div>
    )
  }
};
Related_Outfit.propTypes = {
  productId:PropTypes.number,
  productClick:PropTypes.func

}

export default Related_Outfit;

/*<div className="related">
          <div>
            <button>Prev</button>
          </div>
          <Related_Products productId = {this.state.productId} relatedProducts = {this.state.relatedProducts}/>
          <div>
            <button>Next</button>
          </div>
        </div>*/


        /*<div className="outfit">
           <Outfit productId = {this.state.productId} productInfo={this.state.productInfo}/>
        </div>*/
       // <Outfit productId = {this.state.productId} productInfo={this.state.productInfo}/>