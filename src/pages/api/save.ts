import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://4auto:oMSLGSgcx7JINswC@cluster0-wwlof.mongodb.net/for_auto?retryWrites=true&w=majority";

async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, score } = req.body;

  if (!email || !score) {
    res.status(422).json({ message: "Incomplete data" });
    return;
  }

  let client;

  try {
    client = await connectToDatabase();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error connecting to database" });
    return;
  }

  const db = client.db("4auto");
  const collection = db.collection("highscores");

  try {
    await collection.insertOne({ email, score });
    client.close();
    res.status(201).json({ message: "Successfully saved to database" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving to database" });
  }
}
