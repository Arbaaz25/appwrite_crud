import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

async function createInterpretation(data: {
  term: string;
  interpretation: string;
}) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.log("Error creating interpretation:", error);
    throw new Error("Failed to create interpretation");
  }
}

async function FetchInterpretations() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.log("Error fetching interpretation:", error);
    throw new Error("Failed to fetch interpretation");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    await createInterpretation(data);
    return NextResponse.json({
      message: "Interpretation created successfully",
    });
  } catch (error) {
    console.log("Error creating interpretation:", error);
    return NextResponse.json(
      { message: "Failed to create interpretation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interpretations = await FetchInterpretations();
    return NextResponse.json(interpretations);
  } catch (error) {
    console.log("Error fetching interpretations:", error);
    return NextResponse.json(
      { message: "Failed to fetch interpretations" },
      { status: 500 }
    );
  }
}   
