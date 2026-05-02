# Backend API for a Video-Sharing Platform

This repository hosts the backend API for a full-featured video-sharing platform, similar to YouTube. It's built with Node.js and Express, and it provides a robust and scalable foundation for a modern web application. This project demonstrates a comprehensive understanding of backend development, from user authentication to video processing and social features.

## 🚀 Key Features

- **🔐 Secure User Authentication**: End-to-end user authentication using JWT (JSON Web Tokens), including registration, login, and password management.
- **📹 Video Management**: Seamless video uploading, streaming, and management, with support for various formats and resolutions.
- **🤝 Social Engagement**: A rich set of social features, including the ability to like, comment on, and subscribe to channels.
- **📺 Channel Customization**: Users can create and personalize their own channels, upload a channel avatar, and manage their content.
- **큐 Playlist Creation**: Functionality to create, update, and delete playlists, allowing users to organize videos.
- **🐦 Tweet-Like Updates**: A micro-messaging feature for users to post short text-based updates.
- **☁️ Cloud-Based Media Storage**: Integration with Cloudinary for efficient and scalable storage of video and image assets.
- **📧 Automated Email Notifications**: A system for sending automated emails for important events like registration and password resets.

## 🛠️ Tech Stack

- **[Node.js](https://nodejs.org/)**: A powerful JavaScript runtime for building server-side applications.
- **[Express](https://expressjs.com/)**: A minimal and flexible Node.js web application framework.
- **[MongoDB](https://www.mongodb.com/)**: A NoSQL database for storing application data.
- **[Mongoose](https://mongoosejs.com/)**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **[JWT (JSON Web Tokens)](https://jwt.io/)**: For secure user authentication.
- **[Cloudinary](https://cloudinary.com/)**: A cloud-based service for image and video management.
- **[Multer](https://github.com/expressjs/multer)**: A middleware for handling `multipart/form-data`, used for file uploads.
- **[Nodemailer](https://nodemailer.com/)**: A module for sending emails from Node.js applications.
- **[Prettier](https://prettier.io/)**: A code formatter to ensure consistent code style.
- **[Nodemon](https://nodemon.io/)**: A tool that automatically restarts the server during development.

## ⚙️ Installation

To get started with this project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd your-repo-name
   ```

3. **Install the dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.sample` file as a template.

## 🏃‍♀️ Usage

To run the server in development mode, use the following command:

```bash
npm run dev
```

This will start the server with Nodemon, which automatically restarts the server on file changes.

## 📂 Project Structure

The project follows a modular and scalable structure, designed for maintainability and ease of development:

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

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.
 