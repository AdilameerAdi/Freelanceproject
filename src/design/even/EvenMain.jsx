import Events from "./events"
import Footer from "../Footer"
import TextEventSlider from "../home/ev";
export default function EvenMain({ events }) {
return<>
<TextEventSlider events={events}></TextEventSlider>
<Events events={events}></Events>
<Footer></Footer>
</>
}