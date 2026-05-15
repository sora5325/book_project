const express = require("express");
const path = require("path");
const app = express();
const { Pool } = require("pg");

app.use(express.json());
app.use(express.static('public'));


app.listen(5000, function(){
    console.log("Server is running on port 5000");
});

app.get("/", function(req, res){
    res.send("Hello Sora");
});

//when a POST request is sent to /books, add book data to the books table
app.post("/books", async function(req,res){
    console.log(req.body);
    try{
        const {title, author, status, want_to_read_rating, expectation_notes, outcome_notes, reread, relevance_rating, created_at} = req.body;
        const result = await pool.query(
            "INSERT INTO books (title, author, status, want_to_read_rating, expectation_notes, outcome_notes, reread, relevance_rating, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [title,author,status, want_to_read_rating, expectation_notes, outcome_notes, reread, relevance_rating, created_at]
        );
        res.json(result.rows[0]);

    } catch(error){
        console.error(error);
        res.status(500).json({error: "Data doesn't match the conditions"});
    }
});

//GET request in /books
app.get("/books", async function(req,res){
    console.log(req.query);
    try{
        let {search_title, search_id, search_want_to_read_rating} = req.query;
        //convert title to null if it's falsy - undefined or empty
        if (!search_title){
            search_title = null;
        } else {
            search_title = '%'+ search_title + '%';
        }
        //set search_id and rating to null if either is empty
        search_id = Number(search_id);
        search_want_to_read_rating = Number(search_want_to_read_rating);

        if (!search_id){
            search_id = null;
        } 
        if (!search_want_to_read_rating){
            search_want_to_read_rating = null;
        }
        const result = await pool.query(
            "SELECT * FROM books WHERE (title ILIKE $1 OR $1 IS NULL) AND (id = $2 OR $2 IS NULL) AND (want_to_read_rating = $3 OR $3 IS NULL)",
            [search_title, search_id, search_want_to_read_rating] 
        );
        //send the response to index.js
        res.json(result.rows);
        //log the input and result for debugging
        console.log("Query params:", search_title, search_id, search_want_to_read_rating);
        console.log("Rows returned:", result.rows);

    } catch(error){
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
});

//POST to /quotes
app.post("/quotes", async function(req,res){
    console.log(req.body);
    try{
        const {book_id, page, quote_text, thought} = req.body;
        const result = await pool.query(
            "INSERT INTO quotes (book_id, page, quote_text, thought) VALUES ($1, $2, $3, $4) RETURNING *",
            [book_id, page, quote_text, thought]
        );
        res.json(result.rows[0]);

    } catch(error){
        console.error(error);
        res.status(500).json({error: "Internal Server error"});
    }
});

//GET request in /quotes
app.get("/quotes", async function(req,res){
    console.log(req.query);
    try{
        let {book_id, text} = req.query;
        //convert title to null if it's falsy - undefined or empty
        if (!text){
            text = null;
        } else {
            text = '%'+ text + '%';
        }
        //set search_id and rating to null if either is empty
        book_id = Number(book_id);

        if (!book_id){
            book_id = null;
        } 

        const result = await pool.query(
            "SELECT * FROM quotes WHERE (quote_text ILIKE $1 OR $1 IS NULL) AND (book_id = $2 OR $2 IS NULL)",
            [text, book_id] 
        );
        //send the response to index.js
        res.json(result.rows);
        //log the input and result for debugging
        console.log("Query params:", book_id, text);
        console.log("Rows returned:", result.rows);

    } catch(error){
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
});

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "bookservice",
    password: "postgre",
    port: 5432,
});


