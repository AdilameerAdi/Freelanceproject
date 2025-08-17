import Footer from "../Footer"
import Home from "./home"
import EventSlider from "./ev"
import Img from "./img"
export default function Homemain({ events }){
    return<>
    <Img></Img>
    <EventSlider events={events}></EventSlider>
    <Home></Home>
    <Footer></Footer>
    </>
}