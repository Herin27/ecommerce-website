const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 3000;
app.use(cors());

connectDB();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define Schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String
});

// Define Models
const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);

// Signup Route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, message: "User created successfully" });
    } catch (err) {
        res.json({ success: false, message: "Error creating user" });
    }
});

// Signin Route
const otpStore = {}; // store OTPs temporarily

// Send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.json({ success: false, message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'herin7151@gmail.com',
            pass: 'hxsr ruik jdsy xncs' // Use Gmail App Password
        }
    });

    const mailOptions = {
        from: 'herin7151@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: 'Failed to send OTP' });
    }
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] == otp) {
        delete otpStore[email]; // remove after verification
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid OTP' });
    }
});
  
// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// Routes for serving HTML files
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));

// Multer Storage for Image Uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Add Product Route
app.post("/add-product", upload.single("image"), async (req, res) => {
    const { name, description, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description || !price || !imagePath) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {
        const newProduct = new Product({ name, description, price, image: imagePath });
        await newProduct.save();
        res.json({ success: true, message: "Product added successfully!" });
    } catch (err) {
        res.json({ success: false, message: "Database error" });
    }
});

// Route
app.get("/get-products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      products: products.map(prod => ({
        id: prod._id,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        image: `http://localhost:3000${prod.image}`,
      })),
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching products" });
  }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
