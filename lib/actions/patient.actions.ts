
"use server"

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, databases, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file"

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
    try {

        // console.log("Creating user with data:", user);
        // console.log("API Endpoint:", process.env.NEXT_PUBLIC_ENDPOINT);
    
        const newUser = await users.create(
            ID.unique(), 
            user.email, 
            user.phone, 
            undefined, 
            user.name
        )

        console.log({newUser})
        return parseStringify(newUser);
        
    } catch (error: any) {
        if(error && error?.code == 409) {
            const existingUser = await users.list([
                Query.equal("email", [user.email])
            ])

            return existingUser.users[0]
        }
        console.error("An error occurred while creating a new user:", error);
    }
}

// GET USER
export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)
        return parseStringify(user)
    } catch (error) {
        console.error("An error occurred while fetching user data:", error);
    }
}

// REGISTER PATIENT
export const registerPatient = async ({ identificationDocument, ...patient } : RegisterUserParams) => {
    try {

        let file
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }

        // console.log({
        //     identificationDocumentId: file?.$id || null,
        //     identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        //     ...patient
        // })

        // Create new patient document
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )
        return parseStringify(newPatient);
        
    } catch (error) {
        console.error("An error occurred while registering a new patient:", error);
    }
}

// GET PATIENT
export const getPatient = async (userId: string) => {

    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )
        
        return parseStringify(patients.documents[0]);

    } catch (error) {
        console.error("An error occurred while fetching user data:", error);
    }
}