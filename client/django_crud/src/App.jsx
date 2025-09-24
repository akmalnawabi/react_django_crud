import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBook = async () => {
    const bookData = {
      title,
      release_date: releaseDate,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();
      setBooks((prev) => [...prev, data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateBook = async (pk, releaseDate) => {
    const bookData = {
      title: newTitle,
      release_date: releaseDate,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const data = await response.json();
        setBooks((prev) => prev.map((book) => (book.id === pk ? data : book)));
        setNewTitle('');
      } else {
        console.error("Failed to update book:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBook = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBooks((prev) => prev.filter((book) => book.id !== pk));
      }
      else {
        console.error("Failed to delete book:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Book Website</h1>
      <div className="add-book">
        <input
          type="text"
          placeholder="book name"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="release date"
          onChange={(e) => setReleaseDate(e.target.value)}
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>
      <div>
        {books.map((book) => {
          return (
            <div key={book.id}>
              <p>book title: {book.title}</p>
              <p>book release date: {book.release_date}</p>
              <input
                type="text"
                placeholder="update title"
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                onClick={() => handleUpdateBook(book.id, book.release_date)}
              >
                Change Title
              </button>
              <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
