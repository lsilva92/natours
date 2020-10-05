const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valide email']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm password'],
    validate: {
      //This only works on Create and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  retry: {
    type: Number,
    default: 0
  },
  lastRetry: Date
});

userSchema.pre('save', async function(next) {
  //Only run function if password was modified
  if (!this.isModified('password')) return next();

  //Has the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm Field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkLasRetry = function() {
  const currentDate = Math.floor(Date.now() / 1000);
  const retryDate = Math.floor(
    new Date(this.lastRetry).getTime() / 1000 + 3600
  ); // 1 hora;

  return currentDate > retryDate;
};

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPassowrdAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimesTamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimesTamp;
  }

  //False means NOT changed
  return false;
};

userSchema.pre('save', function(next) {
  if (!this.isModified('password' || this.isNew)) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
