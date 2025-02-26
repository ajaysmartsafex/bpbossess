import conf from "../conf/conf";
import { Client, Databases, ID, Query } from "appwrite";



export class Result {

    client = new Client();
    databases;

    constructor() {
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId).setKey(conf.appwriteApiKey); // Add this line;
        this.databases = new Databases(this.client);
    }

    async createOrUpdateResult({ gameName, date, firstD, secondD, thirdD, fourD, fiveD, sixD, seveenD, eightD }) {
        if (!gameName || !date) {
            console.error("Missing required fields: gameName or date");
            return null;
        }

        try {

            // Check if result already exists for this game and date
            const existingResults = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteResultCollectionId,
                [
                    Query.equal('gameName', gameName),
                    Query.equal('date', date)
                ]
            );

            if (existingResults.total > 0) {
                const existingResult = existingResults.documents[0];
                console.log("Result already exists, updating:", existingResult);

                // Update existing result
                const updatedResponse = await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteResultCollectionId,
                    existingResult.$id,
                    { firstD, secondD, thirdD, fourD, fiveD, sixD, seveenD, eightD }
                );
                return updatedResponse;
            } else {
                // Create a new result
                const response = await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteResultCollectionId,
                    ID.unique(),
                    { gameName, date, firstD, secondD, thirdD, fourD, fiveD, sixD, seveenD, eightD }
                );

                console.log("Result created successfully:", response);
                const updatedResponse = await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteResultCollectionId,
                    response.$id,
                    { gameId: response.$id }
                );

                return updatedResponse;
            }

        } catch (error) {
            console.error("Error creating or updating result:", error);
        }
    }

    async getResult(gameName) {
        try {
            const response = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResultCollectionId,
                [Query.equal("gameName", gameName)]
            );
            return response.documents.length > 0 ? response.documents[0] : null;
        } catch (error) {
            console.error("Error fetching single result:", error);
        }
    }

    async getResults() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteResultCollectionId
            );
            return response; // Ensure documents exist
        } catch (error) {
            console.error("Error fetching results:", error);
            return { documents: [] }; // Return empty array to avoid errors
        }
    }

    async deleteResult(gameId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResultCollectionId,
                gameId
            )
            return true
        } catch (error) {
            console.error("Error delete the results:", error);
            return false
        }
    }

}

const appwriteResult = new Result()
export default appwriteResult
