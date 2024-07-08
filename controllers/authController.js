const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/email");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  const idDocument = req.file.path;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ fullName, email, phone, password, idDocument });

    await user.save();

    const token = crypto.randomBytes(20).toString("hex");

    const verificationToken = jwt.sign(
      { userId: user._id, token },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({
      user,
      status: "success",
      msg: "Registration successful, check your email for verification link",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    // defult false
    user.isVerified = true;
    await user.save();

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ msg: " Email Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: " Password Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ msg: "Please verify your email before logging in" });
    }

    const payload = { userId: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
