document.addEventListener("DOMContentLoaded", function() {
    //addEventListener: when this event happens, run this function
    
    //add books
    const bookForm = document.getElementById("bookform");

    bookForm.addEventListener("submit", async function(bookSubmit) {
        //prevent the page from reloading every time the form is submitted
        bookSubmit.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const status = document.getElementById("status").value;
        const want_to_read_rating = Number(document.getElementById("want_to_read_rating").value);
        const expectation_notes = document.getElementById("expectation_notes").value;
        const outcome_notes = document.getElementById("outcome_notes").value;
        const reread = document.getElementById("reread").checked;
        const relevance_rating = Number(document.getElementById("relevance_rating").value);
        const created_at = document.getElementById("created_at").value;

        //send a POST request to the server
        try{
            const response = await fetch("/books", {
                method: "POST",
                //metadata about the request. 
                headers: {
                    "Content-Type": "application/json",
                    "x-add-data-password": document.getElementById("addDataPassword").value
                },
                //actual data being sent
                //stringify: convert the object into JSON string
                body: JSON.stringify({
                    title: title,
                    author: author,
                    status: status,
                    want_to_read_rating: want_to_read_rating,
                    expectation_notes: expectation_notes,
                    outcome_notes: outcome_notes,
                    reread: reread,
                    relevance_rating: relevance_rating,
                    created_at: created_at
                })
            });

            if (!response.ok){
                //if response from the server is 500 (internal server error)
                throw new Error("Server error");
            }
            const result = await response.json();
            console.log("Successfully added:", result);
            
        }catch (error) {
            console.error("Failed", error);
        }
    });

    //search books
    const bookSearch = document.getElementById("booksearch");

    bookSearch.addEventListener("submit", async function(bookSubmit) {
        //prevent the page from reloading every time the form is submitted
        bookSubmit.preventDefault();

        const book_id = Number(document.getElementById("search_id").value);
        const title = document.getElementById("search_title").value;
        const want_to_read_rating = Number(document.getElementById("search_want_to_read_rating").value);

        //send a GET request to /books
        try{
            //GET has an URL but not a body. Header and method are automatically set to default
           
            const params = new URLSearchParams({
                search_id: book_id,
                search_title: title,
                search_want_to_read_rating: want_to_read_rating
            });

            const response = await fetch("/books?" + params);

            if (!response.ok){
                throw new Error("Server error");
            }
        
           

            const result = await response.json();
            console.log("Successfully gotten:", result);

            const bookresult = document.getElementById("bookresult");

            bookresult.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Want-to-read rating</th>
                            <th>Expectation notes</th>
                            <th>Outcome notes</th>
                            <th>Reread</th>
                            <th>Relevance rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.map(book => `
                            <tr>
                                <td>${book.title ?? ""}</td>
                                <td>${book.author ?? ""}</td>
                                <td>${book.status ?? ""}</td>
                                <td>${book.want_to_read_rating ?? ""}</td>
                                <td>${book.expectation_notes ?? ""}</td>
                                <td>${book.outcome_notes ?? ""}</td>
                                <td>${book.reread ?? ""}</td>
                                <td>${book.relevance_rating ?? ""}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;


        } catch (error) {
            console.error("Failed", error);
        };
    });



    //add quotes
    const quoteForm = document.getElementById("quoteform");

    quoteForm.addEventListener("submit", async function(quoteSubmit) {
        //prevent the page from reloading every time the form is submitted
        quoteSubmit.preventDefault();

        const book_id = Number(document.getElementById("book_id").value);
        const page = Number(document.getElementById("page").value);
        const quote_text = document.getElementById("quote_text").value;
        const thought = document.getElementById("thought").value;

        //send a POST request to /quotes
        try{
            const response = await fetch("/quotes", {
                method: "POST",
                //metadata about the request. 
                headers: {
                    "Content-Type": "application/json",
                    "x-add-data-password": document.getElementById("addDataPassword").value
                },
                //actual data being sent
                //stringify: convert the object into JSON string
                body: JSON.stringify({
                    book_id: book_id,
                    page: page,
                    quote_text: quote_text,
                    thought: thought
                })
            });
            //if response from the server is 500 (internal server error)
            if (!response.ok){
                throw new Error("Server error");
            }
        
            const result = await response.json();
            console.log("Successfully added:", result);
        } catch (error) {
            console.error("Failed", error);
        };
    });

    //search quotes
    const quoteSearch = document.getElementById("quotesearch");

    quoteSearch.addEventListener("submit", async function(quoteSubmit) {
        //prevent the page from reloading every time the form is submitted
        quoteSubmit.preventDefault();

        const book_id = Number(document.getElementById("search_book_id").value);
        const text = document.getElementById("search_quote_text").value;

        //send a GET request to /books
        try{
            const response = await fetch("/quotes?search_book_id="+book_id+"&search_quote_text="+text);
            //if response from the server is 500 (internal server error)
            if (!response.ok){
                throw new Error("Server error");
            }
        
            
            const result = await response.json();
            console.log("Successfully gotten:", result);

            const quoteresult = document.getElementById("quoteresult");

            quoteresult.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Page</th>
                            <th>Quote</th>
                            <th>Thoughts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.map(quote => `
                            <tr>
                                <td>${quote.book_id ?? ""}</td>
                                <td>${quote.page ?? ""}</td>
                                <td>${quote.quote_text ?? ""}</td>
                                <td>${quote.thought ?? ""}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;

        } catch (error) {
            console.error("Failed", error);
        };
    });    

});