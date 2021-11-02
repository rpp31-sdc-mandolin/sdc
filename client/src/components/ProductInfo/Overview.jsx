import React, { useState, useEffect }  from 'react';
// import { useState } from 'React';
import PropTypes from 'prop-types';
import axios from 'axios';


// removed products from props
let Overview = ({cam_token}) => {
  let mockData = [{
    "id": 59553,
    "campus": "hr-rpp",
    "name": "Camo Onesie",
    "slogan": "Blend in to your crowd",
    "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
    "category": "Jackets",
    "default_price": "140.00",
    "created_at": "2021-10-18T22:50:41.839Z",
    "updated_at": "2021-10-18T22:50:41.839Z"
}];
  const [products, setProducts] = useState(mockData);
  const [index, setIndex] = useState(0);

  console.log('PRODUCTS:', products);


  let productOptions = {
    url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products',
    method: 'get',
    headers: {'Content-Type': 'application/json',
    'Authorization': cam_token.cam_token}
  };


  useEffect(() => {
    axios(productOptions)
      .then(response => {
        console.log('response:', response)
        setProducts(response.data);
      })
        .catch(error => {
          console.log(error)});
      }, [])



  let currentProduct = products[index];
  console.log('CURRENT PRODUCT:', currentProduct);

    return (
      <div id='Overview'>
        <ImageGallery products={products} />
        <ProductInformation products={products} />
        <StyleSelector products={products} />
        <AddToCart products={products} />
        <ProductSloganAndDescription products={products} />
        <ProductFeatures products={products} />
      </div>
    );

  };

  // Image Gallery Component
  let ImageGallery = ({products}) => {
    return (
      <div className="ImageGallery">
        <div className="MainImage">
          Main image here
        </div>
        <div className="ImageGalleryThumbnails">
          <div className="GalleryThumbnail">Test</div>
          <div className="GalleryThumbnail">Test</div>
          <div className="GalleryThumbnail">Test</div>
          <div className="GalleryThumbnail">Test</div>
          <div className="GalleryThumbnail">Test</div>
        </div>
        <div className="SlideGalleryLeft">
          <div className="SlideGalleryLeftButton">←</div>
        </div>
        <div className="SlideGalleryRight">
          <div className="SlideGalleryRightButton">→</div>
        </div>
        <div className="OpenGalleryModal">
          <div className="OpenGalleryModalButton">⧠</div>
        </div>
      </div>
    );
  }

  // Product Information Component (split with Slogan, Description, and Features)
  let ProductInformation = ({products}) => {
    return (
      <div className="ProductInformation">
        <div className="StarsAndReviews">
          <div>
          Stars here (*****)
          </div>
          <div>
          <a href="">Read all (#) reviews</a>
          </div>
        </div>
        <div className="ProductCategory">
          {products[0].category}
        </div>
        <div className="ProductName">
          {products[0].name}
        </div>
        <div>
          {`$${products[0].default_price}`}
        </div>
      </div>
    );
  }

  // Style Selector Component
  let StyleSelector = ({products}) => {
    return (
      <div className="StyleSelector">
        <div className="SelectedStyle">
          <div className="SelectedStyleHeader">
          Style:
          </div>
          <div className="SelectedStyleDescription">
          Selected Style
          </div>
        </div>
        <div className="StyleSelectorIcons">
          <div className="StyleIcon">Test</div>
          <div className="StyleIcon">Test</div>
          <div className="StyleIcon">Test</div>
          <div className="StyleIcon">Test</div>
          <div className="StyleIcon">Test</div>
          <div className="StyleIcon">Test</div>
          <div className="StyleIcon">Test</div>
          <div className="StyleIcon">Test</div>
        </div>
      </div>
    );
  }

  // Add to Cart Component
  let AddToCart = ({products}) => {
    return (
      <div className="AddToCart">
        <div className="SizeSelector">
          <form>
            <select className="SizeSelectorDropdown" onChange={() => console.log('Size clicked!')}>
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </form>
        </div>
        <div className="QuanititySelector">
          <form>
            <select className="QuanititySelectorDropdown" onChange={() => console.log('Quantity clicked!')}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </form>
        </div>
        <div className="AddToBag">
          <button className="AddToBagButton" onClick={() => console.log('Add to Bag clicked!')}>Add to Bag</button>
        </div>
        <div className="AddToFavorite">
          <button className="AddToFavoriteButton" onClick={() => console.log('Add to My Outfit clicked!')}>☆</button>
        </div>
      </div>
    );
  }

  // Product Slogan and Description Component
  let ProductSloganAndDescription = ({products}) => {
    return (
      <div className="ProductSloganAndDescription">
          <div className="ProductSlogan">
            {products[0].slogan}
          </div>
          <div className="ProductDescription">
            {products[0].description}
          </div>
      </div>
    );
  }

  // Product Features Component
  let ProductFeatures = ({products}) => {
    return (
      <div className="ProductFeatures">
        <div className="ProductFeaturesList">
          <div>✔ Product Feature 1</div>
          <div>✔ Product Feature 2</div>
          <div>✔ Product Feature 3</div>
          <div>✔ Product Feature 4</div>
        </div>
      </div>
    );
  }

Overview.propTypes = {
  cam_token: PropTypes.string
}
ImageGallery.propTypes = {
  products: PropTypes.array
}
ProductFeatures.propTypes = {
  products: PropTypes.array
}
ProductSloganAndDescription.propTypes = {
  products: PropTypes.array
}
AddToCart.propTypes = {
  products: PropTypes.array
}
StyleSelector.propTypes = {
  products: PropTypes.array
}
Overview.propTypes = {
  products: PropTypes.array
}
ProductInformation.propTypes = {
  products: PropTypes.array
}

export default Overview;