// document.addEventListener("DOMContentLoaded", function() {});

// ----------Variable Definitions---------- //
const bookList = document.querySelector("#list")
const showPanel = document.querySelector("#show-panel")

// ----------Function Definitions---------- //

function getBooks() {
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(booksArray => booksArray.forEach(book => {
        renderTitle(book)
    }))
}

function renderTitle(book) {
    const bookTitle = document.createElement("li")
    bookTitle.dataset.id = book.id
    bookTitle.textContent = book.title

    bookList.append(bookTitle)
} 

function renderBook(bookObj) {
    showPanel.innerHTML = ""
    const bookImage = document.createElement("img")
    bookImage.src = bookObj.img_url

    const bookTitle = document.createElement("h3")
    bookTitle.textContent = bookObj.title

    const bookSubtitle = document.createElement("h3")
    bookSubtitle.textContent = bookObj.subtitle

    const bookAuthor = document.createElement("h3")
    bookAuthor.textContent = bookObj.author

    const bookDescription = document.createElement("p")
    bookDescription.textContent = bookObj.description

    const likeButton = document.createElement("button")
    likeButton.dataset.id = bookObj.id
    likeButton.textContent = "Like This Book!"

    const bookUsers = document.createElement("ul")
    
    bookObj.users.forEach (user => {
        const userLi = document.createElement("li")
        userLi.textContent = user.username
        bookUsers.append(userLi)
    })

    showPanel.append(bookImage, bookTitle, bookSubtitle, bookAuthor, bookDescription, bookUsers, likeButton)
}

function addSelfToUsers(bookObj) {
    bookObj.users.push({"id": 1, "username":"pouros"})
    const users = {"users": bookObj.users}
    return users
}

function initialize() {
    getBooks()
}


// ----------Event Listeners---------- //


bookList.addEventListener("click", event => {
    if (event.target.tagName === "LI") {
        const bookId = event.target.dataset.id
        
        fetch(`http://localhost:3000/books/${bookId}`)
        .then(response => response.json())
        .then(bookObj => renderBook(bookObj))
    }
})

showPanel.addEventListener("click", event => {
    if (event.target.tagName === "BUTTON") {
        const bookId = event.target.dataset.id
        
        fetch(`http://localhost:3000/books/${bookId}`)
        .then(response => response.json())
        .then(bookObj => {
            const newUsers = addSelfToUsers(bookObj)
            // console.log(newUsers)

            fetch(`http://localhost:3000/books/${bookId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify(newUsers)
            })
            .then(response => response.json())
            .then(updatedBook => renderBook(updatedBook))

        })

    }
})



// ----------Initialization---------- //

initialize()