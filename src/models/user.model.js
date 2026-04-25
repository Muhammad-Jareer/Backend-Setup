import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import pkg from "jsonwebtoken";

const { sign } = pkg;

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
            unique: true,
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
        refereshToken: {
            type: String
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

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
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

userSchema.methods.generateRefereshToken = async function () {
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

userSchema.methods.generateRefereshToken = async function () {
    
}


export const User = mongoose.model("User", userSchema)