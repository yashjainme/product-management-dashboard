import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";



const MONGODB_URI = process.env.MONGODB_URI;

export async function GET(request) {
 
// Replace the uri string with your connection string.


const client = new MongoClient(MONGODB_URI);


  try {
    const database = client.db('new');
    const movies = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);

    console.log(movie);
    return NextResponse.json({"a": 34, movie})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }


}