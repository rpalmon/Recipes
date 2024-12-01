import { db } from "../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore"; // Ensure getDocs is imported

// Get data from Firestore
export async function GET(req) {
  try {
    const items = [];
    const querySnapshot = await getDocs(collection(db, "recipes")); // Fetch documents from the "items" collection
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() }); // Add document data and ID to the items array
    });

    return new Response(JSON.stringify(items), { status: 200 }); // Return the fetched data
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 }); // Handle errors
  }
}
