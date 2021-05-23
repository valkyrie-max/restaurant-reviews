import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import AddReview from "./components/add-review";
import Restaurants from "./components/restaurants";
import RestaurantList from "./components/restaurants-list";
import Login from "./components/login";

function App() {
  const [user, setUser] = React.useState(null)

  // DUMMY LOGIN SYSTEM
  // login function
  async function login(user = null) {
    setUser(user)
  } 
  // logout function 
  async function logout() {
    setUser(null)
  }

  return (
    <div className="App">

      {/* NAV BAR SECTION */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Restaurant Reviews</a>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link to={"/restaurants"} className="nav-link">Restaurants</Link>
            </li>
            <li className="nav-item">
              { user ? (
                <a onClick={logout} className="nav-link" href="#" style={{cursor: 'pointer'}}>Logout {user.name}</a>
              ) : (
                <Link to={"/login"} className="nav-link">Login</Link>
              )}
            </li>
          </ul>
        </div>

      </nav>

      {/* ROUTE SECTION */}
        <div className="container mt-3">
          {/* just the list */}
          <Route exact path={"/", "/restaurants"} component={RestaurantList}/>

          <Route 
            exact path={"/restaurants/:id/review"} 
            // render because it allows to pass props to the lading component
            render={(props) => (
              <AddReview {...props} user={user}/>)
            }
          />

          <Route 
            exact path={"/restaurants/:id"} 
            render={(props) => (
              <Restaurants {...props} user={user}/>)
            }
          />

          <Route 
            exact path={"/login"} 
            render={(props) => (
              <Login {...props} login={login}/>)
            }
          />
        </div>
    </div>
  );
}

export default App;
