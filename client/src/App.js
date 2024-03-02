import "./globals.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from "./pages/dashboard/home/Home";
import Search from "./pages/dashboard/search/Search";
import UserConext from "./contexts/User";
import Anime from "./pages/dashboard/anime/Anime";
import List from "./pages/dashboard/list/List";
import ListItem from "./pages/dashboard/list/listItem/ListItem";

function App() {

  const userId = localStorage.getItem("userId")
  const username = localStorage.getItem("username")
  const email = localStorage.getItem("email")
  const profilePic = localStorage.getItem("profilePic")

  const setUserId = (value) => {
    localStorage.setItem("userId", value)
  }

  const setUsername = (value) => {
    localStorage.setItem("username", value)
  }

  const setEmail = (value) => {
    localStorage.setItem("email", value)
  }

  const setProfilePic = (value) => {
    localStorage.setItem("profilePic", value)
  }

  return (
    <>
      <UserConext.Provider value={{ userId, username, email, profilePic, setUserId, setUsername, setEmail, setProfilePic }}>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="/dashboard" index element={<Home />} />
            <Route path="/dashboard/searchAnime" element={<Search />} />
            <Route path="/dashboard/searchManga" element={<Search />} />
            <Route path="/dashboard/anime/:id" element={<Anime />} />
            <Route path="/dashboard/manga/:id" element={<Anime />} />
            <Route path="/dashboard/list" element={<List />} />
            <Route path="/dashboard/list/:id" element={<ListItem />} />
            <Route path="/dashboard/settings" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      </UserConext.Provider>
    </>
  );
}

export default App;
