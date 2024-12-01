"use client";
import { useState, useRef } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

export default function Home() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const foodImageRef = useRef(null);
  const ingredientsRefs = useRef([]);
  const instructionsRefs = useRef([]);

  const uploadImageToBunnyCDN = async (file) => {
    const storageZoneName = "recipeimages";
    const accessKey = "9fce507b-c7b5-48b9-b74a63b1d040-494b-4a19";
    const storageUrl = `https://storage.bunnycdn.com/${storageZoneName}`;

    try {
      const response = await axios.put(
        `${storageUrl}/${file.name}`,
        file,
        {
          headers: {
            "AccessKey": accessKey,
            "Content-Type": file.type,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        return `https://recipeapp.b-cdn.net/${file.name}`;
      }
    } catch (error) {
      console.error("Error uploading image to BunnyCDN:", error.response?.data || error.message);
      throw new Error("Failed to upload image.");
    }
  };

  const handleImageUpload = async () => {
    if (foodImageRef.current.files[0]) {
      const file = foodImageRef.current.files[0];
      return await uploadImageToBunnyCDN(file);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedImageUrl = await handleImageUpload(); // Upload the image first

      // Get ingredient and instruction values from refs
      const ingredients = ingredientsRefs.current.map((ref) => ref?.value || "");
      const instructions = instructionsRefs.current.map((ref) => ref?.value || "");

      const recipeData = {
        title,
        ingredients: ingredients.filter((ing) => ing.trim() !== ""), // Exclude empty inputs
        instructions: instructions.filter((inst) => inst.trim() !== ""), // Exclude empty inputs
        image: uploadedImageUrl, // Use the uploaded image URL
      };

      const docRef = await addDoc(collection(db, "recipes"), recipeData);
      setResponseMessage(`Recipe added successfully with ID: ${docRef.id}`);
      setTitle("");
      ingredientsRefs.current = [];
      instructionsRefs.current = [];
      setImage(null);
    } catch (error) {
      setResponseMessage(`Error adding recipe: ${error.message}`);
    }
  };

  const IngredientList = () => {
    const addIngredient = () => {
      ingredientsRefs.current.push({ value: "" }); // Add an empty ingredient to refs
      forceRender(); // Trigger re-render to display new input
    };

    const removeIngredient = (index) => {
      ingredientsRefs.current.splice(index, 1); // Remove the ingredient from refs
      forceRender(); // Trigger re-render to update UI
    };

    const handleIngredientChange = (index, value) => {
      ingredientsRefs.current[index].value = value; // Update value in refs
    };

    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Ingredients</h2>
        <button
          onClick={addIngredient}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Ingredient
        </button>
        <div className="mt-4 space-y-2">
          {ingredientsRefs.current.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                defaultValue={ingredient.value}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-1"
                placeholder={`Ingredient ${index + 1}`}
              />
              <button
                onClick={() => removeIngredient(index)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const InstructionList = () => {
    const addInstruction = () => {
      instructionsRefs.current.push({ value: "" }); // Add an empty instruction to refs
      forceRender(); // Trigger re-render to display new input
    };

    const removeInstruction = (index) => {
      instructionsRefs.current.splice(index, 1); // Remove the instruction from refs
      forceRender(); // Trigger re-render to update UI
    };

    const handleInstructionChange = (index, value) => {
      instructionsRefs.current[index].value = value; // Update value in refs
    };

    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Instructions</h2>
        <button
          onClick={addInstruction}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Instruction
        </button>
        <div className="mt-4 space-y-2">
          {instructionsRefs.current.map((instruction, index) => (
            <div key={index} className="flex items-center space-x-4">
              <textarea
                defaultValue={instruction.value}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-1"
                placeholder={`Step ${index + 1}`}
              />
              <button
                onClick={() => removeInstruction(index)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Utility to force re-render
  const [, setRenderCount] = useState(0);
  const forceRender = () => setRenderCount((prev) => prev + 1);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <a
        href="/"
        className="border border-gray-300 rounded-lg shadow p-4 bg-white flex items-center justify-center mb-6"
      >
        <span className="text-3xl">←</span>
      </a>
      <h1 className="text-3xl font-bold mb-6">Recipe Submission</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Recipe Title"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <IngredientList />
        <InstructionList />
        <div>
          <h2 className="text-xl font-bold mb-2">Upload Image</h2>
          <input
            type="file"
            accept="image/*"
            className="border border-gray-300 rounded px-3 py-2"
            ref={foodImageRef}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            href="/"
          >
            Submit
          </button>
        </div>
        {responseMessage && <p className="mt-4">{responseMessage}</p>}
      </form>
    </div>
  );
}
