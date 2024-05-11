import { UserContext } from 'UserContext';
import { API_DOMAIN, API_PORT } from 'config';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function Header() {
  const baseURL = `${API_DOMAIN}:${API_PORT}`;
  const path = '/profile';
  const pathLogout = '/logout';
  const URLToAPI = new URL(path, baseURL);
  const URLToAPILogout = new URL(pathLogout, baseURL);
  // user information provided by a parent component
  const { setUserInfo, userInfo } = useContext(UserContext);
  // set a side effect when rendering the component
  useEffect(() => {
    // instace of abort controller
    const controller = new AbortController();
    // function for fetching data from API
    const fetchData = async () => {
      try {
        // make the request to the API and save the response
        const response = await fetch(URLToAPI, {
          credentials: 'include',
          signal: controller.signal,
        });
        // json-ize the response
        const json = await response.json();
        console.log('the response from /profile is');
        console.log(json);
        // Don't just set the username; set the ENTIRE object
        setUserInfo(json);
      } catch (err) {}
    };
    // run the function that makes the request to the API and
    // changes the userInfo state
    fetchData();

    // return the cleanup function
    return () => {
      controller.abort();
    };
  }, []); // empty dependency array means effect runs only once

  // What the logout function will do is to invalidate the cookie.
  function logout() {
    fetch(URLToAPILogout, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  // since userInfo might be empty (because of server response),
  // we safely access the username
  const username = userInfo?.username;
  console.log('the username is...');
  console.log(username);

  return (
    <header>
      <Link to="/" className="logo">
        Pocho Blogs
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
