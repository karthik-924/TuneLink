const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Post } = require("./model");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.SECRET_KEY;
const url = process.env.MONGODB_URL;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const checkConnection = async () => {
//   await client.connect();
//   console.log("Connect");
// };

// checkConnection();

// const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");

// const storage = new GridFsStorage({
//   url,
//   file: (req, file) => {
//     //If it is an image, save to photos bucket
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       return {
//         bucketName: "photos",
//         filename: `${Date.now()}_${file.originalname}`,
//       }
//     } else {
//       //Otherwise save to default bucket
//       return `${Date.now()}_${file.originalname}`
//     }
//   },
// })

// const upload = multer({ storage })

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  // const profilePicture = req.file.filename;
  console.log(username, email, password);
  try {
    const existingUser = await User.findOne({ email });
    const existingUserName = await User.findOne({ username });
    if (existingUser) {
      console.log("User exists")
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    if (existingUserName) {
      console.log("User exists")
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: "1h" },
      { algorithm: "RS256" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username)
  try {
    const user = await User.findOne({ username });
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" },
      { algorithm: "RS256" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.userId;
    next();
  });
}

app.post("/addPost", async (req, res) => {
  const { username, authorName, genre, songlink,songname } = req.body;

  try {
    const newPost = new Post({
      username,
      authorName,
      songname,
      genre,
      musicURL: songlink,
      createdAt: new Date(),
    });

    await newPost.save();

    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getAllPosts", async (req, res) => {
  try {
    const posts = await Post.find();
    console.log(posts)
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
