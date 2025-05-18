
import * as sdk from 'node-appwrite'

export const { 
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID:BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT:ENDPOINT
} = process.env

const client = new sdk.Client()

// console.log("Using Project ID:", PROJECT_ID)
// console.log("Using API Endpoint:", ENDPOINT)


client
    .setEndpoint(ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID || "67a8b6bd0017df750358")
    .setKey(API_KEY || "standard_2dca2ad47684217ecce1e235d2c0776f3c54e5ec1abf6aafcd8be3080a73366423aeed12be0b6f96d2f13f21ed10ceac6a6ea343d73568bdda788e6db74cdd89dac20dd770cf1a5b777aba94a117e603c78fdfd5151c9b5deb85d3b891b1f21f12c2379fa0f6b5a5f57ff70a4945416f4f365cca1f7951bafe2e7ee56f426c45")

export const databases = new sdk.Databases(client)
export const storage = new sdk.Storage(client)
export const messaging = new sdk.Messaging(client)
export const users = new sdk.Users(client)