import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard.tsx";

/*
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
*/
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
