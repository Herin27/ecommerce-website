const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tiger", // Change to your MySQL password
    database: "ecommerce",
    port: 3308, // Change if using a different port
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes for serving HTML files
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "deshboard.html"));
});

// Example API: Get all products
app.get("/api/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);
        }
    });
});

// Example API: Add a product
app.post("/api/add-product", (req, res) => {
    const { name, price, description } = req.body;
    const query = "INSERT INTO products (name, price, description) VALUES (?, ?, ?)";
    db.query(query, [name, price, description], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error adding product" });
        } else {
            res.json({ message: "Product added successfully", productId: result.insertId });
        }
    });
});

// Storage setup for image uploads
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Create 'products' table if not exists
db.query(`CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    image VARCHAR(255)
)`, (err) => {
    if (err) console.log(err);
});

// API to add a new product
app.post("/add-product", upload.single("image"), (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file.filename;

    db.query("INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)", 
        [name, description, price, image], 
        (err) => {
            if (err) {
                console.error(err);
                res.json({ success: false, message: "Error adding product" });
            } else {
                res.json({ success: true, message: "Product added successfully!" });
            }
        }
    );
});

// API to fetch products
app.get("/get-products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) {
            console.error(err);
            res.json({ success: false, message: "Error fetching products" });
        } else {
            res.json({ success: true, products: results });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
