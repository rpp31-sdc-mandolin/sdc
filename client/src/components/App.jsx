import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header/Header.jsx';
import SiteMessage from './SiteMessage.jsx';
import Overview from './Overview/Overview.jsx';
import Related_Outfit from './Related_Outfit/Related_Outfit.jsx';
import QandA from './Q&A/Q&A.jsx';
import axios from 'axios';
import RatingsReviews from './Reviews/Index.jsx';
import config from '../../../config.js';
import { useEffect } from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      productId: 59553,
      outfitIds: [],
      currentProductDetails: {},
      currentProductStyles: {}
    };
    this.relatedOutfitProductClick = this.relatedOutfitProductClick.bind(this);
    this.changeInOutfit = this.changeInOutfit.bind(this);
    this.updateDetailsAndStyles = this.updateDetailsAndStyles.bind(this);
  }
   /****************************************************************************/
  /** clicking on outfit or raletd product makes that as the current product  **/
  /*****************************************************************************/
  relatedOutfitProductClick(event, productId){
    if(event.target.id !== 'Overlay_Star' && event.target.id !== 'Overlay_Circle') {

      this.setState({
        productId:productId
      });
    }
  }
  /****************************************************************************/
             /** adding/deleting  product from outfits **/
  /*****************************************************************************/
  changeInOutfit(event, productId, todo) {
    var outfitIds = this.state.outfitIds.slice(0)
    if(todo === "Add") {
      outfitIds.push(productId);
    } else if(todo === "Delete") {

      var index = outfitIds.indexOf(productId);
      outfitIds.splice(index,1);

    }
    this.setState({
      outfitIds: outfitIds
    })
  }

  updateRating(rating) {
    this.setState({
      rating: rating
    })
  }

  updateDetailsAndStyles(productDetails, productStyles) {
   this.setState({
     currentProductDetails: productDetails,
     currentProductStyles: productStyles
   })
  }

  componentDidMount(){
    axios({
      method: 'get',
      url: 'http://localhost:3000/cookies'
    })
    .then((response) => {
      var outfitIds = JSON.parse(response.data.outfitData);
      this.setState({
        outfitIds:outfitIds
      })
    })
    .catch((error) => {
      console.log('error: in APP', error);
    });
    // API calls for product ID and styles
    let productIdOptions = {
      url: `/products/${this.state.productId}`,
      method: 'get',
      headers: {'Content-Type': 'application/json',
      'Authorization': config.API_KEY}
    };
    let productStylesOptions = {
      url: `products/${this.state.productId}/styles`,
      method: 'get',
      headers: {'Content-Type': 'application/json',
      'Authorization': config.API_KEY}
    };
    axios(productIdOptions)
      .then(response => {
        this.setState({ currentProductDetails: response.data });
        axios(productStylesOptions)
        .then(response => {
          this.setState({ currentProductStyles: response.data });
            })
          })
          .catch(error => {
            console.log(error)});
  }

  // useEffect (() => {
  //   let productIdOptions = {
  //     url: `/products/${this.state.productId}`,
  //     method: 'get',
  //     headers: {'Content-Type': 'application/json',
  //     'Authorization': config.API_KEY}
  //   };
  //   let productStylesOptions = {
  //     url: `products/${this.state.productId}/styles`,
  //     method: 'get',
  //     headers: {'Content-Type': 'application/json',
  //     'Authorization': config.API_KEY}
  //   };
  //   axios(productIdOptions)
  //     .then(response => {
  //       this.setState({ currentProductDetails: response.data });
  //       axios(productStylesOptions)
  //       .then(response => {
  //         this.setState({ currentProductStyles: response.data });
  //           })
  //         })
  //           .catch(error => {
  //             console.log(error)});
  // }, [this.state.productId]);

  // componentDidUpdate(prevProps) {
  //   console.log('PREV STATE:', prevProps);
  //   console.log('PREV STATE PRODUCT ID:', prevProps.startingProductId);
  //   console.log('CURRENT STATE PRODUCT ID:', this.state.productId);
  //   if(prevProps.startingProductId !== this.state.productId) {
  //     let productIdOptions = {
  //       url: `/products/${this.state.productId}`,
  //       method: 'get',
  //       headers: {'Content-Type': 'application/json',
  //       'Authorization': config.API_KEY}
  //     };
  //     let productStylesOptions = {
  //       url: `products/${this.state.productId}/styles`,
  //       method: 'get',
  //       headers: {'Content-Type': 'application/json',
  //       'Authorization': config.API_KEY}
  //     };
  //     axios(productIdOptions)
  //       .then(response => {
  //         this.setState({ currentProductDetails: response.data });
  //         axios(productStylesOptions)
  //         .then(response => {
  //           this.setState({ currentProductStyles: response.data });
  //             })
  //           })
  //           .catch(error => {
  //             console.log(error)});
  //   }
  // }


  trackUserInteractions(widget, event) {
    let date = new Date();
    let timeOfInteraction = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    let interactionToLog = {
      element: event.target.outerHTML,
      widget: widget,
      time: timeOfInteraction
    };

    axios.post('/interactions', {
      element: event.target.outerHTML,
      widget: widget,
      time: timeOfInteraction
    })
      .then((reponse) => {
        console.log('Interaction Successfully Logged!');
      })
      .catch((err) => console.log('ERROR!!!!!!', err));
  }

  render() {
    return (
      <div id='App'>
        <Header />
        <SiteMessage />
        <Overview
          updateDetailsAndStyles={this.updateDetailsAndStyles}
          productById={this.state.currentProductDetails}
          productStyles={this.state.currentProductStyles}
          cam_token={this.props.cam_token}
          productId={this.state.productId}
          changeInOutfit={this.changeInOutfit}
          outfitIds={this.state.outfitIds}
          trackUserClicks={this.trackUserInteractions}/>
        <Related_Outfit
          productId={this.state.productId}
          changeInOutfit={this.changeInOutfit}
          outfitIds={this.state.outfitIds}
          productClick={this.relatedOutfitProductClick}
          trackUserClicks={this.trackUserInteractions}/>
        <QandA
          productId={this.state.productId}
          trackUserClicks={this.trackUserInteractions}/>
        <RatingsReviews
          product_id={this.state.productId}
          updateRating={this.updateRating.bind(this)}
          trackUserClicks={this.trackUserInteractions}/>
      </div>
    )
  }
};

App.propTypes = {
  cam_token: PropTypes.string
}
App.propTypes = {
  products: PropTypes.array,
  startingProductId: PropTypes.number
}

export default App;