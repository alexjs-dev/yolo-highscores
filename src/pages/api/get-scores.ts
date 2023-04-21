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
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
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
    const scores = await collection.find().toArray();
    client.close();
    res.status(200).json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching scores from database" });
  }
}
