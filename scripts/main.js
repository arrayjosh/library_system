/* global Requests */

var bookTemplate = $('#templates .book')
var borrowerTemplate = $('#templates .borrower')
var bookTable = $('#bookTable')
var borrowerTable = $('#borrowerTable')
var borrowerOptionTemplate = $('#templates .borrowerOption')

// MY LIBRARY ID IS 128

var libraryID = 148
var requests = new Requests(libraryID)
// var baseURL = `https://floating-woodland-64068.herokuapp.com/libraries/${libraryID}`

var dataModel = {
  //books: [],
  //borrowers: [],
}

// The bookData argument is passed in from the API
function addBookToPage(bookData) {
  // Add bookData to a new table row
  var book = bookTemplate.clone(true, true)
  book.attr('data-id', bookData.id)
  book.find('.bookTitle').text(bookData.title)
  book.find('.bookImage').attr('src', bookData.image_url)
  book.find('.bookImage').attr('alt', bookData.title)
  bookTable.append(book)

  // Select the correct borrower for this book
  if(bookData.borrower_id !== null) {
    book.find(`.borrowerOption[value="${bookData.borrower_id}"]`).attr('selected', 'selected')
    incrementBorrowerCount(bookData.borrower_id)
  }
}

// The borrowerData argument is passed in from the API
function addBorrowerToPage(borrowerData) {
  var fullName = `${borrowerData.firstname} ${borrowerData.lastname}`

  // Adds the borrower to the borrowerTable
  var borrower = borrowerTemplate.clone(true, true)
  borrower.attr('data-id', borrowerData.id)
  borrower.find('.borrowerName').text(fullName)
  borrowerTable.append(borrower)

  // Add borrower to select dropdown
  var borrowerOption = borrowerOptionTemplate.clone()
  borrowerOption.text(fullName)
  borrowerOption.attr('value', borrowerData.id)
  $('.borrowerSelect').append(borrowerOption)
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

function findBookModel(bookID) {
  for (var i = 0; i < dataModel.books.length; i++) {
    if(dataModel.books[i].id === bookID) return dataModel.books[i]
  }
}


$('.borrowerSelect').on('change', (event) => {
  var borrowerID = $(event.target).val()
  var bookID = $(event.target).parents('.book').attr('data-id')
  var oldBorrowerID = findBookModel(Number(bookID)).borrower_id
  console.log("The id is " + borrowerID)
  requests.updateBook({borrower_id: borrowerID, id: bookID}).then(() => {
    incrementBorrowerCount(borrowerID)
    findBookModel(Number(bookID)).borrower_id = Number(borrowerID)
    decrementBorrowerCount(oldBorrowerID)
  })
})


function incrementBorrowerCount(borrowerID) {
  var borrowerRow = $(`.borrower[data-id="${borrowerID}"]`)
  var badgeValue = Number(borrowerRow.find('.badge').text())
  borrowerRow.find('.badge').text(badgeValue + 1)
}

function decrementBorrowerCount(borrowerID) {
  var borrowerRow = $(`.borrower[data-id="${borrowerID}"]`)
  var badgeValue = Number(borrowerRow.find('.badge').text())
  borrowerRow.find('.badge').text(badgeValue - 1)
}

$('.addBookImageURL').on('input', (event) => {
  var url = $(event.target).val()
  url.length > 0 ? $('.imagePreview').removeClass('hidden') : $('.imagePreview').addClass('hidden')
  $('.imagePreview img').attr('src', url)
})

$('.borrower').on('click', (event) => {
  var borrowerID = $(event.currentTarget).attr('data-id')
  var borrowerName = $(event.currentTarget).find('.borrowerName').text()
  var viewBorrowerModal = $('#viewBorrowerModal')
  viewBorrowerModal.find('#viewBorrowerModalLabel').text(borrowerName)
  viewBorrowerModal.find('.borrowedBooks').text('')
  dataModel.books.forEach((book) => {
    if(book.borrower_id === Number(borrowerID)) {
      viewBorrowerModal.find('.borrowedBooks').append('<li>' + book.title + '</li>')
    }
  })

  var noBooksMsg = viewBorrowerModal.find('.noBooksMsg')
  $('.borrowedBooks li').length === 0 ?
    noBooksMsg.removeClass('hidden') : noBooksMsg.addClass('hidden')

  viewBorrowerModal.modal('show')
})

$('.searchBox input').on('input', (event) => {
  var searchString = $(event.target).val().toLowerCase()

  dataModel.books.forEach((book) => {
    var bookRow = $(`.book[data-id="${book.id}"]`)
    if(book.title.toLowerCase().includes(searchString) || book.description.toLowerCase().includes(searchString)) {
      bookRow.removeClass('hidden')
    } else {
      bookRow.addClass('hidden')
    }
  })

})
