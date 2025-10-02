const openModalBtn = document.getElementById('add-book-btn');
const modalContainer = document.getElementById('modal-container');
const closeModalBtn = document.querySelector('.exit-button');
const cancelModalBtn = document.querySelector('.cancel-btn');
const addBookForm = document.querySelector('#modal-box form');

//refactored to use class 
class Book {

constructor(title, author, pages, isRead){
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
    this.id = (typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
 toggleReadStatus(){
  this.isRead = !this.isRead;
 }
}



class Library{
  constructor(){
    this.books = []
  }

  addBook(title, author, pages, isRead){
    const newBook = new Book(title, author, pages, isRead);
    this.books.push(newBook)
  }

  removeBook(bookId){
    const bookIndex = this.books.findIndex(book => book.id === bookId);
    if (bookIndex > -1){
      this.books.splice(bookIndex, 1);
    }
  }

   findBook(bookId) {
    return this.books.find(book => book.id === bookId);
  }

}


const myLibrary = new Library();
// show and hide the modal

function showModal(){
  modalContainer.classList.remove('hidden');
}

function hideModal(){
  addBookForm.reset(); //clear the form fields
  modalContainer.classList.add('hidden');
}
// modal event listeners
openModalBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);
cancelModalBtn.addEventListener('click', (event) =>{
  event.preventDefault(); //prevent default button behavior
  hideModal()
})

// handle the form submission

addBookForm.addEventListener('submit', (event) =>{
  event.preventDefault() // stops the form from refreshing the page

  //get the values from the form inputs
  const title = document.getElementById('book-name').value;
  const author = document.getElementById('author-name').value;
  const pages = document.getElementById('pages-amount').value;

  myLibrary.addBook(title, author, pages, false);
  //update the display to show the new book
  displayLibrary();
  // close the modal
  hideModal()
});

function displayLibrary(){
  const cardGrid = document.getElementById('card-grid');
  //clear the grid completely before re-drawing it
  cardGrid.innerHTML = '';

  // loop through each book in the library array
  myLibrary.books.forEach(book => {
  // creating the card and its elements matching my html structure
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.bookId = book.id; // link the card to the book's unique ID

    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';
    card.appendChild(cardInfo)

    const title = document.createElement('h2');
    title.className = 'card-title';
    title.textContent = book.title;
    cardInfo.appendChild(title);

    const author = document.createElement('h3');
    author.className = 'card-undertext';
    author.textContent = `By ${book.author}`;
    cardInfo.appendChild(author);

    const pages = document.createElement('p');
    pages.className = 'card-pages';
    pages.textContent = `${book.pages} pages`;
    cardInfo.appendChild(pages)

    const readStatus = document.createElement('span');
    readStatus.className = 'read-status';
    readStatus.textContent = book.isRead ? 'Finished' : 'Reading';
    readStatus.style.color = book.isRead ? 'green' : 'goldenrod';
    cardInfo.appendChild(readStatus);

    const cardButtons = document.createElement('div');
    cardButtons.className = 'card-buttons';
    card.appendChild(cardButtons)

    const toggleReadBtn = document.createElement('button');
    toggleReadBtn.textContent = book.isRead? 'Mark as Reading' : 'Mark as Finished';
    cardButtons.appendChild(toggleReadBtn);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'remove';
    cardButtons.appendChild(removeBtn);

    // add event listeners to the buttons on THIS card 
    removeBtn.addEventListener('click', () => {
      myLibrary.removeBook(book.id)
      displayLibrary() //refresh the display
    })

    toggleReadBtn.addEventListener('click', () =>{
      const bookToToggle = myLibrary.findBook(book.id);
      bookToToggle.toggleReadStatus();
      displayLibrary(); 
    })

    cardGrid.appendChild(card);
  })
}

myLibrary.addBook("Shadow Slave", "Guiltythree", "2591", false);
myLibrary.addBook("A Regressor's Tale of Cultivation", "NeverluckySMILE", "810", true);
displayLibrary();