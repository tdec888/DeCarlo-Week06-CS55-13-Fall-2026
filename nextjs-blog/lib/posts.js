import fs from 'fs'; // Imports the Node file system module so the app can read Markdown files from disk.
import path from 'path'; // Imports the path module so the app can build the correct posts folder location.
import matter from 'gray-matter'; // Imports the Markdown parser that extracts front matter metadata from blog files.

const postsDirectory = path.join(process.cwd(), 'posts'); // Resolves the folder that contains all Markdown blog posts.

export function getSortedPostsData() {
  // Declares a function that reads every post file and returns them in date-descending order.
  const fileNames = fs.readdirSync(postsDirectory); // Lists all files in the posts directory so each Markdown post can be processed.
  const allPostsData = fileNames.map((fileName) => {
    // Builds an array of post objects from every file in the folder.
    const id = fileName.replace(/\.md$/, ''); // Removes the .md extension so the filename becomes the post slug.

    const fullPath = path.join(postsDirectory, fileName); // Combines the folder path with the current file name to get the full file location.
    const fileContents = fs.readFileSync(fullPath, 'utf8'); // Reads the Markdown file as text so the metadata can be parsed.

    const matterResult = matter(fileContents); // Uses gray-matter to separate front matter from the markdown body.

    return {
      id, // Adds the post slug to the returned data object.
      ...matterResult.data, // Spreads the front matter metadata, such as title and date, into the object.
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1; // Puts newer dates before older dates when the current post date is smaller.
    } else {
      return -1; // Keeps older dates after newer ones when the date comparison is reversed.
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory); // Reads the filenames in the posts folder again to generate route parameters.
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''), // Converts each Markdown filename into a URL-friendly blog post slug.
      },
    };
  });
}

export function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`); // Builds the exact file path for the requested Markdown file.
  const fileContents = fs.readFileSync(fullPath, 'utf8'); // Reads the Markdown file as a string so it can be parsed.

  const matterResult = matter(fileContents); // Parses the Markdown front matter and content from the file.

  return {
    id, // Adds the requested post ID to the returned object.
    ...matterResult.data, // Spreads the parsed front matter fields, like title and date, into the result.
  };
}