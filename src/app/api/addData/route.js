import { db } from "../../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const data = await req.json(); // Parse incoming JSON data
    const docRef = await addDoc(collection(db, "items"), data); // Add data to Firestore

    return new Response(JSON.stringify({ id: docRef.id }), { status: 200 });
  } catch (error) {
    // Return a response even in case of an error
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
