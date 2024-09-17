import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './Header/Navbar';
import Main from './Main/Main';
import AddItems from './Admin/AddItem';
import AdminOrder from './Admin/AdminOrder';
import UserOrder from './Main/UserOrder';

function App() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Main} />
        <Route
          exact
          path="/add-items"
          render={() => (isAdmin ? <AddItems /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/admin-order"
          render={() => (isAdmin ? <AdminOrder /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/order"
          render={() => (!isAdmin ? <UserOrder /> : <Redirect to="/order" />)}
        />
      </Switch>
    </Router>
  );
}

export default App;
