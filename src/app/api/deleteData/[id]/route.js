import { db } from "../../../../../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Missing ID" }),
      { status: 400 }
    );
  }

  try {
    const docRef = doc(db, "recipes", id); // Update with correct collection name
    console.log("Deleting document with ID:", id); // Log the ID for debugging
    await deleteDoc(docRef);
    console.log("Document deleted successfully");

    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error.message); // Log Firestore errors
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
