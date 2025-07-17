const User = require('../models/User');


exports.register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { firstName, lastName, email, password, phone, gender, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      gender
    });

    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Validate email/phone & password
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email/phone and password'
      });
    }

    // Check for user by email or phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token
  });
}; 