import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { type } from "os";

const userSchema = new Schema (
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            unique: false,
            trim: true
        },
        avatar: {
            type: String,
            required: true
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "video"
            }
        ],
        password: {
            type: String,
            required: [true, "password is required"],
        },
        refreshToken: {
            type: String
        },
        passwordResetToken: {
            type: String
        },
        passwordResetExpires: {
            type: Date
        },
        verificationToken: {
            type: String,
        },
        verificationTokenExpires: {
            type: Date
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.generatePasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken =
        crypto.createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires =
        Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

userSchema.methods.generateVerificationToken  = function () {
    const verificationToken = crypto.randomBytes(32).toString("hex");

    this.verificationToken = 
    crypto.createHash("sha256")
    .update(verificationToken)
    .digest("hex")

    this.verificationTokenExpires = 
    Date.now() + 5 * 60 * 1000;

    return verificationToken;
}



userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            emial: this.email,
            username: this.username,
            fullname: this.fullname,   
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefereshToken = function () {
    return jwt.sign(
        {
            _id: this._id, 
        },
        process.env.REFERSH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFERSH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)