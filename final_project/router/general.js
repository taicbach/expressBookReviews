const express = require("express");
const axios = require("axios");

const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: "User successfully registered"
    });
});

// Task 1: Retrieve all books
public_users.get("/", (req, res) => {
    return res.status(200).json(books);
});

// Task 2: Retrieve a book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(book);
});

// Task 3: Retrieve books by author
public_users.get("/author/:author", (req, res) => {
    const author = req.params.author;

    const results = Object.fromEntries(
        Object.entries(books).filter(
            ([isbn, book]) => book.author === author
        )
    );

    return res.status(200).json(results);
});

// Task 4: Retrieve books by title
public_users.get("/title/:title", (req, res) => {
    const title = req.params.title;

    const results = Object.fromEntries(
        Object.entries(books).filter(
            ([isbn, book]) => book.title === title
        )
    );

    return res.status(200).json(results);
});

// Task 5: Retrieve book reviews
public_users.get("/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (Object.keys(book.reviews).length === 0) {
        return res.status(200).json({
            message: "No reviews found for this book."
        });
    }

    return res.status(200).json(book.reviews);
});

// Tasks 10-13: Axios requests using Async/Await

const getAllBooksAsync = async () => {
    const response = await axios.get(
        "http://localhost:5000/"
    );
    return response.data;
};

const getBookByISBNAsync = async (isbn) => {
    const response = await axios.get(
        `http://localhost:5000/isbn/${isbn}`
    );
    return response.data;
};

const getBooksByAuthorAsync = async (author) => {
    const response = await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
    return response.data;
};

const getBooksByTitleAsync = async (title) => {
    const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
    return response.data;
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
