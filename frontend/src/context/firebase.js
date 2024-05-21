import { createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, linkWithCredential, EmailAuthProvider, linkWithPopup } from 'firebase/auth';
import { getDatabase, set, ref, update, remove } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDTTfp4bgF0KFw-pxsQ231hHuau2WxFT8g",
    authDomain: "trello-clone-d8c05.firebaseapp.com",
    projectId: "trello-clone-d8c05",
    storageBucket: "trello-clone-d8c05.appspot.com",
    messagingSenderId: "1094953664317",
    appId: "1:1094953664317:web:7970ce63d80f16e0d10f54",
    measurementId: "G-693W9JVN9Q"
  };

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
// const database = getDatabase(firebaseApp);

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
    const getAuth = () => {
        return firebaseAuth;
    }
    const signupUserWithEmailAndPassword = (email, password, displayName) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCredential) => {
            return userCredential.user;
        })
        .then((user) => {
            return signInWithEmailAndPassword(firebaseAuth, email, password);
        })
        .catch((error) => {
            console.error('Error signing up:', error);
            throw error;
        });
    };


    const signinUser = (email, password) => {
        return signInWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                return userCredential.user;
            })
            .catch((error) => {
                console.error('Error signing in with email and password:', error);
                throw error;
            });
    };

    const signInAnonymous = () => {
        signInAnonymously(firebaseAuth)
        .then(() => {
            console.log( 'Successfully created a new anonymous account.', firebaseAuth.currentUser );
        })
        .catch((error) => {
            console.error("Error signing in anonymously:", error);
        });
    };
    

    const getCurrentUser = () => {
        return firebaseAuth.currentUser;
    };

    // const putData = (key, data) => set(ref(database, key), data);

return (
    <FirebaseContext.Provider value={{signupUserWithEmailAndPassword,  signinUser, signInAnonymous, getAuth, getCurrentUser}}>
      {props.children}
    </FirebaseContext.Provider>
);
};