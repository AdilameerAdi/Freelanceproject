import Footer from "../Footer"
import Home from "./home"
import EventSlider from "./ev"
export default function Homemain({ events }){
    return<>
    <EventSlider events={events}></EventSlider>
    <Home></Home>
    <Footer></Footer>
    </>
}