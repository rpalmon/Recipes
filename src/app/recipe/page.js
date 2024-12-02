"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

function RecipeDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("Recipe ID not found");
        return;
      }

      try {
        const docRef = doc(db, "recipes", id); // Update "recipes" to match your Firestore collection name
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Recipe not found");
        }
      } catch (error) {
        setError("Error fetching recipe: " + error.message);
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-red-500">{error}</h1>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back Button */}
      <div className="mb-6">
        <a
          href="/"
          className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ← Back to Recipes
        </a>
      </div>

      {/* Recipe Title */}
      <h1 className="text-4xl font-bold mb-6 text-center">{recipe.title}</h1>

      {/* Recipe Image */}
      {recipe.image ? (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded mb-6 shadow"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500 mb-6 shadow">
          No Image
        </div>
      )}

      {/* Ingredients Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      {/* Instructions Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <div>
          {/* recipe.instructions.map */}
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function RecipeDetails() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-8"><h1 className="text-3xl font-bold">Loading...</h1></div>}>
      <RecipeDetailsContent />
    </Suspense>
  );
}
