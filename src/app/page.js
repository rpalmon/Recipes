"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [response, setResponse] = useState("");
  const [data, setData] = useState([]); // Initialize data as an array
  const [loading, setLoading] = useState(true); // Loading state
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is active for delete

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch("/api/getData");
      const result = await res.json();

      if (res.ok) {
        setData(result); // Update the state with the fetched data
      } else {
        setResponse(result.error);
      }
    } catch (err) {
      setResponse(err.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting item with ID:", id);
    setLoading(true); // Start loading
    try {
      const res = await fetch(`/api/deleteData/${id}`, {
        method: "DELETE",
      });

      console.log("Response status:", res.status);
      console.log("Response text:", await res.text());

      if (res.ok) {
        setResponse("Item deleted successfully");
        setData(data.filter((recipe) => recipe.id !== id)); // Update state directly to avoid re-fetch
      } else {
        const result = await res.json();
        console.log("Error deleting item:", result.error);
        setResponse(result.error);
      }
    } catch (err) {
      console.error("Error deleting item:", err.message);
      setResponse(err.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <svg
        className="animate-spin h-10 w-10 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        ></circle>
        <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Recipies Viewer</h1>
      <p className="text-red-500 mb-4">{response}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((recipe) => (
          <div
            key={recipe.id}
            className="border border-gray-300 rounded-lg shadow p-4 bg-white relative hover:shadow-lg transition-shadow"
          >
            {/* 3 vertical dots for menu */}
            <div className="absolute top-2 right-2">
              <button
                className="p-2"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation when menu is clicked
                  setActiveMenu(activeMenu === recipe.id ? null : recipe.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v.01M12 12v.01M12 18v.01"
                  />
                </svg>
              </button>
              {activeMenu === recipe.id && (
                <div className="absolute bg-white border border-gray-300 rounded shadow p-2 top-8 right-0 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation when delete is clicked
                      handleDelete(recipe.id);
                    }}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <a href={`/recipe?id=${recipe.id}`} className="cursor-pointer block">
              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-bold mb-1">Ingredients:</h3>
              <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h3 className="text-lg font-bold mb-1">Instructions:</h3>
              <p className="text-sm text-gray-700 mb-4">
                {recipe.instructions.length > 100
                  ? `${recipe.instructions.substring(0, 100)}...`
                  : recipe.instructions}
              </p>
            </a>
          </div>
        ))}
        {/* Big button to go to the /create page */}
        <a
          href="/create"
          className="border border-gray-300 rounded-lg shadow p-4 bg-white flex items-center justify-center hover:shadow-lg transition-shadow"
        >
          <span className="text-3xl">+</span>
        </a>
      </div>
    </div>
  );
}
