import fs from 'fs'; // Imports the Node file system module so the app can read JSON files from disk.
import path from 'path'; // Imports the path module so the app can resolve the correct data directory on the machine.

const dataDir = path.join(process.cwd(), 'data'); // Points to the local data folder where the JSON post file lives.

export function getSortedPostsData() { // Defines a function that reads the JSON file and returns posts in a display-friendly order.
    const filePath = path.join(dataDir, 'posts.json'); // Combines the data directory with the specific JSON filename.
    const jsonString = fs.readFileSync(filePath, 'utf8'); // Reads the file contents as a UTF-8 string for JSON parsing.
    const jsonObj = JSON.parse(jsonString); // Converts the raw JSON text into a JavaScript array of post objects.

    jsonObj.sort(function (a, b) {
        return a.title.localeCompare(b.title); // Sorts posts alphabetically by their title so the list is readable.
    });

    return jsonObj.map(item => { // Creates a simplified array of post data that matches the app's expected shape.
        return {
            id: item.id.toString(), // Converts the numeric ID into a string so it can be used in routes.
            title: item.title, // Keeps the title for the article list and detail pages.
            date: item.date // Keeps the publish date so the UI can display it.
        };
    });
}

export function getAllPostIds() { // Defines a function that returns all post IDs in the route format expected by Next.js.
    const filePath = path.join(dataDir, 'posts.json'); // Resolves the JSON file again to fetch the available posts.
    const jsonString = fs.readFileSync(filePath, 'utf8'); // Reads the JSON from disk as text.
    const jsonObj = JSON.parse(jsonString); // Parses the text into a JavaScript object array.

    return jsonObj.map(item => { // Maps each post object into a Next.js params object.
        return {
            params: {
                id: item.id.toString() // Uses each post's ID as the dynamic route parameter value.
            }
        };
    });
}

export function getPostData(id) {
    const filePath = path.join(dataDir, 'posts.json'); // Resolves the data file path for the requested post dataset.
    const jsonString = fs.readFileSync(filePath, 'utf8'); // Reads the JSON file content from disk.
    const jsonObj = JSON.parse(jsonString); // Converts the raw text into a JavaScript array.

    const objReturned = jsonObj.filter(obj => { // Finds the matching post by comparing the route ID to the stored ID.
        return obj.id.toString() === id; // Compares both values as strings so the match is consistent.
    });

    if (objReturned.length === 0) { // Checks whether the requested post was not found.
        return {
            id: id, // Keeps the requested ID in the fallback object.
            title: 'Not Found', // Displays a friendly placeholder title for missing posts.
            date: 'Not Found', // Displays a placeholder date when no real post exists.
            contentsHTML: 'Not Found' // Creates placeholder post content for an empty result.
        };
    } else {
        return objReturned[0]; // Returns the exact post object that matched the route ID.
    }
}