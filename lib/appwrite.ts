import { Account, AppwriteException, Avatars, Client, Databases, ID, ImageGravity, Query, Storage, Models} from 'react-native-appwrite';
import { decode } from './generator/utils';
import { Alert } from 'react-native';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.cm.cubator",
    projectId: "665174ac000effad7836",
    storageId: "66517de40004ce27655d",
    databaseId: "66517a6f003ae616d246",
    userCollectionId: "66517ab8003e4c9fddd5",
    videoCollectionId: "66517b2900399d652f40",
    photoCollectionId: "6659e738000315aa138e",
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
const storage = new Storage(client);

export async function createUser(username:string, email:string, password:string) {
    try{

        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) {
          Alert.alert("Failed to create new account");
        }

        const avatarUrl = avatars.getInitials(username);

        const newUser = await databases.createDocument(appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId, ID.unique(), 
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            });

        await signIn(email, password);

        return newUser;

    }catch(error:any){
      Alert.alert("CreateUser: ", error.message);
    }
}

export async function getEmailToken(email:string){
    try{
      const currentUser = await databases.listDocuments(appwriteConfig.databaseId, 
        appwriteConfig.userCollectionId,[Query.equal("email", email)]);

        const token = await account.createEmailToken( currentUser.documents[0].accountId, email);

    }catch(error:any){  
        Alert.alert("verification: ", error.message);
    }
}

export async function signIn(email:string, password:string){
  try{

      account.deleteSessions;

      const registeredUser = await databases.listDocuments(appwriteConfig.databaseId, 
        appwriteConfig.userCollectionId,[Query.equal("email", email)]);

      const session = await account.createSession(registeredUser.documents[0].accountId, password);

      if(!session){
          Alert.alert("Failed to sign in");
      }

      return session;

  }catch(error:any){
    Alert.alert("signIn: ", error.message);
  }
}

export async function getAccount(){
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error:any) {
      Alert.alert("getAccount: ", error.message);
    }
  }

export async function getCurrentUser(){
  try{
      const currentAccount = await account.get();

      if(!currentAccount){
        Alert.alert("Failed to get account"); 
      }

      const currentUser = await databases.listDocuments(appwriteConfig.databaseId, 
        appwriteConfig.userCollectionId,[Query.equal("accountId", currentAccount.$id)]);

      if(!currentUser){
        Alert.alert("Failed to get current user");
        ("currentUser: "+currentUser);
      }

      return currentUser.documents[0];
    }catch(error:any){
      throw new Error(error);
    }
}

export async function signOut(){
    try {
        const session = await account.deleteSession("current");
      
        return session;
    } catch (error:any) {
        Alert.alert("signOut: ", error.message);
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
      Alert.alert("getAllPosts: ", error.message);
    }
}

export async function getAllPhotoPosts(){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.photoCollectionId,
      [Query.orderAsc('title')]
    );

    return posts.documents;
  } catch (error:any) {
    Alert.alert("getAllPhotoPosts: ", error.message);
  }
}


export async function getUserPosts(userId:string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc('createdAt')]
    );

    return posts.documents;
  } catch (error:any) {
    Alert.alert("getUserPosts: ", error.message);
  }
}

export async function getUserPhotoPosts(userId:string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.photoCollectionId,
      [Query.equal("creator", userId), Query.orderAsc("title")]
    );

    return posts.documents;
  } catch (error:any) {
    Alert.alert("getUserPhotoPosts: ", error.message);
  }
}
  
export async function searchPhotoPosts(query:string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.photoCollectionId,
      [ Query.search("positive", query), Query.search("artStyle", query)]
    );

    if (!posts) Alert.alert("Something went wrong");

    return posts.documents;
  } catch (error:any) {
    Alert.alert("searchPosts: ", error.message);
  }
}

export async function searchBookmarkPhotoPosts(userId:string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.photoCollectionId
    );

    if (!posts) Alert.alert("Appwrite List Documents Error");
    return posts.documents.filter( (post:Models.Document) => post.likes.some((like:Models.Document) => like.username === userId));
  
  } catch (error:any) {
    Alert.alert("searchBookmark: ", error.message);
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
      Alert.alert("getLatestPosts: ", error.message);
    }
}

export const getLatestPhotoPosts = async() =>{
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.photoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );

    return posts.documents;
  } catch (error:any) {
    Alert.alert("getLatestPhotoPosts: ", error.message);
  }
}

// Upload File
export async function uploadFile(file:any, type:string, size:number) {
  if (!file) return;

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      {
        name: file.split('/').pop(),
        type: "image/jpeg",
        size: size,
        uri: file,
      }
    );
  
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error:any) {
    Alert.alert("uploadFile: ", error.message);
  }
}

// Get File Preview
export async function getFilePreview(fileId:string, type:string) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      Alert.alert("Error", "Invalid file type");
    }

    if (!fileUrl) Alert.alert("getFilePreview: ");

    return fileUrl;
  } catch (error:any) {
    Alert.alert("getFilePreview", error.message);
  }
}

// Create Post
export async function createImagePost(artStyle:string, description:string, positivePrompt:string, negativePrompt:string, 
  filename: string, size: number, imageUri:any, userId:any) {
  try {
    const [photoUrl] = await Promise.all([
      uploadFile(imageUri, "image", size),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.photoCollectionId,
      ID.unique(),
      {
        title: filename.trim(),
        photo: photoUrl,
        artStyle: artStyle,
        description: description,
        positive: decode(positivePrompt),
        negative: decode(negativePrompt),
        creator: userId,
      }
    );

    return newPost;
  } catch (error:any) {
    //throw new Error(error);
    Alert.alert("createImagePost: ", error.message);
  }
}

export async function updateLike(documentId:Models.Document, userLike:any) {

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.photoCollectionId,
      documentId.$id,
      {
        likes:[...userLike, JSON.stringify(userLike)]
      }
    ).then().catch(error => {
      Alert.alert("updateLike: ", error.message);
    });
  
}
