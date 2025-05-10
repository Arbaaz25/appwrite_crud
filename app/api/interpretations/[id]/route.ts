import { NextResponse } from "next/server";
import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";

const database = new Databases(client);

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
const COLLECTION_ID = "Interpretations";

// Helper: Fetch a single interpretation
async function fetchInterpretation(id: string) {
  try {
    return await database.getDocument(DB_ID, COLLECTION_ID, id);
  } catch (error) {
    console.error("Error fetching interpretation:", error);
    throw new Error("Failed to fetch interpretation");
  }
}

// Helper: Delete a single interpretation
async function deleteInterpretation(id: string) {
  try {
    return await database.deleteDocument(DB_ID, COLLECTION_ID, id);
  } catch (error) {
    console.error("Error deleting interpretation:", error);
    throw new Error("Failed to delete interpretation");
  }
}

// Helper: Update a single interpretation
async function updateInterpretation(
  id: string,
  data: { term: string; interpretation: string }
) {
  try {
    return await database.updateDocument(DB_ID, COLLECTION_ID, id, data);
  } catch (error) {
    console.error("Error updating interpretation:", error);
    throw new Error("Failed to update interpretation");
  }
}

// GET /api/interpretations/[id]
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
  
    try {
      const interpretation = await fetchInterpretation(id);
      return NextResponse.json(interpretation);
    } catch (error) {
        console.error("Error fetching interpretation:", error);
      return NextResponse.json(
        { message: "Failed to fetch interpretation" },
        { status: 500 }
      );
    }
  }
  

// PUT /api/interpretations/[id]
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const { term, interpretation } = await req.json();
  
    try {
      const updated = await updateInterpretation(id, { term, interpretation });
      return NextResponse.json({
        message: "Interpretation updated successfully",
        data: updated,
      });
    } catch (error) {
        console.error("Error updating interpretation:", error);
      return NextResponse.json(
        { message: "Failed to update interpretation" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
  
    try {
      await deleteInterpretation(id);
      return NextResponse.json({ message: "Interpretation deleted successfully" });
    } catch (error) {
        console.error("Error deleting interpretation:", error);
      return NextResponse.json(
        { message: "Failed to delete interpretation" },
        { status: 500 }
      );
    }
  }
  