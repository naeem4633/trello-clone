import { createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

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
const db = getFirestore(firebaseApp);

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const signupUserWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        return userCredential.user;
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
        console.log('Successfully created a new anonymous account.', firebaseAuth.currentUser);
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
  };

  const getCurrentUser = () => {
    return firebaseAuth.currentUser;
  };

  const createBoard = async (name) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const boardsCollection = collection(db, "boards");
      const boardQuery = query(boardsCollection, where("name", "==", name), where("userId", "==", currentUser.uid));
      const boardSnapshot = await getDocs(boardQuery);
  
      if (boardSnapshot.docs.length > 0) {
        throw new Error(`Board with name '${name}' already exists`);
      }
  
      const boardRef = doc(boardsCollection);
      await setDoc(boardRef, {
        name,
        userId: currentUser.uid,
        createdAt: new Date()
      });
      return boardRef.id;
    } catch (error) {
      console.error("Error creating board:", error);
      throw error;
    }
  };
  
  const getBoardById = async (id) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const boardRef = doc(db, "boards", id);
      const boardDoc = await getDoc(boardRef);
      if (boardDoc.exists() && boardDoc.data().userId === currentUser.uid) {
        const tasksQuery = query(collection(db, "tasks"), where("boardId", "==", id), where("userId", "==", currentUser.uid));
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { id: boardDoc.id, ...boardDoc.data(), tasks };
      } else {
        throw new Error("Board not found or user not authorized");
      }
    } catch (error) {
      console.error("Error getting board:", error);
      throw error;
    }
  };
  
  const getAllBoards = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const boardsCollection = collection(db, "boards");
      const boardsQuery = query(boardsCollection, where("userId", "==", currentUser.uid));
      const boardsSnapshot = await getDocs(boardsQuery);
      const boards = await Promise.all(
        boardsSnapshot.docs.map(async (boardDoc) => {
          const tasksQuery = query(collection(db, "tasks"), where("boardId", "==", boardDoc.id), where("userId", "==", currentUser.uid));
          const tasksSnapshot = await getDocs(tasksQuery);
          const tasks = tasksSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { id: boardDoc.id, ...boardDoc.data(), tasks };
        })
      );
  
      console.log("boards by firebase:", boards);
      return boards;
    } catch (error) {
      console.error("Error getting boards:", error);
      throw error;
    }
  };
  
  const createTask = async (boardId, task) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
      if (!task.title) {
        throw new Error("Task title is required");
      }
  
      const tasksCollection = collection(db, "tasks");
      
      const taskQuery = query(tasksCollection, where("boardId", "==", boardId), where("title", "==", task.title), where("userId", "==", currentUser.uid));
      const taskSnapshot = await getDocs(taskQuery);
  
      if (!taskSnapshot.empty) {
        throw new Error(`Task with title '${task.title}' already exists on board with ID '${boardId}'`);
      }
      
      // Create a new document without specifying an ID
      const taskRef = doc(tasksCollection); // No ID provided
      await setDoc(taskRef, { ...task, boardId, userId: currentUser.uid, createdAt: new Date() });
      
      // Return the auto-generated ID of the created document
      return taskRef.id;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };
  
  const getAllTasks = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const tasksCollection = collection(db, "tasks");
      const tasksQuery = query(tasksCollection, where("userId", "==", currentUser.uid));
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return tasks;
    } catch (error) {
      console.error("Error getting tasks:", error);
      throw error;
    }
  };
  
  // Ensure to update the other CRUD operations similarly
  
  const updateBoard = async (id, data) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const boardRef = doc(db, "boards", id);
      const boardDoc = await getDoc(boardRef);
      if (boardDoc.exists() && boardDoc.data().userId === currentUser.uid) {
        await updateDoc(boardRef, data);
      } else {
        throw new Error("Board not found or user not authorized");
      }
    } catch (error) {
      console.error("Error updating board:", error);
      throw error;
    }
  };
  
  const deleteBoard = async (id) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const boardRef = doc(db, "boards", id);
      const boardDoc = await getDoc(boardRef);
      if (boardDoc.exists() && boardDoc.data().userId === currentUser.uid) {
        const tasksQuery = query(collection(db, "tasks"), where("boardId", "==", id), where("userId", "==", currentUser.uid));
        const tasksSnapshot = await getDocs(tasksQuery);
        const deleteTaskPromises = tasksSnapshot.docs.map(taskDoc => deleteDoc(taskDoc.ref));
        await Promise.all(deleteTaskPromises);
        await deleteDoc(boardRef);
      } else {
        throw new Error("Board not found or user not authorized");
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    }
  };
  
  const updateTask = async (taskId, updatedTask) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const taskDoc = doc(db, "tasks", taskId);
      const taskSnapshot = await getDoc(taskDoc);
      if (taskSnapshot.exists() && taskSnapshot.data().userId === currentUser.uid) {
        await setDoc(taskDoc, { ...updatedTask, updatedAt: new Date() });
      } else {
        throw new Error("Task not found or user not authorized");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };
  
  const getTaskById = async (taskId) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const taskDoc = doc(db, "tasks", taskId);
      const taskSnapshot = await getDoc(taskDoc);
      if (taskSnapshot.exists() && taskSnapshot.data().userId === currentUser.uid) {
        return { id: taskSnapshot.id, ...taskSnapshot.data() };
      } else {
        throw new Error("Task not found or user not authorized");
      }
    } catch (error) {
      console.error("Error getting task by ID:", error);
      throw error;
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error("User not authenticated");
  
      const taskDoc = doc(db, "tasks", taskId);
      const taskSnapshot = await getDoc(taskDoc);
      if (taskSnapshot.exists() && taskSnapshot.data().userId === currentUser.uid) {
        await deleteDoc(taskDoc);
      } else {
        throw new Error("Task not found or user not authorized");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider value={{
      signupUserWithEmailAndPassword,
      signinUser,
      signInAnonymous,
      getAuth: () => firebaseAuth,
      getCurrentUser,
      createBoard,
      getBoardById,
      getAllBoards,
      updateBoard,
      deleteBoard,
      createTask,
      getAllTasks,
      updateTask,
      getTaskById,
      deleteTask
    }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
