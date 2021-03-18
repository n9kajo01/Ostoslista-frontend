import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState([]);
  const [warning, setWarning] = useState("")

  const URL = "http://localhost/shoppinglist/";

  
  useEffect(() => {
    let status = 0;
    fetch(URL + "index.php")
      .then((response) => {
        status = parseInt(response.status);
        return response.json();
      })
      .then(
        (response) => {
          if (status === 200) {
            setItems(response);
          } else {
            alert(response.error);
          }
        },
        (error) => {
          alert(error);
        }
      );
  },[]);
  



  function save(e) {
    e.preventDefault();
    if(description === ""){
      alert("Enter item description");
      return;
    }
    if(amount === ""){
      alert("Enter item amount");
      return;
    }
    if(amount <= 0){
      alert("Amount can't be 0 or negative")
      return;
    }
    let status = 0;
    fetch(URL + "add.php", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        description: description,
        amount: amount
      })
    })
    .then(response => {
      status = parseInt(response.status);
      return response.json();
    })
      .then(
        (response) => {
          if (status === 200) {
            setItems(items => [items, response]);
            setDescription("");
            setAmount("");
          } else {
            alert(response.error);
          }
        }, 
        (error) => {
          alert(error);
        }
      ) 
  }
  

  function remove(id) {
    let status = 0;
    fetch(URL + "delete.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then((response) => {
        status = parseInt(response.status);
        return response.json();
      })
      .then(
        (response) => {
          if (status === 200) {
            const newListWithoutRemoved = items.filter((item) => item.id !== id
            );
            setItems(newListWithoutRemoved);
          } else {
            alert(response.error);
          }
        },
        (error) => {
          alert(error);
        }
      );
  }

  return (
    <div>
      <h3>Shopping list</h3>
      <form onSubmit={save}>
        <label>
          New Item
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
          ></input>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="amount"
          ></input>
          <button>Add</button>
        </label>
        <output>{warning}</output>
      </form>


      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.description}   {item.amount} <a onClick={() => remove(item.id)} href="#">
              Delete
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
