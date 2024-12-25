import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import VolunteerNeeds from './VolunteerNeeds';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHandsHelping, FaUsers, FaHandHoldingHeart } from 'react-icons/fa';

const Home = () => {
    const parallaxRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: parallaxRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear',
        appendDots: dots => (
            <div style={{ position: 'absolute', bottom: '20px' }}>
                <ul className="m-0">{dots}</ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-3 h-3 mx-1 bg-white/50 rounded-full hover:bg-white/80 transition-all duration-300" />
        )
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
        <div className="min-h-screen overflow-x-hidden">
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
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
                            </div>
                            <div className="relative h-full flex items-center">
                                <div className="container mx-auto px-4">
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8 }}
                                        className="max-w-3xl"
                                    >
                                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                            {slide.title}
                                        </h1>
                                        <p className="text-xl text-white/90 mb-8 leading-relaxed">
                                            {slide.description}
                                        </p>
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 shadow-lg"
                                        >
                                            {slide.cta}
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            <section className="py-16">
                <VolunteerNeeds />
            </section>

            {/* Parallax Impact Section */}
            <motion.section 
                ref={parallaxRef}
                style={{ y }}
                className="py-20 bg-teal-600 text-white relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/impact-bg.jpg')] bg-cover bg-center opacity-20" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { count: "1000+", label: "Volunteers Active", delay: 0 },
                            { count: "500+", label: "Projects Completed", delay: 0.1 },
                            { count: "50+", label: "Partner Organizations", delay: 0.2 },
                            { count: "10K+", label: "Lives Impacted", delay: 0.3 }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                whileInView={{ scale: [0.9, 1.1, 1], opacity: [0, 1] }}
                                transition={{ duration: 0.5, delay: stat.delay }}
                                viewport={{ once: true }}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform duration-300"
                            >
                                <h3 className="text-4xl font-bold mb-2">{stat.count}</h3>
                                <p className="text-white/90">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Success Stories Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="text-4xl font-bold text-center text-gray-800 mb-12"
                    >
                        Success Stories
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Community Garden Project",
                                description: "Transformed an abandoned lot into a thriving community garden.",
                                image: "garden-project.jpg",
                                icon: <FaHandsHelping className="text-4xl text-orange-500" />
                            },
                            {
                                title: "Youth Mentorship Program",
                                description: "Connected 100+ youth with professional mentors.",
                                image: "mentorship.jpg",
                                icon: <FaUsers className="text-4xl text-orange-500" />
                            },
                            {
                                title: "Elder Care Initiative",
                                description: "Provided companionship to 200+ elderly community members.",
                                image: "elder-care.jpg",
                                icon: <FaHandHoldingHeart className="text-4xl text-orange-500" />
                            }
                        ].map((story, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="mb-4">{story.icon}</div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                        {story.title}
                                    </h3>
                                    <p className="text-gray-600">{story.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section with Parallax */}
            <motion.section 
                className="relative py-24 bg-fixed bg-cover bg-center"
                style={{
                    backgroundImage: "url('/cta-bg.jpg')"
                }}
            >
                <div className="absolute inset-0 bg-black/60" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Ready to Make a Difference?
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl mb-8"
                        >
                            Join our community of volunteers and start making an impact today.
                        </motion.p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 shadow-lg"
                        >
                            Get Started Now
                        </motion.button>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;