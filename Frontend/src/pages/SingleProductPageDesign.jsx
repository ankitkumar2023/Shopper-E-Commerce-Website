import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../components/Breadcrums/Breadcrum";
import ProductDisplay from "../components/ProductDisplay/SingleProductPage";
import DescriptionBox from "../components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../components/RelatedProducts/RelatedProducts";

function Product() {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  console.log(productId);

  const product = all_product.find((e) => e._id === (productId));

  if (!product) {
    return <div>Product not found</div>;
  }
  

  return (
    <>
      <div>
        <Breadcrum product={product} />
        <ProductDisplay product={product} ProductId={productId} />
        <DescriptionBox />
        <RelatedProducts />
      </div>
    </>
  );
}

export default Product;
