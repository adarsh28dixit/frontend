import { useEffect, useState } from "react";
import axios from "axios";

const BookList = () => {
  const [bookData, setBookData] = useState([]);
  const [memberId, setMemberId] = useState();
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    getAllBooks();
  }, []);
  const getAllBooks = async () => {
    const books = await axios.get("http://localhost:3000/v1/books");
    //console.log(books)
    setBookData(books.data);
  };

  const handleCheckout = async(book) => {
    if(book.NumberOfCopies === 0){
        alert('Copies of this book not available')
    }else{
        setBookId(book.id);
    }
    
    //console.log(memberId, book);
    
  };

  const handleSave = async(book) => {
    
   const response =  await axios.post('http://localhost:3000/v1/circulation', {"eventtype" : "checkout", "book_id": Number(book.BookID), "member_id": Number (memberId), 'date' : new Date().toISOString().split('T')[0] })
    getAllBooks()
    if(response.data === "Invalid member"){
        alert('Invalid member')
    }
    setBookId("")
  }
  const handleReturnSave = async(book) => {
   
   const response =  await axios.post('http://localhost:3000/v1/circulation', {"eventtype" : "return", "book_id": Number(book.BookID), "member_id": Number (memberId), 'date' : new Date().toISOString().split('T')[0] })
    getAllBooks()
    if(response.data === "Invalid member"){
        alert('Invalid member')
    }
    setBookId("")
  }

  const handleReturn = async(book) => {
    setBookId(book.id);
  };
  return (
    <>
      <table>
        <tr>
          <th>Book Name</th>
          <th>No of copies</th>
          <th>Action</th>
        </tr>
        {bookData.map((book) => (
          <tr>
            <td>{book.BookName}</td>
            <td>{book.NumberOfCopies}</td>
            <td>
              {book.id === bookId && (
                <form>
                  <input
                    type="number"
                    name="memberId"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                  ></input>
                </form>
              )}
              <button onClick={() => {book.id !== bookId ? handleCheckout(book) : handleSave(book)}}>{book.id === bookId ? 'Submit' : 'Checkout'}</button>
              <button  onClick={() => {book.id !== bookId ? handleReturn(book) : handleReturnSave(book)}}>Return</button>
            </td>
          </tr>
        ))}
      </table>
    </>
  );
};

export default BookList;
