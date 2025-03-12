import { useState } from "react";
import Header from "./Components/Header";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Content from "./Components/Content";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManageSubscription from "./Components/ManageSubscription";
// import ViewSuscription from "./Components/ViewSuscription";
import UserProvider  from './Components/UserContext';
import Contact from "./Components/Contact";
function App() {
  const [count, setCount] = useState(0);

  return (
    <UserProvider>
      <BrowserRouter>
        {/* Header stays consistent across all routes */}
        <Header />

        {/* Only the content below the header changes */}
        <main>
          <Routes>
            <Route path="/" element={<Content />} />
            <Route
              path="/manage-subscriptions"
              element={<ManageSubscription />}
            >
              {/* <Route path="view" element={<ViewSuscription />} /> */}
            </Route>
            {/* Other routes */}
          </Routes>
        </main>
        <Contact />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
