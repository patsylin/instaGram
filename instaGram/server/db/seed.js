const { Client } = require("pg");
const client = require("./db/client"); // Import the client from your client.js file in the DB folder

const { createUser, getAllUsers } = require('./helpers/users')
const { createPost } = require('./helpers/posts')
const { createComment, getCommentById } = require('./helpers/comments')
const { createLike } = require('./helpers/likes')

const { users, posts, comments, likes } = require('./seedData')

async function dropTables() {
  try {
    await client.connect();

    // Drop existing tables if they exist
    await client.query("DROP TABLE IF EXISTS users");
    await client.query("DROP TABLE IF EXISTS posts");
    await client.query("DROP TABLE IF EXISTS comments");
    await client.query("DROP TABLE IF EXISTS likes");

    console.log("Tables dropped successfully");
  } catch (error) {
    console.error("Error dropping tables");
    throw error;
  }
}

async function createTables() {
  try {
    await client.query(`
        CREATE TABLE users (
            "user_id" SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            email varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            profile_pic_url bytea NOT NULL,
            full_name varchar(255) NOT NULL,
            bio varchar(255) NOT NULL
        );
        CREATE TABLE posts (
            "post_id" SERIAL PRIMARY KEY,
            "user_id" INTEGER REFERENCES users("user_id") NOT NULL,
            caption varchar(255) NOT NULL,
            image_url bytea NOT NULL,
            time_stamp integer NOT NULL
        );
        CREATE TABLE comments (
            "comment_id" SERIAL PRIMARY KEY,
            "user_id" INTEGER REFERENCES users("user_id") NOT NULL,
            "post_id" INTEGER REFERENCES posts("post_id") NOT NULL,
            text varchar(255) NOT NULL,
            time_stamp integer NOT NULL
        );
        CREATE TABLE likes (
          "like_id" SERIAL PRIMARY KEY,
          "user_id" INTEGER REFERENCES users("user_id") NOT NULL,
          "post_id" INTEGER REFERENCES posts("post_id") NOT NULL,
          time_stamp integer NOT NULL
      );
    `);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await client.end();
  }
}
const createInitialUsers = async () => {
  try {
      //Looping through the "users" array from seedData
      for (const user of users) {
          //Insert each trainer into the table
          await createUser(user)
      }
      console.log("created user")
  } catch (error) {
      throw error
  }
}

//Create types
const createInitialPosts = async () => {
  try {
      for (const post of posts) {

          await createPost(post)
      }
      console.log("created post")
  } catch (error) {
      throw error
  }
}

//Create species
const createInitialComment = async () => {
  try {
      for (const comment of comments) {

          await createComment(comment)
      }
      console.log("created comment")
  } catch (error) {
      throw error
  }
}

//Create pokemon
const createInitialLike = async () => {
  try {
      for (const like of likes) {

          await createLike(like)
      }
      console.log("created like")
  } catch (error) {
      throw error
  }
}

//Call all my functions and 'BUILD' my database
const rebuildDb = async () => {
  try {
      //ACTUALLY connect to my local database
      client.connect()
      //Run our functions
      await dropTables()
      await createTables()

      //Generating starting data
      console.log("starting to seed...")
      await createInitialUsers()
      await createInitialPosts()
      await createInitialComments()
      await createInitialLikes()

  } catch (error) {
      console.error(error)
  } finally {
      //close our connection
      client.end()
  }
}

rebuildDb()
