"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IInterpretation {
  $id: string;
  term: string;
  interpretation: string;
}

export default function Home() {
  const [interpretation, setInterpretation] = useState<IInterpretation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/interpretations`);
        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();
        setInterpretation(data);
      } catch (error) {
        console.error("Error fetching interpretations:", error);
        setError("Failed to fetch interpretations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterpretations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/interpretations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete interpretation");
      }
      setInterpretation(
        (prev) => prev?.filter((item) => item.$id !== id) || []
      );
    } catch (error) {
      console.error("Error deleting interpretation:", error);
      setError("Failed to delete interpretation");
    }
  };
  return (
    <div>
      {error && <p className="bg-red-500 text-white p-4 rounded-md">{error}</p>}

      {isLoading ? (
        <p>Loading Interpretations...</p>
      ) : interpretation?.length > 0 ? (
        <div className="p-4 my-2 rounded-md border-b leading-8">
          {interpretation?.map((item) => (
            <div key={item.$id}>
              <div className="font-bold">{item.term}</div>
              <div>{item.interpretation}</div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                  href={"/edit/" + item.$id}
                >
                  Edit
                </Link>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest cursor-pointer"
                  onClick={() => handleDelete(item.$id)}
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No Interpretations</p>
      )}
    </div>
  );
}
