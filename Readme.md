# 🎬 Video Streaming Backend

Welcome to the backend of a feature-rich video streaming platform, inspired by platforms like YouTube. This project is a robust and scalable backend system built with Node.js, Express, and MongoDB. It handles everything from user authentication and video uploads to social interactions like comments and likes.

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

## ✨ Key Features

-   **🔐 Secure User Authentication**: JWT-based authentication for user registration, login, and session management.
-   **📹 Video Management**: Upload, process, and stream videos with support for various formats.
-   **👍 Social Engagement**: Like, comment, and subscribe to channels to interact with content.
-   **📺 Channel Customization**: Users can create and manage their own channels, including profile and cover images.
-   **📋 Playlists**: Create, update, and delete video playlists.
-   **🐦 Tweets**: A micro-messaging feature for short text-based posts.
-   **☁️ Cloud Media Storage**: Integrates with Cloudinary for scalable video and image storage.
-   **📧 Email Notifications**: Automated emails for registration and password resets using Nodemailer.

## 🛠️ Tech Stack

-   **[Node.js](https://nodejs.org/)**: JavaScript runtime for building the server.
-   **[Express](https://expressjs.com/)**: Web application framework for Node.js.
-   **[MongoDB](https://www.mongodb.com/)**: NoSQL database for storing application data.
-   **[Mongoose](https://mongoosejs.com/)**: ODM library for MongoDB.
-   **[JWT (JSON Web Tokens)](https://jwt.io/)**: For secure user authentication.
-   **[Cloudinary](https://cloudinary.com/)**: Cloud-based service for media management.
-   **[Multer](https://github.com/expressjs/multer)**: Middleware for handling file uploads.
-   **[Nodemailer](https://nodemailer.com/)**: Module for sending emails.
-   **[Prettier](https://prettier.io/)**: Code formatter for consistent code style.
-   **[Nodemon](https://nodemon.io/)**: Automatically restarts the server during development.

## ⚙️ Installation

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```

2.  **Navigate to the project directory**:
    ```bash
    cd your-repo-name
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```

4.  **Set up environment variables**:
    Create a `.env` file in the root directory. You can use the `.env.sample` file as a template.

## 🏃‍♀️ Usage

To run the server in development mode:

```bash
npm run dev
```

This will start the server with Nodemon, which automatically restarts on file changes.

## 📂 Project Structure

The project is organized into a modular and scalable structure for easy maintenance and development:

```
/
|-- public/
|   |-- temp/
|-- src/
|   |-- app.js
|   |-- constants.js
|   |-- index.js
|   |-- controllers/
|   |   |-- channel.controller.js
|   |   |-- comment.controller.js
|   |   |-- like.controller.js
|   |   |-- tweet.controller.js
|   |   |-- user.controller.js
|   |   |-- video.controller.js
|   |-- db/
|   |   |-- index.js
|   |-- middlewares/
|   |   |-- auth.middleware.js
|   |   |-- multer.middleware.js
|   |-- models/
|   |   |-- comment.model.js
|   |   |-- like.model.js
|   |   |-- playlist.model.js
|   |   |-- subscription.model.js
|   |   |-- tweet.model.js
|   |   |-- user.model.js
|   |   |-- video.model.js
|   |-- routes/
|   |   |-- channel.routes.js
|   |   |-- comment.route.js
|   |   |-- like.route.js
|   |   |-- tweet.route.js
|   |   |-- user.route.js
|   |   |-- video.route.js
|   |-- utils/
|   |   |-- ApiError.js
|   |   |-- ApiResponse.js
|   |   |-- asyncHandler.js
|   |   |-- cloudinary.js
|   |   |-- sendEmail.js
|-- .env
|-- .gitignore
|-- package.json
|-- Readme.md
```

## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
|-- .gitignore
|-- package.json
|-- Readme.md
```

## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.
 