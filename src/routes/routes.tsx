import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "../pages/home/home";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="localizaenfpics" element={<Home />} />
      </Routes>
    </Router>
  );
}
