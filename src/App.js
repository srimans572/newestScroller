import Navbar from "./components/Navbar";
import Scroller from "./components/Scroller";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AffiliatePage from "./pages/Affiliate";
import SavedQuestions from "./components/Saved";
import Explore from "./pages/Explore";
import CareersPage from "./pages/CareerPage";
import { Elements } from "@stripe/react-stripe-js";
import Scrolls from "./pages/Scrolls";
import TermsAndConditions from "./pages/Terms";

function App() {
  return (
    <div className="App" style={{ overflowY: "hidden" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/affiliate" element={<AffiliatePage />} />
        <Route path="/saved" element={<SavedQuestions />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/scrolls" element={<Scrolls />} />
        <Route path="/terms" element={<TermsAndConditions />} />
      </Routes>
    </div>
  );
}

export default App;
