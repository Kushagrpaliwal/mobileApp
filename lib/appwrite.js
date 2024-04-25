import { Account, Avatars, Client, Databases, ID , Query , Storage} from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.kp.Aora',
    projectId: '6623489b8a21b31c3fc7',
    storageId: '66234e7150fdec9297ff',
    databaseId: '66234a4c4b7e3b5c20da',
    userCollectionId: '66234cb1210e8ce20c11',
    videoCollectionId: '66234cde93a3b9f88de0',
}

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username);
        await signIn(email,password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
             {
                accountId : newAccount.$id,
                email:email,
                username:username,
                avatar: avatarUrl,
            }
        )
        return newUser
    } catch (error) {
        throw new Error(error);
    }
}

export const signIn = async(email,password) => {
    try {
        const session = await account.createEmailSession(email,password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error ;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId' , currentAccount.$id)]
        )
        if(!currentUser) throw Error ;

        return currentUser.document[0] ;
    } catch (error) {
        console.log(error)
    }
}