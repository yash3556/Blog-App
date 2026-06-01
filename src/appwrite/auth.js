import { Client, Account, ID } from 'appwrite';
import conf from '../conf/conf.js';

export class AuthService {
    client = new Client();
    account;

    constructor(){
        this.client
              .setEndpoint(conf.appwrite)
              .setProject(conf.appwriteprojectID);
        this.account = new Account(this.client);

    }

    toPlainData(data){
        if (data == null) return null;
        try {
            // Appwrite models may include helper methods; Redux state should contain only plain JSON.
            return JSON.parse(JSON.stringify(data));
        } catch (error) {
            console.log("Appwrite service :: toPlainData :: error", error);
            return null;
        }
    }

    async createUserAccount({email,password,name}){
        try {
            const userAccount = await this.account.create(ID.unique(),email,password,name);
            
            if(userAccount){
                return this.login({email,password});
            }
            else{
                return userAccount;
            }
            
        } catch (error) {
            throw error;
        }
    }
    
    async login({email,password}){
        try {
           return await this.account.createEmailPasswordSession({ email, password });
             
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(){
        try {
            const user = await this.account.get();
            return this.toPlainData(user);
        } catch (error) {
            // 401 here means no active session (guest). Treat as logged-out state.
            if (error?.code === 401) {
                return null;
            }
            console.log("Appwrite service :: getCurrentUser::: error",error);
        }
        return null;
    }

    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error",error);
        }
    }
}

export const authService = new AuthService();

export default authService;
