import { db } from './firebase'; // Imports the shared Firestore database connection from the Firebase setup file.
import { collection, getDocs, query, where, documentId } from 'firebase/firestore'; // Imports Firestore helpers used to read collections and query documents by field.

export async function getSortedPostsData() {
    // Defines an async function that fetches every post from Firestore and returns only the fields needed for the app.
    const myCollectionRef = collection(db, "posts"); // Points at the "posts" collection in Firestore.
    const querySnapshot = await getDocs(myCollectionRef); // Waits for Firestore to return all documents in that collection.
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Converts each document into a plain object that includes the document ID and all stored fields.

    jsonObj.sort(function (a, b) {
        return a.title.localeCompare(b.title); // Sorts the post list alphabetically by the title field.
    });

    return jsonObj.map(item => { // Maps the sorted objects down to the exact shape the app expects.
        return {
            id: item.id.toString(), // Ensures the ID stays a string so dynamic routes and page params match consistently.
            title: item.title, // Keeps the post title for display in the list.
            date: item.date // Keeps the post date so the UI can show publication dates.
        };
    });
}

export async function getAllPostIds() {
    const myCollectionRef = collection(db, "posts"); // Reopens the "posts" collection so the app can generate route IDs.

    const querySnapshot = await getDocs(myCollectionRef); // Pulls all Firestore documents to create path parameters for each post.

    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id })); // Creates a lightweight list of document IDs for the route generation step.

    return querySnapshot.docs.map((doc) => ({ // Builds the object shape expected by Next.js dynamic routes.
        params: { id: doc.id }, // Stores each Firestore document ID as the route parameter value.
    }));
}

export async function getPostData(id) {
    const myCollectionRef = collection(db, "posts"); // Opens the collection so the function can look up a specific post.
    const searchQuery = query( // Creates a Firestore query that narrows the collection to one matching document.
        myCollectionRef,
        where(
            documentId(),
            "==",
            id
        )
    );

    const querySnapshot = await getDocs(searchQuery); // Executes the query and waits for the matching document result.
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Converts the result into a plain JS object with the document ID and its data.

    if (jsonObj.length === 0) { // Checks whether no post matches the requested ID.
        return {
            id: id, // Keeps the route parameter value in the fallback object.
            title: 'Not found', // Provides a default title when the record is missing.
            date: '', // Leaves the date blank because there is no real post data.
            contentsHtml: 'Not found' // Supplies placeholder content for a missing page.
        };
    } else {
        return jsonObj[0]; // Returns the first matching post object so the page can render the real content.
    }
}
