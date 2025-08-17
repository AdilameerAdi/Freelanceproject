import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { eventService, staffService } from "./services/supabase";

import Navbar from "./design/NAvbar";

import BlogsectionMain from "./design/news/BlogsectionMain";
import StaffMain from "./design/staff/StaffMain";
import Homemain from "./design/home/Homemain";
import SupportMain from "./design/Support/SupportMain";
import InformationMain from "./design/Information/InformationMain";
import Mainupdates from "./design/updates/Mainupdates";
import EvenMain from "./design/even/EvenMain";
import Mainfaqs from "./design/faqs/Mainfaqs";
import MainRev from "./design/Review/MainRev";
import AdminMain from "./design/Admin/AdminMain";
import AdminDashboard from "./design/Adminpannel/AdminDashboard";
import StaffPanelMain from "./design/staff/StaffPanelMain";

// Wrapper to conditionally show Navbar
function Layout({ children }) {
  const location = useLocation();
  // Hide Navbar on admin dashboard and staff panel
  const hideNavbarPaths = ["/admin-dashboard", "/staff-panel"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  // 🔹 Shared staff state for both admin and staff pages
  const [staffMembers, setStaffMembers] = useState([]);

  // 🔹 Shared events state for admin management and user display
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events and staff from database on component mount
  useEffect(() => {
    loadEvents();
    loadStaff();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const data = await staffService.getAllStaff();
      setStaffMembers(data);
    } catch (error) {
      console.error('Failed to load staff:', error);
    }
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/admin" element={<AdminMain />} />
          <Route path="/" element={<Homemain events={events} />} />
          <Route path="/blog" element={<BlogsectionMain />} />
          
          {/* Staff page gets staffMembers only */}
          <Route path="/staff" element={<StaffMain members={staffMembers} />} />

          <Route path="/events" element={<EvenMain events={events} />} />
          <Route path="/support" element={<SupportMain />} />
          <Route path="/updates" element={<Mainupdates />} />
          <Route path="/info" element={<InformationMain />} />
          <Route path="/faqs" element={<Mainfaqs />} />
          <Route path="/reviews" element={<MainRev />} />

          {/* Admin dashboard manages staffMembers and events */}
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard 
              staffMembers={staffMembers} 
              setStaffMembers={setStaffMembers}
              events={events}
              setEvents={setEvents}
              loadEvents={loadEvents}
              loadStaff={loadStaff}
            />}
          />

          {/* Staff panel for staff login */}
          <Route path="/staff-panel" element={<StaffPanelMain />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
