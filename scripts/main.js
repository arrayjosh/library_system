/* global Requests */

var bookTemplate = $('#templates .book')
var borrowerTemplate = $('#templates .borrower')
var bookTable = $('#bookTable')
var borrowerTable = $('#borrowerTable')

// MY LIBRARY ID IS 128

var libraryID = 128
var requests = new Requests(libraryID)
// var baseURL = `https://floating-woodland-64068.herokuapp.com/libraries/${libraryID}`

var dataModel = {
  //books: [],
  //borrowers: [],
}



// The bookData argument is passed in from the API
function addBookToPage(bookData) {
  var book = bookTemplate.clone()
  book.attr('data-id', bookData.id)
  book.find('.bookTitle').text(bookData.title)
  book.find('.bookImage').attr('src', bookData.image_url)
  book.find('.bookImage').attr('alt', bookData.title)
  bookTable.prepend(book)
}

// The borrowerData argument is passed in from the API
function addBorrowerToPage(borrowerData) {
  var borrower = borrowerTemplate.clone()
  borrower.attr('data-id', borrowerData.id)
  borrower.find('.borrowerName').text(`${borrowerData.firstname} ${borrowerData.lastname}`)
  borrowerTable.prepend(borrower)
}

/*
  <tr class="borrower" data-id="some-id">
    <td class="borrowerFirstName">First Name</td>
    <td class="borrowerLastName">Last Name</td>
  </tr>
*/

var bookPromise = requests.getBooks().then((dataFromServer) => {
  dataModel.books = dataFromServer
})

var borrowerPromise = requests.getBorrowers().then((dataFromServer) => {
  dataModel.borrowers = dataFromServer
})

var promises = [bookPromise, borrowerPromise]

Promise.all(promises).then(() => {
  // First add Borrowers to the page
  dataModel.borrowers.forEach( (borrowerData) => {
    addBorrowerToPage(borrowerData)
  })

  // Next add Books to the page
  dataModel.books.forEach( (bookData) => {
    addBookToPage(bookData)
  })
})



$('#createBookButton').on('click', () => {
  var bookData = {}

  bookData.title = $('.addBookTitle').val()
  bookData.description = $('.addBookDescription').val()
  bookData.image_url = $('.addBookImageURL').val()

  requests.createBook(bookData).then((dataFromServer) => {
    addBookToPage(dataFromServer)
    $('#addBookModal').modal('hide')
    $('#addBookForm')[0].reset()
  })
})
