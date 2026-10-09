
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Ticket = require("./models/Ticket");

const app = express();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.MONGO_URL || !JWT_SECRET) {
  console.error("Missing MONGO_URL or JWT_SECRET in api/.env");
  process.exit(1);
}

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded images
const uploadsDirectory = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDirectory, { recursive: true });
app.use("/uploads", express.static(uploadsDirectory));

// --------------------------------------------------
// MONGODB ATLAS
// --------------------------------------------------

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// --------------------------------------------------
// AUTHENTICATION HELPERS
// --------------------------------------------------

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

function sendAuthenticatedUser(res, user, statusCode = 200) {
  const publicUser = safeUser(user);
  res.cookie("token", createToken(user), cookieOptions);

  return res.status(statusCode).json({
    ...publicUser,
    user: publicUser,
  });
}

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/test", (req, res) => {
  res.json({ message: "Eventer API is working!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Eventer API" });
});

// --------------------------------------------------
// REGISTER
// Supports both old and new frontend URLs
// --------------------------------------------------

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Please enter your name, email, and password.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length > 80) {
      return res.status(400).json({
        message: "Please enter a valid name.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password must contain 8–72 characters.",
      });
    }

    const existingUser = await UserModel.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered. Please log in.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Your existing User model uses the field named "password".
    const user = await UserModel.create({
      name: cleanName,
      email: cleanEmail,
      password: passwordHash,
    });

    return sendAuthenticatedUser(res, user, 201);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Unable to create your account.",
    });
  }
}

app.post("/register", registerUser);
app.post("/api/auth/register", registerUser);

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Please enter your email and password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await UserModel.findOne({
      email: cleanEmail,
    });

    if (!user || typeof user.password !== "string") {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    return sendAuthenticatedUser(res, user);
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in right now.",
    });
  }
}

app.post("/login", loginUser);
app.post("/api/auth/login", loginUser);

// --------------------------------------------------
// CURRENT USER PROFILE
// --------------------------------------------------

async function getProfile(req, res) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        user: null,
        message: "Not logged in.",
      });
    }

    const userData = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(userData.id);

    if (!user) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
      });

      return res.status(401).json({
        user: null,
        message: "Account not found.",
      });
    }

    const publicUser = safeUser(user);

    return res.json({
      ...publicUser,
      user: publicUser,
    });
  } catch (error) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });

    return res.status(401).json({
      user: null,
      message: "Please log in again.",
    });
  }
}

app.get("/profile", getProfile);
app.get("/api/auth/me", getProfile);

// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
}

app.post("/logout", logoutUser);
app.post("/api/auth/logout", logoutUser);

// --------------------------------------------------
// EVENT MODEL
// --------------------------------------------------

const eventSchema = new mongoose.Schema({
  owner: String,
  title: String,
  description: String,
  organizedBy: String,
  eventDate: Date,
  eventTime: String,
  location: String,
  Participants: Number,
  Count: Number,
  Income: Number,
  ticketPrice: Number,
  Quantity: Number,
  image: String,
  likes: { type: Number, default: 0 },
  Comment: [String],
});

const Event = mongoose.models.Event ||
  mongoose.model("Event", eventSchema);

// --------------------------------------------------
// IMAGE UPLOAD CONFIGURATION
// --------------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeName =
      path.basename(file.originalname, extension)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 80);

    cb(null, `${Date.now()}-${safeName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }

    cb(new Error("Only image uploads are allowed."));
  },
});

// --------------------------------------------------
// CREATE EVENT
// --------------------------------------------------

app.post("/createEvent", upload.single("image"), async (req, res) => {
  try {
    const eventData = { ...req.body };

    if (req.file) {
      eventData.image = `/uploads/${req.file.filename}`;
    }

    const newEvent = await Event.create(eventData);

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error("Create event error:", error.message);

    return res.status(500).json({
      error: "Failed to save the event to MongoDB.",
    });
  }
});

// GET ALL EVENTS
app.get("/createEvent", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    return res.json(events);
  } catch (error) {
    console.error("Fetch events error:", error.message);

    return res.status(500).json({
      error: "Failed to fetch events from MongoDB.",
    });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    return res.json(events);
  } catch (error) {
    console.error("Fetch events error:", error.message);

    return res.status(500).json({
      message: "Server error fetching events.",
    });
  }
});

// GET EVENT BY ID
app.get("/event/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.json(event);
  } catch (error) {
    return res.status(400).json({
      error: "Invalid event ID or failed to fetch event.",
    });
  }
});

// LIKE EVENT
app.post("/event/:eventId", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.json(event);
  } catch (error) {
    console.error("Error liking event:", error.message);

    return res.status(400).json({
      message: "Unable to like this event.",
    });
  }
});

// ORDER SUMMARY ROUTES
app.get("/event/:id/ordersummary", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.json(event);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to fetch event from MongoDB.",
    });
  }
});

app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.json(event);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to fetch event from MongoDB.",
    });
  }
});

// --------------------------------------------------
// TICKETS
// --------------------------------------------------

// CREATE TICKET
app.post("/tickets", async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);

    return res.status(201).json({ ticket });
  } catch (error) {
    console.error("Error creating ticket:", error.message);

    return res.status(500).json({
      error: "Failed to create ticket.",
    });
  }
});

// GET TICKETS
app.get("/tickets/:id", async (req, res) => {
  try {
    const tickets = await Ticket.find();

    return res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error.message);

    return res.status(500).json({
      error: "Failed to fetch tickets.",
    });
  }
});

// GET USER TICKETS
app.get("/tickets/user/:userId", async (req, res) => {
  try {
    const tickets = await Ticket.find({
      userid: req.params.userId,
    });

    return res.json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error.message);

    return res.status(500).json({
      error: "Failed to fetch user tickets.",
    });
  }
});

// DELETE TICKET
app.delete("/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting ticket:", error.message);

    return res.status(400).json({
      error: "Failed to delete ticket.",
    });
  }
});

// --------------------------------------------------
// ERROR HANDLER
// --------------------------------------------------

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.code === "LIMIT_FILE_SIZE"
        ? "Image must be smaller than 5 MB."
        : error.message,
    });
  }

  if (error.message === "Only image uploads are allowed.") {
    return res.status(400).json({ message: error.message });
  }

  console.error("Server error:", error.message);

  return res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Eventer API is running on port ${PORT}`);
});
