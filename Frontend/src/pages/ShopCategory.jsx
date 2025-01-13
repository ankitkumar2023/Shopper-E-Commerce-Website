import React, { useContext, useState, useEffect } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdown_icon from "../components/Assets/dropdown_icon.png";
import Item from "../components/Item/Item";

function ShopCategory(props) {
  const { fetchData, all_product, allBrandName, allProductColor, allDiscount } =
    useContext(ShopContext);
  console.log("all product data :-",all_product)

  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    discounts: [],
  });

  const [expandedFilters, setExpandedFilters] = useState({
    brands: false,
    colors: false,
    discounts: false,
  });

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data when the selected gender changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await fetchData(props.Gender, {
        brands: filters.brands.join(","),
        colors: filters.colors.join(","),
        discounts: filters.discounts.join(","),
      });
      setLoading(false);
    };
    fetchProducts();
  }, [props.Gender, filters]); // Re-fetch data when filters change

  // Filter products based on selected filters
  useEffect(() => {
    const filterProducts = () => {
      const uniqueProducts = new Map();
      all_product.forEach((product) => {
        if (!uniqueProducts.has(product._id)) {
          uniqueProducts.set(product._id, product);
        }
      });
      return Array.from(uniqueProducts.values()).filter((product) => {
        const isBrandMatched =
          filters.brands.length === 0 || filters.brands.includes(product.Brand);
        const isColorMatched =
          filters.colors.length === 0 || filters.colors.includes(product.Color);
        const isDiscountMatched =
          filters.discounts.length === 0 ||
          filters.discounts.includes(`${product.Discount}%`);

        return isBrandMatched && isColorMatched && isDiscountMatched;
      });
    };

    setFilteredProducts(filterProducts());
  }, [filters, all_product]);

  // Handle checkbox filter changes
  const handleFilterChange = (filterType, value, isChecked) => {
    setFilters((prev) => {
      let updatedFilter;
      if (isChecked) {
        updatedFilter = [...prev[filterType], value];
      } else {
        updatedFilter = prev[filterType].filter((item) => item !== value);
      }
      return { ...prev, [filterType]: updatedFilter };
    });
  };

  // Toggle expanded state for filters
  const toggleExpand = (filterType) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  if (loading) {
    return <div className="loader">Loading products...</div>;
  }

  return (
    <div className="shop-category-container">
      {/* Filter Menu */}
      <div className="filter-menu">
        <h3>Filter by</h3>
        <div>
          <h4>Brands</h4>
          {allBrandName
            .slice(0, expandedFilters.brands ? allBrandName.length : 4)
            .map((brand, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={brand}
                  checked={filters.brands.includes(brand)} // Ensure checkbox reflects current state
                  onChange={(e) =>
                    handleFilterChange("brands", brand, e.target.checked)
                  }
                />
                {brand}
              </label>
            ))}
          {allBrandName.length > 4 && (
            <button onClick={() => toggleExpand("brands")}>
              {expandedFilters.brands ? "See Less" : "See More"}
            </button>
          )}
        </div>
        <div>
          <h4>Colors</h4>
          {allProductColor
            .slice(0, expandedFilters.colors ? allProductColor.length : 4)
            .map((color, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={color}
                  checked={filters.colors.includes(color)} // Ensure checkbox reflects current state
                  onChange={(e) =>
                    handleFilterChange("colors", color, e.target.checked)
                  }
                />
                {color}
              </label>
            ))}
          {allProductColor.length > 4 && (
            <button onClick={() => toggleExpand("colors")}>
              {expandedFilters.colors ? "See Less" : "See More"}
            </button>
          )}
        </div>
        <div>
          <h4>Discount</h4>
          {allDiscount
            .map((discount) => Math.floor(discount)) // Floor each discount value
            .filter((discount) => discount > 0) // Keep only values greater than 0
            .slice(0, expandedFilters.discounts ? allDiscount.length : 4)
            .map((discount, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={discount}
                  checked={filters.discounts.includes(`${discount}%`)} // Ensure checkbox reflects current state
                  onChange={(e) =>
                    handleFilterChange(
                      "discounts",
                      `${discount}%`,
                      e.target.checked
                    )
                  }
                />
                {`  ${discount}% `}
              </label>
            ))}
          {allDiscount.length > 4 && (
            <button onClick={() => toggleExpand("discounts")}>
              {expandedFilters.discounts ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>

      {/* Product Section */}
      <div className="shop-category">
        <img className="shopcategory-banner" src={props.banner} alt="Banner" />
        <div className="shopcategory-indexSort">
          <p>
            <span>Showing {filteredProducts.length}</span> out of{" "}
            {all_product.length} products
          </p>
          <div className="shopcategory-sort">
            Sort by <img src={dropdown_icon} alt="Sort Icon" />
          </div>
        </div>
        <div className="shopcategory-products">
          {filteredProducts.map((item) => (
            <Item
              key={item._id} // Use unique id for key
              id={item._id}
              name={item.Brand}
              image={item.Image1}
              new_price={item.Offer_Price}
              old_price={item.Price}
              discount={item.Discount}
            />
          ))}
        </div>
        <div className="shopcategory-loadmore">Explore More</div>
      </div>
    </div>
  );
}

export default ShopCategory;
