import { Account, AppwriteException, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.cm.cubator",
    projectId: "665174ac000effad7836",
    storageId: "66517de40004ce27655d",
    databaseId: "66517a6f003ae616d246",
    userCollectionId: "66517ab8003e4c9fddd5",
    videoCollectionId: "66517b2900399d652f40",
} 

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(username:string, email:string, password:string){
    try{

        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) {
            throw new Error("Failed to create account");
        }

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId, ID.unique(), 
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            });

        return newUser;

    }catch(error:any){
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email:string, password:string){
    try{

        account.deleteSessions;

        const session = await account.createEmailPasswordSession(email, password);

        if(!session){
            throw new Error("Failed to sign in");
        }

        return session;

    }catch(error:any){
        console.log("signIn: "+ AppwriteException );
        throw new Error(error);
    }
}

export async function getAccount(){
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error:any) {
      throw new Error(error);
    }
  }

export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();

        if(!currentAccount){
            throw new Error("Failed to get current account");   
        }

        const currentUser = await databases.listDocuments(appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId,[Query.equal("accountId", currentAccount.$id)]);

        if(!currentUser){
            throw new Error("Failed to get current user");
        }

        return currentUser.documents[0];
    }catch(error:any){
        console.log("getCurrentUser: "+error);
        throw new Error(error);
    }
}

export async function signOut(){
    try {
        const session = await account.deleteSession("current");
      
        return session;
    } catch (error:any) {
        console.log("signOut: "+error);
        throw new Error(error);
    }
}

export async function getAllPosts(){
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId
      );
  
      return posts.documents;
    } catch (error:any) {
      throw new Error(error);
    }
}


export async function getUserPosts(userId:string) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.equal("creator", userId)]
      );
  
      return posts.documents;
    } catch (error:any) {
      throw new Error(error);
    }
  }
  
  export async function searchPosts(query:string) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.search("title", query)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error:any) {
      throw new Error(error);
    }
  }

export const getLatestPosts = async() =>{
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(7)]
      );
  
      return posts.documents;
    } catch (error:any) {
      throw new Error(error);
    }
}

