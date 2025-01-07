
import Product from '../Models/Product.js'

const getAllProducts = async (req, res) => {
    try {
        const allProduct = await Product.find();
        if (!allProduct) res.status(404).json({ message: "Cant find any product" });
        res.status(201).json(allProduct);
    } catch (error) {
        console.log("Error while fetching all product details", error);
        res.status(500).json({message:"Internal server Error"})

    }
    
}

const getProductDetails = async (req, res) => {
    try {
        const { ProductId } = req.query;
        const product = await Product.findOne({_id:ProductId});
       
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }
        res.status(200).json({message:"Product Found",product})
    } catch (error) {
        console.log("Error while fetching the product data", error);
        res.status(500).json({ message: "Internal server Error" })
    }
}

const updateProductDetails = async (req, res) => {
    try {
        const { ProductId } = req.query;

        const {Price,Offer_Price,}= req.body

        const updatedProduct = await Product.findByIdAndUpdate(ProductId, { $set: { Price: Price,Offer_Price: Offer_Price ,Discount : Math.floor(((Price - Offer_Price) / Price) * 100) } }, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Item not found" });
        } 
        console.log("successfully updated the new value");
        res.status(201).json({ message: "item's value successfully updated", updatedProduct });
    } catch (error) {
        console.log("Error while fetching the product data", error);
        res.status(500).json({ message: "Internal server error" });
    }

}



const FilterProducts = async (req, res) => {
    try {
      const {
        MaxPriceValue,
        Category,
        Color,
        Brand,
        MinPriceValue,
        Gender,
        Discount,
        SortBy,
        Size,
      } = req.query;
  
      // Default products
      if (!MaxPriceValue && !Category && !Color && !Brand && !Gender && !Size) {
        const AllProducts = await Product.find();
        let allBrandName = [...new Set(AllProducts.map((item) => item.Brand))];
        let allProductColor = [...new Set(AllProducts.map((item) => item.Color))];
        let allDiscount = [...new Set(AllProducts.map((item) => item.Discount))];
        if (!AllProducts)
          return res
            .status(404)
            .json({ message: "Error while fetching data" });
  
        return res.status(200).json({
          message: "All product data",
          AllProducts,
          allBrandName,
          allProductColor,
          allDiscount,
        });
      }
  
      // Dynamic filters
      let matchCategory = {};
      if (Category) matchCategory.Category = Category;
      if (Color) matchCategory.Color = { $in: Color.split(",") };
      if (Brand) matchCategory.Brand = { $in: Brand.split(",") };
      if (MaxPriceValue)
        matchCategory.Offer_Price = { $lte: Number(MaxPriceValue) };
      if (MinPriceValue) {
        matchCategory.Offer_Price = {
          ...(matchCategory.Offer_Price || {}),
          $gte: Number(MinPriceValue),
        };
      }
      if (Gender) matchCategory.Gender = Gender;
      if (Discount) matchCategory.Discount = { $gte: Number(Discount) };
      if (Size)
        matchCategory.ProductQuantity = {
          $elemMatch: { Size: { $in: Size.split(",") } },
        };
  
      console.log(matchCategory);
  
      // Apply aggregation
      let filterData = await Product.aggregate([{ $match: matchCategory }]);
  
      // Handle empty results
      if (filterData.length === 0) {
        return res.status(200).json({
          message: "No products found with the selected filters",
          filterData: [],
        });
      }
  
      // Sorting
      if (SortBy === "Asc") {
        filterData = filterData.sort((a, b) => a.Offer_Price - b.Offer_Price);
      } else if (SortBy === "Dsc") {
        filterData = filterData.sort((a, b) => b.Offer_Price - a.Offer_Price);
      }
  
      let allBrandName = [...new Set(filterData.map((item) => item.Brand))];
      let allProductColor = [...new Set(filterData.map((item) => item.Color))];
      let allDiscount = [...new Set(filterData.map((item) => item.Discount))];
  
      res.status(200).json({
        message: SortBy
          ? `Products filtered and sorted in ${
              SortBy === "Asc" ? "ascending" : "descending"
            } order`
          : "Filtered products",
        filterData,
        allBrandName,
        allProductColor,
        allDiscount,
      });
    } catch (error) {
      console.error("Error while fetching the data:", error.message, error.stack);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  


const value = { getAllProducts,getProductDetails,updateProductDetails,FilterProducts };

export default value;