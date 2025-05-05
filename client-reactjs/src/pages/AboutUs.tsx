import SectionDelivery from "../components/SectionDelivery";
import SectionTeam from "../components/SectionTeam";
import SectionTopAboutUs from "../components/SectionTopAboutUs";
import SectionTrustedAboutUs from "../components/SectionTrustedAboutUs";

const AboutUs = () => {

    return (
        <main className="main">
            <SectionTopAboutUs />
            <SectionTrustedAboutUs/>
            <SectionDelivery/>
            <SectionTeam/>
        </main>
    )

}

export default AboutUs;