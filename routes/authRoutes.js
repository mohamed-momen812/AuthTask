const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const {
  register,
  verifyEmail,
  login,
} = require("../controllers/authController");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/register",
  upload.single("idDocument"),
  [
    check("fullName", "Full name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phone", "Please include a valid phone number").matches(
      /^(\+?\d{1,3})?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/
    ),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

router.get("/verify-email", verifyEmail);
router.post("/login", login);

module.exports = router;
