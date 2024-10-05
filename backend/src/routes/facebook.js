const express = require('express');
const axios = require('axios');
const User = require('../models/User');  // Adjust the path as needed
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/auth', auth, async (req, res) => {
  const { accessToken, userInfo } = req.body;

  try {
    // Verify the access token
    const response = await axios.get(`https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`);

    if (response.data.data.is_valid) {
      // Token is valid, find or create user
      console.log("user id", req.user)
      const user = await User.findById(req.user);  // req.user.id comes from your auth middleware
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Update user with Facebook info
      user.facebookId = userInfo.id;
      user.facebookAccessToken = accessToken;
      // You might want to update other fields like name or email if they're not set
      if (!user.name) user.name = userInfo.name;
      if (!user.email) user.email = userInfo.email;

      await user.save();

      // Get user's Facebook pages
      const pagesResponse = await axios.get(`https://graph.facebook.com/v12.0/${userInfo.id}/accounts?access_token=${accessToken}`);
      const pages = pagesResponse.data.data;

      res.json({ 
        success: true, 
        user: { id: user._id, name: user.name, email: user.email },
        pages: pages
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid Facebook token' });
    }
  } catch (error) {
    console.error('Facebook authentication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/post-to-facebook', auth, async (req, res) => {
    const { pageId, message } = req.body;
  
    try {
      // Fetch the current user
      const user = await User.findById(req.user);
  
      if (!user || !user.facebookAccessToken) {
        return res.status(400).json({ success: false, message: 'User not found or Facebook account not linked' });
      }
  
      // Get the page access token
      const pagesResponse = await axios.get(`https://graph.facebook.com/v12.0/me/accounts?access_token=${user.facebookAccessToken}`);
      const page = pagesResponse.data.data.find(p => p.id === pageId);
  
      if (!page) {
        return res.status(400).json({ success: false, message: 'Page not found or user does not have access' });
      }
  
      // Post to the Facebook page
      const postResponse = await axios.post(
        `https://graph.facebook.com/v12.0/${pageId}/feed`,
        {
          message: message,
          access_token: page.access_token
        }
      );
  
      res.json({ 
        success: true, 
        postId: postResponse.data.id,
        message: 'Posted successfully to Facebook'
      });
    } catch (error) {
      console.error('Error posting to Facebook:', error.response ? error.response.data : error.message);
      res.status(500).json({ success: false, message: 'Failed to post to Facebook', error: error.message });
    }
  });

module.exports = router;