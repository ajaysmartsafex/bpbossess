import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
            .setKey(conf.appwriteApiKey); // Add this line
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createGame({
        title, gamenumber, slug, content, featuredImage, status,
        userId, lrnumber, mrnumber, rrnumber, starttime, endtime,
        createdate
    }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                // conf.appwriteResultCollectionId,
                slug,
                {
                    title,
                    gamenumber,
                    content,
                    featuredImage,
                    status,
                    userId,
                    lrnumber,
                    mrnumber,
                    rrnumber,
                    starttime,
                    endtime,
                    createdate
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createGame :: error", error);
        }
    }

    async updateGame(slug, {
        title, gamenumber, content, featuredImage, status,
        lrnumber, mrnumber, rrnumber, starttime, endtime, createdate
    }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                // conf.appwriteResultCollectionId,
                slug,
                {
                    title,
                    gamenumber,
                    content,
                    featuredImage,
                    status,
                    lrnumber,
                    mrnumber,
                    rrnumber,
                    starttime,
                    endtime,
                    createdate
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updateGame :: error", error);
        }
    }

    async deleteGame(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                // conf.appwriteResultCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteGame :: error", error);
            return false
        }
    }

    async getGame(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                // conf.appwriteResultCollectionId,
                slug

            )
        } catch (error) {
            console.log("Appwrite serive :: getGame :: error", error);
            return false
        }
    }

    async getGames() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("status", ["active"])] // Fetch only active games
            );
            return response; // Ensure documents exist
        } catch (error) {
            console.error("Appwrite service :: getGames :: error", error);
            return { documents: [] }; // Return empty array to prevent errors
        }
    }

    // file upload service

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}


const service = new Service()
export default service