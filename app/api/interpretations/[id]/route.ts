import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch a single interpretation
async function FetchInterpretation(id: string) {
  try {
    const interpretation = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id
    );
    return interpretation;
  } catch (error) {
    console.log("Error fetching interpretation:", error);
    throw new Error("Failed to fetch interpretation");
  }
}

//Delete a single interpretation
async function deleteInterpretation(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id
    );
    return response;
  } catch (error) {
    console.log("Error deleting interpretation:", error);
    throw new Error("Failed to delete interpretation");
  }
}

//Update a single interpretation
async function updateInterpretation(
  id: string,
  data: { term: string; interpretation: string }
) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id,
      data
    );
    return response;
  } catch (error) {
    console.log("Error updating interpretation:", error);
    throw new Error("Failed to update interpretation");
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await FetchInterpretation(id);
    return NextResponse.json(interpretation);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const response = await deleteInterpretation(id);
    return NextResponse.json({
      message: "Interpretation deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete interpretation" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    const response = await updateInterpretation(id, data);
    return NextResponse.json({
      message: "Interpretation updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update interpretation" },
      { status: 500 }
    );
  }
}
