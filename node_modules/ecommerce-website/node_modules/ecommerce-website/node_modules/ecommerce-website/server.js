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
    host: "sql12.freesqldatabase.com",
    user: "sql12760599",
    password: "IXbzS9Iij2", // Change to your MySQL password
    database: "sql12760599",
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



// Create 'products' table if not exists
db.query(`CREATE TABLE IF NOT EXISTS product1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL
    );

`, (err) => {
    if (err) console.log(err);
});

// Multer Storage for Image Uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads")); // Ensure static serving

// Route to Add Product
app.post("/add-product", upload.single("image"), (req, res) => {
    const { name, description, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description || !price || !imagePath) {
        return res.json({ success: false, message: "All fields are required" });
    }

    const sql = "INSERT INTO product1 (name, description, price, image) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, description, price, imagePath], (err, result) => {
        if (err) {
            console.error("Error inserting product:", err);
            return res.json({ success: false, message: "Database error" });
        }
        res.json({ success: true, message: "Product added successfully!" });
    });
});

// Route to Fetch Products
app.get("/get-products", (req, res) => {
    db.query("SELECT * FROM product1", (err, results) => {
        if (err) return res.json({ success: false, message: "Error fetching products" });

        res.json({
            success: true,
            products: results.map(prod => ({
                id: prod.id,
                name: prod.name,
                description: prod.description,
                price: prod.price,
                image: `http://localhost:3000${prod.image}`
            }))
        });
    });
});




// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
