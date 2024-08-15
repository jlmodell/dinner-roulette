// app/page.tsx
"use client";

import { useState, useEffect } from "react";

const dinnerOptions = [
  "Dragon City",
  "McDonalds",
  "Hot Dogs / Fish Sticks",
  "Rice and Sea Weed",
  "Spaghetti and Meatballs",
];

export default function Home() {
  const [selectedDinner, setSelectedDinner] = useState<string | null>(null);
  const [availableOptions, setAvailableOptions] = useState(dinnerOptions);
  const [isRolling, setIsRolling] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load the last picked dinner from localStorage when the app loads
  useEffect(() => {
    const lastPickedDinner = localStorage.getItem("lastPickedDinner");
    if (lastPickedDinner) {
      setSelectedDinner(lastPickedDinner);
    }
  }, []);

  const rollDinner = () => {
    setIsRolling(true);
    setSelectedDinner(null); // Reset the result
    let spinDuration = 2000; // 2 seconds
    let spinInterval = 100; // Change every 100ms

    const lastPickedDinner = localStorage.getItem("lastPickedDinner");

    setAvailableOptions(
      dinnerOptions.filter((option) => option !== lastPickedDinner)
    );

    // Start cycling through dinner options quickly
    const spin = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % availableOptions.length);
    }, spinInterval);

    // Stop after the duration and set the final result
    setTimeout(() => {
      clearInterval(spin); // Stop spinning

      const finalDinner =
        availableOptions[Math.floor(Math.random() * availableOptions.length)];
      setSelectedDinner(finalDinner); // Set the final dinner

      // Store the final dinner in localStorage
      localStorage.setItem("lastPickedDinner", finalDinner);

      setIsRolling(false);
    }, spinDuration);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <BackgroundText />

      <h1 className="text-4xl font-bold text-gray-800 mb-6">Dinner Roulette</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {selectedDinner ? (
            <>
              How about <span className="text-green-500">{selectedDinner}</span>
              ?
            </>
          ) : (
            <>
              <span className="text-blue-500 animate-pulse">Rolling...</span>
            </>
          )}
        </h2>

        {/* Rotating Dinner Option */}
        <div className="text-4xl font-bold text-gray-700 h-16 flex items-center justify-center mb-4">
          {!selectedDinner && isRolling ? (
            <span className="animate-spin-slow">
              {availableOptions[currentIndex]}
            </span>
          ) : (
            <span className="text-green-500">{selectedDinner}</span>
          )}
        </div>

        <button
          onClick={rollDinner}
          className={`mt-4 px-6 py-3 text-white rounded-lg font-semibold transition-colors ${
            isRolling ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isRolling}
        >
          {isRolling ? "Rolling..." : "Spin the Wheel!"}
        </button>
      </div>
    </div>
  );
}

function BackgroundText() {
  const [positions, setPositions] = useState<number[][]>([]);

  useEffect(() => {
    // Generate random positions for each dinner option
    const generateRandomPositions = () => {
      return dinnerOptions.map(() => [
        Math.random() * 100, // Random X position
        Math.random() * 100, // Random Y position
        Math.random() * 360, // Random rotation
      ]);
    };

    // Set initial random positions
    setPositions(generateRandomPositions());

    // Update positions every 5 seconds for fun movement
    const interval = setInterval(() => {
      setPositions(generateRandomPositions());
    }, 5000);

    return () => clearInterval(interval); // Clean up interval
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {dinnerOptions.map((option, index) => (
        <span
          key={index}
          className="absolute text-gray-300 text-lg font-bold opacity-50 animate-float"
          style={{
            left: `${positions[index]?.[0]}%`,
            top: `${positions[index]?.[1]}%`,
            transform: `rotate(${positions[index]?.[2]}deg)`,
          }}
        >
          {option}
        </span>
      ))}
    </div>
  );
}
