import express, { response } from 'express';
import User from '../Models/User.js';
import value from '../controllers/UserController.js';

const router = express.Router();

const { signupDetails,updateUserDetails,userChecker,UserVerification,DeleteUser,addToCart,addToWishlist } = value;

router.get('/', userChecker);

router.post('/signup', signupDetails);

router.get('/login',UserVerification );

router.put('/update', updateUserDetails);

router.delete('/delete', DeleteUser);

router.put('/addtocart', addToCart);

router.put('/addtowishlist',addToWishlist)

export default router;