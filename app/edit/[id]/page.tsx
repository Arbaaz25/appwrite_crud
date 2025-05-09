'use client';

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 

  const [formData, setFormData] = useState({
    term: "",
    interpretation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInterpretation = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/interpretations/${id}`);
        if (!response.ok) throw new Error("Failed to fetch interpretation");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching interpretation:", error);
        setError("Failed to fetch interpretation");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterpretation();
  }, [id]);

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

    try {
      const response = await fetch(`/api/interpretations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update interpretation");

      router.push("/");
    } catch (error) {
      console.error("Error updating interpretation:", error);
      setError("Failed to update interpretation");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Edit Interpretation</h2>
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
        />
        <button className="bg-black text-white mt-5 px-4 py-1 rounded-md">
          {isLoading ? "Updating..." : "Update Interpretation"}
        </button>
      </form>
      {error && (
        <p className="bg-red-500 text-white p-4 rounded-md mt-4">{error}</p>
      )}
    </div>
  );
}
