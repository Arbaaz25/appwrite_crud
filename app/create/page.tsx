"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePage() {
  const [formData, setFormData] = useState({
    term: "",
    interpretation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    if (!formData.term || !formData.interpretation) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/interpretations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add interpretation");
      }

      const data = await response.json();
      setFormData({ term: "", interpretation: "" });
        router.push("/");

    } catch (error) {
      console.error("Error adding interpretation:", error);
      setError("Failed to add interpretation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="term"
          placeholder="Term"
          value={formData.term}
          onChange={handleChange}
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="interpretation"
          rows={4}
          placeholder="Interpretation"
          value={formData.interpretation}
          onChange={handleChange}
          className="py-1 px-4 border rounded-md resize-none"
        ></textarea>
        <button
          className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Interpretation"}
        </button>
      </form>
      {error && (
        <p className="bg-red-500 text-white p-4 rounded-md mt-4">{error}</p>
      )}
    </div>
  );
}
