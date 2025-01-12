
import Product from '../Models/Product.js'

const getAllProducts = async (req, res) => {
    try {
        const allProduct = await Product.find();
        if (!allProduct) res.status(404).json({ message: "Cant able to fetch products data" });
      res.status(201).json({ ok:true,message: "All product data successfully fetched",allProduct });
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

    

    // Build the match object
    const matchCategory = {};
    if (Category) matchCategory.Category = Category;
    if (Color) matchCategory.Color = { $in: Color.split(",") }; // Filter by color
    if (Brand) matchCategory.Brand = { $in: Brand.split(",") }; // Filter by brand
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

    console.log("Filter Conditions:", matchCategory);

    // Use aggregate pipeline for filtering
    let filterData = await Product.aggregate([
      { $match: matchCategory }, // Filter products matching criteria
      {
        $group: {
          _id: "$_id", // Group by unique product ID
          Image1: { $first: "$Image1" },
          Image2: { $first: "$Image2" },
          Category: { $first: "$Category" },
          Color: { $first: "$Color" },
          Brand: { $first: "$Brand" },
          Offer_Price: { $first: "$Offer_Price" },
          Gender: { $first: "$Gender" },
          Discount: { $first: "$Discount" },
          ProductQuantity: { $first: "$ProductQuantity" },
        },
      },
      // Optional: Add a distinct operation after grouping to avoid any duplicates
      { $project: { _id: 1, Image1: 1, Image2: 1, Category: 1, Color: 1, Brand: 1, Offer_Price: 1, Gender: 1, Discount: 1, ProductQuantity: 1 } }
    ]);

    // Sort the filtered data if needed
    if (SortBy === "Asc") {
      filterData = filterData.sort((a, b) => a.Offer_Price - b.Offer_Price);
    } else if (SortBy === "Dsc") {
      filterData = filterData.sort((a, b) => b.Offer_Price - a.Offer_Price);
    }

    // Deduplicate using the _id in the aggregation itself
    const seen = new Set();
    filterData = filterData.filter((item) => {
      if (seen.has(item._id)) {
        return false;
      }
      seen.add(item._id);
      return true;
    });

    // Extract unique brand names, colors, and discounts
    const allBrandName = [...new Set(filterData.map((item) => item.Brand))];
    const allProductColor = [...new Set(filterData.map((item) => item.Color))];
    const allDiscount = [...new Set(filterData.map((item) => item.Discount))];

    res.status(200).json({
      message: "Filtered products",
      filterData,
      allBrandName,
      allProductColor,
      allDiscount,
    });
  } catch (error) {
    console.error("Error in FilterProducts:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};



  


const value = { getAllProducts,getProductDetails,updateProductDetails,FilterProducts };

export default value;