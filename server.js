const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// Other setup...

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tiger", // Change to your MySQL password
    database: "ecommerce",
    port: 3306, // Change if using a different port
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Received data:', req.body); // Check if data is coming correctly

    // Check if user already exists
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            return res.json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
            if (err) {
                return res.json({ success: false, message: 'Error creating user' });
            }

            res.json({ success: true, message: 'User created successfully' });
        });
    });
});


// Signin Route
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }

        const user = results[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ success: true, message: 'Signin successful' });
        } else {
            res.json({ success: false, message: 'Invalid password' });
        }
    });
});


// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes for serving HTML files
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
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


app.get('/api/get-website-growth', async (req, res) => {
    try {
        const totalUsers = await getTotalUsers(); // Replace with your DB query logic
        const totalOrders = await getTotalOrders(); // Replace with your DB query logic
        const totalProducts = await getTotalProducts(); // Replace with your DB query logic

        res.json({
            success: true,
            totalUsers,
            totalOrders,
            totalProducts
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Failed to fetch growth stats.'
        });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
