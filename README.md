<div align="center">
  <img src="Client/src/assets/LinkedIn_logo.png" alt="LinkedIn Clone" width="200"/>

  # 🚀 LinkedIn Clone — Full Stack MERN Application
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/PranavThorat1432/LinkedIn-Full-Stack-Clone-using-MERN-?style=social)](https://github.com/PranavThorat1432/LinkedIn-Full-Stack-Clone-using-MERN-/stargazers)
</div>
  
  A **complete LinkedIn Clone** built using the **MERN Stack**, recreating the real-world networking experience for professionals.  
  It includes fully functional features like creating posts with images, liking, commenting, editing profiles, and connecting with other users — just like the original LinkedIn platform.  

  Designed with a clean and responsive UI, this project demonstrates the power of **full-stack development**, **modern UI/UX**, and **real-time interactivity**, all wrapped in one professional-grade web application.

<div align="center">

  [![Watch Demo](https://img.shields.io/badge/🎬-Watch_Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/demo-link)
  [![Live App](https://img.shields.io/badge/🚀-Live_Demo-9cf?style=for-the-badge)](https://linkedin-clone-by-pranav.netlify.app)

</div>

---

## 📚 Table of Contents

1. [✨ Features](#-features)
2. [🛠 Tech Stack](#-technology-stack)
3. [⚙️ Installation & Setup](#-installation--setup)
4. [🔧 Configuration](#-configuration)
5. [🖥️ Usage](️#-usage)
6. [📸 Screenshots](#-screenshots)
7. [🤝 Contributing](#-contributing)
8. [📝 License](#-license)
9. [📬 Contact](#-contact)
10. [🙏 Acknowledgments](#-acknowledgments)


---

## ✨ Features

<div align="center">

| Category | Highlights |
|-----------|-------------|
| 🔐 **Authentication** | Secure JWT login, role-based access, protected routes, password hashing |
| 👤 **User Profiles** | Custom avatars (Cloudinary), editable bio, experience, education, and skills |
| 🤝 **Networking** | Send/accept connection requests, notifications, live activity feed |
| 📝 **Posts & Feed** | Create posts, upload media, like/comment, hashtags & mentions |
| 💬 **Messaging** | Real-time chat powered by Socket.io |
| 🎨 **UI/UX** | Responsive layout, light/dark themes, accessibility focused |
| ⚡ **Performance** | Optimized API calls, lazy loading, smooth navigation |

</div>

---

## 🛠 Technology Stack

### **Frontend**
<div align="center">

| Tech | Description |
|------|--------------|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Component-based UI (React 18 + Vite) |
| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Responsive and fast CSS framework |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | API communication |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | SPA navigation |
| ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white) | Real-time updates |

</div>

### **Backend**
<div align="center">

| Tech | Description |
|------|--------------|
| ![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) | JavaScript runtime |
| ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Backend framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) | NoSQL database |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) | Authentication & authorization |
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) | Image/media storage |

</div>

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/PranavThorat1432/LinkedIn-Full-Stack-Clone-using-MERN-.git
cd LinkedIn-Full-Stack-Clone-using-MERN-

# Install backend dependencies
cd Server
npm install

# Install frontend dependencies
cd ../Client
npm install

# Run both servers
cd ../Server
npm run dev & cd ../Client && npm run dev
````

---

## 🔧 Configuration

Create a `.env` file in your **Server** folder:

```bash
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CLIENT_URL=http://localhost:5173
```

---

## 🖥️ Usage

### Development

```bash
# From Server directory
npm run dev
```

```bash
# From Client directory
npm run dev
```

### Production

```bash
cd Client
npm run build

cd ../Server
npm start
```

---

## 📸 Screenshots

<div align="center">

  ![1](https://github.com/user-attachments/assets/8b9be129-cab2-495f-8dc3-a35fe03a6f88)

  ![2](https://github.com/user-attachments/assets/b012f103-19d6-4bed-a9df-2ff407a8284f)

  ![3](https://github.com/user-attachments/assets/056d802e-00bd-40d9-a7a2-990820eb603d)

  ![4](https://github.com/user-attachments/assets/68b1a2ac-91ef-4e57-a71d-7a618df6724b)

  
</div>

---

## 🚀 Future Improvements  

- **Real-time Chat Integration:** Enable one-on-one and group messaging with WebSockets for instant communication.  
- **Advanced Search & Filters:** Allow users to search for professionals, posts, and companies more effectively.  
- **Job Posting & Applications:** Add a dedicated section for companies to post jobs and users to apply directly.  
- **AI-Powered Recommendations:** Suggest connections, posts, and opportunities based on user activity.  
- **Notifications System:** Implement live notifications for likes, comments, messages, and connection requests.  
- **Dark Mode:** Provide users with theme customization for better accessibility and experience.  
- **Profile Analytics:** Show post reach, engagement rate, and profile visit stats.  

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch:

   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add new feature"
   ```
4. Push the branch:

   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request 🎉

---

## 📝 License

This project is licensed under the **MIT License**.
See the [LICENSE](/LICENSE) file for details.

---

## 📬 Contact

👤 **Pranav Thorat**

| Platform              | Link                                                          |
| --------------------- | ------------------------------------------------------------- |
| 🌐 **Live Demo**      | [View Now](https://forever-buy-e-commerce-website-mern.vercel.app/)                        |
| 🧑‍💻 **GitHub Repo** | [View Code](https://github.com/PranavThorat1432/LinkedIn-Full-Stack-Clone-using-MERN-) |
| 💼 **LinkedIn**       | [Connect with Me](https://www.linkedin.com/in/curiouspranavthorat/)       |
| 📩 **Email**          | [pranavthorat95@gmail.com](mailto:pranavthorat95@gmail.com)   |


---

## 🌟 Support

If you liked this project, please give it a ⭐️ on GitHub — it helps others find it!

---

## 🙏 Acknowledgments

| Tech         | Description       | Link                                       |
| ------------ | ----------------- | ------------------------------------------ |
| React        | Frontend Library  | [reactjs.org](https://reactjs.org)         |
| Node.js      | Backend Runtime   | [nodejs.org](https://nodejs.org)           |
| Express      | Web Framework     | [expressjs.com](https://expressjs.com)     |
| MongoDB      | Database          | [mongodb.com](https://mongodb.com)         |
| Tailwind CSS | Styling Framework | [tailwindcss.com](https://tailwindcss.com) |

---

<div align="center">
  <h3>💙 Built with passion by <a href="https://github.com/PranavThorat1432">Pranav Thorat</a></h3>
  <p>Let’s connect, collaborate, and create amazing projects!</p>

[![GitHub stars](https://img.shields.io/github/stars/PranavThorat1432/LinkedIn-Full-Stack-Clone-using-MERN-?style=social)](https://github.com/PranavThorat1432/LinkedIn-Full-Stack-Clone-using-MERN-/stargazers)

</div>