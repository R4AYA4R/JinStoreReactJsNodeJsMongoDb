import SectionBestSellers from "../components/SectionBestSellers";
import SectionCategoryItems from "../components/SectionCategoryItems";
import SectionDontMiss from "../components/SectionDontMiss";
import SectionNewArrivals from "../components/SectionNewArrivals";
import SectionPromo from "../components/SectionPromo";
import SectionTop from "../components/SectionTop";

const HomePage = () => {

    return (
        <main className="main">
            <SectionTop />
            <SectionCategoryItems />
            <div className="sectionOuterGradient">
                <SectionNewArrivals />
                <SectionDontMiss />
                <SectionBestSellers />
                <SectionPromo />
            </div>
        </main>
    )

}

export default HomePage;