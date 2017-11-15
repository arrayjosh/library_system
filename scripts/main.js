var bookTemplate = $('#templates .book')
var bookTable = $('#bookTable')

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
  bookTable.append(book)
}

var getBooksRequest = $.ajax({
  type: 'GET',
  url: `${baseURL}/books`,
})

getBooksRequest.done( (dataFromServer) => {
  dataFromServer.forEach( (bookData) => {
    addBookToPage(bookData)
  })
})


/*
<tr class="book" data-id="some-id">
  <td><img class="img-responsive bookImage" src="some url" alt="some title"></td>
  <td class="bookTitle">The Golden Compass</td>
</tr>
*/
