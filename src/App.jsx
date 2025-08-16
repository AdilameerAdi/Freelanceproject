
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./design/NAvbar";
import AdminPage from "./design/Admin/Adminpage";
import BlogsectionMain from "./design/news/BlogsectionMain";
import StaffMain from "./design/staff/StaffMain";
import Homemain from "./design/home/Homemain";
import SupportMain from "./design/Support/SupportMain";
import InformationMain from "./design/Information/InformationMain";
import Mainupdates from "./design/updates/Mainupdates";
import EvenMain from "./design/even/EvenMain";
import Mainfaqs from "./design/faqs/Mainfaqs";
import MainRev from "./design/Review/MainRev";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Homemain/>} />
        <Route path="/blog" element={<BlogsectionMain />} />
         <Route path="/staff" element={<StaffMain />} />
          <Route path="/events" element={<EvenMain />} />
          <Route path="/support" element={<SupportMain />} />
          <Route path="/updates" element={<Mainupdates />} />
          <Route path="/info" element={<InformationMain />} />
          <Route path="/faqs" element={<Mainfaqs />} />
           <Route path="/reviews" element={<MainRev />} />
      </Routes>
    </Router>
  );
}

export default App;
