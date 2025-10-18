const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please fill a valid email address",
    ],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
    maxlength: [20, "Password must be at most 20 characters long"],
    required: [true, "Password is required"],
    select: false, // Exclude password from query results by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
  },
  about: {
    type: String,
  },
  place: {
    type: String,
  },
  website: {
    type: String,
  },
  profile_image: {
    type: String,
    default:
      "https://www.google.com/search?q=profile+image+2d+jpeg&sca_esv=b76488d702878571&udm=2&biw=1920&bih=991&sxsrf=AE3TifNPD5pDxkaVAxCMHYVVhOC9VruoBA%3A1753025774370&ei=7gx9aO-vFuOF7NYP9IKMsQk&ved=0ahUKEwjv3sD04cuOAxXjAtsEHXQBI5YQ4dUDCBE&uact=5&oq=profile+image+2d+jpeg&gs_lp=EgNpbWciFXByb2ZpbGUgaW1hZ2UgMmQganBlZ0jLFlChCliyD3ACeACQAQCYAWigAZsDqgEDMC40uAEDyAEA-AEBmAIAoAIAmAMAiAYBkgcAoAe0AbIHALgHAMIHAMgHAA&sclient=img#vhid=apKJmpWT0ISnHM&vssid=mosaic",
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});

//UserSchema methods
UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this._id,
    name: this.name,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });
  return token;
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash; // Hash the password before saving
  next();
});

module.exports = mongoose.model("User", UserSchema);
