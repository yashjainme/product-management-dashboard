// import { MongoClient } from "mongodb";
// import { NextResponse } from "next/server";




// const MONGODB_URI = process.env.MONGODB_URI;


// export async function POST(request) {
//     let {action, slug, initialQuantity} = await request.json()
// // Replace the uri string with your connection string.


// const client = new MongoClient(MONGODB_URI);

// try {
//     const database = client.db('stock');
//     const inventory = database.collection('inventory');

//     const filter = { slug: slug};
//     let newQuantity = action == "plus"?(parseInt(initialQuantity) +  1):(parseInt(initialQuantity) - 1)
//     // create a document that sets the plot of the movie
//     const updateDoc = {
//       $set: {
//         quantity: newQuantity
//       },
//     };
//     const result = await inventory.updateOne(filter, updateDoc, {});
    
//     return NextResponse.json({success: true,  message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
//   } finally {
//     await client.close();
//   }


// }



















import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST(request) {
    try {
        const { action, slug, initialQuantity } = await request.json();

        const client = new MongoClient(MONGODB_URI);
        await client.connect();

        const database = client.db('stock');
        const inventory = database.collection('inventory');

        const filter = { slug: slug };
        let newQuantity = action === "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1);

        const updateDoc = {
            $set: {
                quantity: newQuantity
            },
        };

        const result = await inventory.updateOne(filter, updateDoc, {});

        // Query the updated document to get the latest state
        const updatedDocument = await inventory.findOne(filter);

        await client.close();

        // Ensure you return a deep copy of the updated document
        const responseJson = JSON.parse(JSON.stringify(updatedDocument));

        return NextResponse.json({
            success: true,
            message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            data: responseJson  // Return the deep copied JSON object
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while updating the inventory"
        });
    }
}
