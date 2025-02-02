# eCommerce Website

This is an eCommerce website project that includes user signup and signin functionality, a dynamic loading page with cart animation, and a modern user interface for a seamless shopping experience.

## Features

- **Signup and Signin Pages**: Allows users to create an account and sign in using their email and password.
- **Dynamic Cart Animation**: Attractive cart animation that moves from left to right during the page loading process, creating a dynamic visual experience.
- **Main Content**: After the loading animation, the main content of the website is revealed, allowing users to browse products and make purchases.
- **Responsive Design**: The website is designed to be fully responsive and looks great on both desktop and mobile devices.
- **Fade-in Transition**: Main content fades in after the loading animation completes, giving a smooth user experience.

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript
  - FontAwesome (for cart icon)
- **Backend**:
  - Node.js
  - Express.js
  - MySQL
  - bcrypt (for password hashing)
- **Other**:
  - Visual animations using CSS keyframes

## Setup

To run this project locally, follow the steps below:

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/)
- [MySQL](https://www.mysql.com/downloads/)
- [npm](https://www.npmjs.com/get-npm)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/ecommerce-website.git
    ```

2. Navigate to the project directory:

    ```bash
    cd ecommerce-website
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up MySQL:
    - Create a MySQL database (e.g., `ecommerce`).
    - Create a table for storing user details (name, email, password).

5. Update the database connection in `server.js` with your MySQL credentials.

6. Start the server:

    ```bash
    node server.js
    ```

    The app will be running at `http://localhost:3000`.

### Folder Structure
ecommerce-website/ │ ├── public/ │ ├── images/ │ └── styles.css ├── views/ │ ├── index.html │ ├── signin.html │ └── signup.html ├── server.js ├── package.json └── README.md


### How to Use

1. Open the `signin.html` page in your browser to sign in, or go to the `signup.html` page to create a new account.
2. Once logged in, the main page will load with dynamic cart animation and fade-in content.

### Features to Add

- Shopping cart functionality: Add items to the cart, view cart items, and proceed to checkout.
- User profile page: Allow users to view and update their profile.
- Product catalog: Display products dynamically fetched from a database.
- Payment gateway: Integrate with a payment system for actual purchases.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- FontAwesome for the shopping cart icon.
- The Express team for creating a lightweight framework for Node.js.
- The MySQL community for their robust database system.


