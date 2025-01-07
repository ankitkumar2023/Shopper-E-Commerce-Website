
import Product from '../Models/Product.js';
import User from '../Models/User.js'


const updateUserDetails =  async (req, res) => {
    try {
        const { Email } = req.query;
        
        const updateData = req.body;

        if (!Email) {
            return res.status(404).json({ message: "Email is Required" })
        }
        
        const updatedData = await User.findOneAndUpdate({ Email }, { $set: updateData }, { new: true });

        if (!updatedData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Successfully Updated", updatedData });

    } catch (error) {
        console.log("Error while updating the user data", error);
        res.status(500).json({ message: "Internal server Error" });
    }
}

const signupDetails = async (req, res) => {
    try {
      const {
        FirstName,
        LastName,
        Gender,
        Mobile,
        Email,
        Password,
        Address: { Pincode, State, City, Locality, House_Number } = {},
      } = req.body;
  
      // Ensure required fields are present
      if (!FirstName || !LastName || !Email || !Password || !Pincode || !State || !City) {
        return res.status(400).json({ok:false, message: "Missing required fields" });
      }
  
      const newUser = new User({
        FirstName,
        LastName,
        Gender,
        Email,
        Password,
        Mobile,
        Address: {
          Pincode,
          State,
          City,
          Locality,
          House_Number,
        },
      });
  
      const response = await newUser.save();
      res.status(200).json({ ok:true,message: "Successfully saved the user data", response });
      console.log("User data saved successfully");
    } catch (error) {
      console.error("Error while saving the data", error);
      res.status(500).json({ok:false, message: "Internal Server Error", error });
    }
  };
  


const userChecker= async (req, res) => {

    const { Email } = req.query;
    try {
        let response = await User.findOne({Email});
        res.status(200).json(response);

    } catch (error) {
        console.log("Error while fetching the user data",error)
    }
}
const UserVerification = async (req, res) => {
    try {
      const { Email, Password } = req.query;
  
      const user = await User.findOne({ Email });
      if (user && user.Password === Password) {
        return res.status(200).json({ ok: true, message: "Login Successfully", user });
      } else {
        return res.status(404).json({ ok: false, message: "User not found" });
      }
    } catch (error) {
      console.log("Error while fetching user data", error);
      res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
  };
  

const DeleteUser = async (req, res) => {
    try {
        const { Email } = req.query;

        const userDetails = await User.findOneAndDelete({ Email });
        
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({message:"Successfully deleted the account",userDetails})
    } catch (error) {
        console.log("Error while deleting the account", error);
        res.status(500).json({ message: "Internal server Error" });
    }

}

const addToCart = async (req, res) => {
    try {
        const { UserId } = req.query;
        console.log(UserId)
        const { ProductId, Size, Quantity } = req.body;
    
        const userDetails = await User.findOne({ _id: UserId });
        console.log(userDetails);

        if (!userDetails) {
            return res.status(404).json({ message: "UserNot Found" });
        }

        userDetails.Cart.push({ProductId,  Size, Quantity });

        if (userDetails.Cart.length == 0) {
            return res.status(404).json({ message: "can't able to add product to cart" });
        }
        res.status(201).json({ message: "Item successfully added to cart",userDetails })
    } catch (error) {
        console.log("Error while adding item to cart", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}


const addToWishlist = async (req, res) => {
    try {
        const { ProductId, UserId } = req.query;
        
        console.log(ProductId, UserId);

        let user = await User.findById(UserId);
        console.log(user)
       
        if (user["Wishlisted"].length == 0) {
            user["Wishlisted"].push(ProductId)
        } else {
            const result = await user["Wishlisted"].filter((val) => val == ProductId);
    
            if (result.length == 0) {
                user["Wishlisted"].push(ProductId);
                return res.status(201).json({ message: "Item successfully added to wishlist" })
            } else {
                const newval = await user["Wishlisted"].filter((val) => val != ProductId);
    
                user["Wishlisted"] = newval;
                return res.status(201).json({ message: "Item remove from wishlist successfully" })
            }
        }
        let result = await user.save();
        let WishlistVal = user["Wishlisted"];
        res.status(201).json({ message: "Item Successfully added to wishlist", WishlistVal, result })
        
    } catch (error) {
        console.log("Error while Updating th wishlist", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
   
};

const value = { updateUserDetails, signupDetails,userChecker,UserVerification ,DeleteUser,addToCart,addToWishlist};
export default value;