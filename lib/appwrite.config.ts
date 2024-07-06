import * as sdk from "node-appwrite";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const client = new sdk.Client();
client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
