const mongoose = require("mongoose")

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })

        console.log("Database Connected");
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB