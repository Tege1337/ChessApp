# ChessApp - Full-Featured Online Chess Platform

A modern, real-time multiplayer chess application with user authentication, ELO rating system, game history tracking, and beautiful UI.

## 🚀 Features

- 🔐 **User Authentication** - Secure registration and login with JWT
- 👤 **User Profiles** - Track your stats, ELO rating, wins/losses/draws
- ♟️ **Real-time Multiplayer** - Play chess with players worldwide
- 📊 **Game History** - Review all your past games
- ⚙️ **Customizable Settings** - Themes, sound effects, board styles
- 🎨 **Modern UI** - Beautiful gradients, smooth animations, responsive design
- 🏆 **ELO Rating System** - Track your skill level with chess ratings
- 🌐 **Online Deployment Ready** - Deploy to Render and Vercel easily

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- Socket.io (real-time communication)
- MongoDB + Mongoose (database)
- JWT (authentication)
- bcryptjs (password hashing)
- chess.js (game logic)

### Frontend
- React 18
- React Router (navigation)
- Socket.io-client (real-time connection)
- Axios (API calls)
- react-chessboard (chess UI)
- React Icons

## 📋 Prerequisites

- Node.js v16+ 
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Tege1337/ChessApp.git
cd ChessApp
```

### 2. Setup Backend
```bash
cd Backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/chessapp
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=3001
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3001
```

Start frontend:
```bash
npm run dev
```

### 4. Open the App
Visit `http://localhost:5173` in your browser

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to:
- Render (Backend)
- Vercel (Frontend)
- MongoDB Atlas (Database)
- Custom domain setup

Quick deployment:
1. Push to GitHub
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Configure environment variables
5. Done! 🎉

## 📱 How to Use

1. **Register** - Create a new account
2. **Login** - Access your profile
3. **Find Game** - Click to match with an opponent
4. **Play** - Make moves by dragging pieces
5. **View Profile** - Check your stats and game history
6. **Customize** - Change themes and settings

## 🎮 Game Features

- ✅ Legal move validation
- ✅ Check/Checkmate detection
- ✅ Stalemate and draw detection
- ✅ Move history tracking
- ✅ Automatic ELO calculation
- ✅ Real-time opponent updates
- ✅ Disconnect handling

## 📊 Project Structure

```
ChessApp/
├── Backend/
│   ├── models/
│   │   ├── User.js
│   │   └── GameHistory.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── user.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Settings.jsx
    │   │   └── GameBoard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── package.json
    └── .env
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT authentication
- Protected API routes
- Input validation
- CORS configuration
- Secure WebSocket connections

## 🎨 Customization

### Themes
- Light mode
- Dark mode (default)

### Board Styles
- Classic
- Modern
- Wood

### Settings
- Toggle sound effects
- Change themes
- Customize board appearance

## 📈 Future Enhancements

- [ ] Friend system
- [ ] Private games with room codes
- [ ] Chat system
- [ ] Spectator mode
- [ ] Tournament system
- [ ] Time controls (blitz, rapid, classical)
- [ ] Puzzle mode
- [ ] AI opponent
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 👨‍💻 Author

Created by [Tege1337](https://github.com/Tege1337)

## 🙏 Acknowledgments

- chess.js for chess logic
- react-chessboard for chess UI
- Socket.io for real-time features

---

⭐ **Star this repo if you found it helpful!**

🐛 **Found a bug?** Open an issue
💡 **Have an idea?** Open a discussion

Happy coding! ♟️
