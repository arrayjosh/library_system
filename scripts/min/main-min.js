var bookTemplate = $('#templates .book')
var borrowerTemplate = $('#templates .borrower')
var bookTable = $('#bookTable')
var borrowerTable = $('#borrowerTable')

// MY LIBRARY ID IS 128

var libraryID = 128

var baseURL = `https://floating-woodland-64068.herokuapp.com/libraries/${libraryID}`

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
  borrower.find('.borrowerFirstName').text(borrowerData.firstname)
  borrower.find('.borrowerLastName').text(borrowerData.lastname)
  borrowerTable.prepend(borrower)
}

/*
  <tr class="borrower" data-id="some-id">
    <td class="borrowerFirstName">First Name</td>
    <td class="borrowerLastName">Last Name</td>
  </tr>
*/

var getBooksRequest = $.ajax({
  type: 'GET',
  url: `${baseURL}/books`,
})

getBooksRequest.done( (dataFromServer) => {
  dataFromServer.forEach( (bookData) => {
    addBookToPage(bookData)
  })
})

var getBorrowersRequest = $.ajax({
  type: 'GET',
  url: `${baseURL}/borrowers`
})

getBorrowersRequest.done((dataFromServer) => {
  dataFromServer.forEach( (borrowerData) => {
    addBorrowerToPage(borrowerData)
  })
})

$('#createBookButton').on('click', () => {
  var bookData = {}

  bookData.title = $('.addBookTitle').val()
  bookData.description = $('.addBookDescription').val()
  bookData.image_url = $('.addBookImageURL').val()

  var createBookRequest = $.ajax({
    type: 'POST',
    url: baseURL + '/books',
    data: {
      book: bookData
    }
  })

  createBookRequest.done((dataFromServer) => {
    addBookToPage(dataFromServer)
    $('#addBookModal').modal('hide')
    $('#addBookForm')[0].reset()
  })
})


