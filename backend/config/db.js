import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://shivamraj82182_db_user:xCrM16wLil8bIRht@ac-cktqsed-shard-00-00.bchbs3t.mongodb.net:27017,ac-cktqsed-shard-00-01.bchbs3t.mongodb.net:27017,ac-cktqsed-shard-00-02.bchbs3t.mongodb.net:27017/LibraryManagement?ssl=true&replicaSet=atlas-6ahcv9-shard-0&authSource=admin&appName=Cluster0"
    );

    console.log("✅ DB Connected");
  } 
  catch (err) {
    console.error("Name:", err.name);
    console.error("Message:", err.message);
    console.error("Cause:", err.cause);
}
};



