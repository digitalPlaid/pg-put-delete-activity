$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.deleteBtn', deleteBook);
  $('#bookShelf').on('click', '.markReadBtn', markRead);
}

function markRead() {
  let id = $(this).closest('tr').data('id')
  let status = Boolean($(this).parent().siblings('.status').text());
  console.log(status);
  $.ajax({
    method: 'PUT',
    url: `/books/${id}`,
    data: {status: !Boolean(status)}
  }).then((response) => {
    refreshBooks();
  }).catch(error => {
    console.log('failed to update book status: ', error);
    alert('failed to update the book\'s status. check console for error')
  })
}

function deleteBook() {
  // collect id
  let id = $(this).closest('tr').data('id');
  // send delete request to server
  $.ajax({
    method: 'DELETE',
    url: `/books/${id}`
  }).then((response) => {
    // if successfully deleted, reload the books
    refreshBooks() 
  }).catch((error) => {
    // if fail, let them know
    console.log('Failed to delete the book: ', error);
    alert('Failed to delete the book. See console for error')
  })
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr data-id="${book.id}">
        <td><button class="deleteBtn">Delete</button</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td class="status">${book.isRead}</td>
        <td><button class="markReadBtn">Mark as Read</button></td>
      </tr>
    `);
  }
}
