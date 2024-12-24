import { motion } from 'framer-motion';
import VolunteerNeeds from './VolunteerNeeds';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
    

    // Slider settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    const sliderData = [
        {
            title: "Make a Difference Today",
            description: "Join our community of volunteers and help create positive change in the world.",
            image: "https://i.ibb.co.com/bLNM80t/Youth-Volunteering-JK-Orthodontics.jpg",
            cta: "Get Started"
        },
        {
            title: "Support Local Communities",
            description: "Your time and skills can transform lives. Start volunteering now!",
            image: "https://i.ibb.co.com/jTkjw3f/The-Career-Benefits-of-Volunteering-During-Your-Job-Search-2.jpg",
            cta: "Join Us"
        },
        {
            title: "Together We Can Help",
            description: "Connect with causes that matter and make an impact in your community.",
            image: "https://i.ibb.co.com/QJmJfcn/25-Ways-to-Volunteer-in-Your-Community.jpg",
            cta: "Learn More"
        }
    ];

    
    return (
        <div className="min-h-screen">
            {/* Hero Slider Section */}
            <section className="relative h-[90vh]">
                <Slider {...sliderSettings} className="h-full">
                    {sliderData.map((slide, index) => (
                        <div key={index} className="relative h-[90vh]">
                            <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
                            </div>
                            <div className="relative h-full flex items-center">
                                <div className="container mx-auto px-4">
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8 }}
                                        className="max-w-3xl"
                                    >
                                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                                            {slide.title}
                                        </h1>
                                        <p className="text-xl text-white/90 mb-8">
                                            {slide.description}
                                        </p>
                                        <button className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                                            {slide.cta}
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

          <section>
          <VolunteerNeeds />
          </section>

            {/* Impact Statistics Section */}
            <section className="py-20 bg-teal-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <motion.div
                            whileInView={{ scale: [0.9, 1.1, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-4xl font-bold mb-2">1000+</h3>
                            <p>Volunteers Active</p>
                        </motion.div>
                        <motion.div
                            whileInView={{ scale: [0.9, 1.1, 1] }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h3 className="text-4xl font-bold mb-2">500+</h3>
                            <p>Projects Completed</p>
                        </motion.div>
                        <motion.div
                            whileInView={{ scale: [0.9, 1.1, 1] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className="text-4xl font-bold mb-2">50+</h3>
                            <p>Partner Organizations</p>
                        </motion.div>
                        <motion.div
                            whileInView={{ scale: [0.9, 1.1, 1] }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h3 className="text-4xl font-bold mb-2">10K+</h3>
                            <p>Lives Impacted</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="text-4xl font-bold text-center text-teal-600 mb-12"
                    >
                        How It Works
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="text-center p-6"
                        >
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Browse Opportunities</h3>
                            <p className="text-gray-600">
                                Explore various volunteering opportunities in your area and find the perfect match for your skills.
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="text-center p-6"
                        >
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Sign Up</h3>
                            <p className="text-gray-600">
                                Create your account and complete your volunteer profile with your interests and availability.
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="text-center p-6"
                        >
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Start Helping</h3>
                            <p className="text-gray-600">
                                Apply for opportunities and start making a difference in your community today.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;