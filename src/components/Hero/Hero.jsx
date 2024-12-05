import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFingerprint, FaUserGraduate, FaLock, FaChartLine, FaBook, FaBuilding, FaChalkboardTeacher, FaIdCard, FaChartPie, FaFileAlt, FaMobileAlt, FaSearch, FaShieldAlt, FaCheckCircle, FaBolt } from 'react-icons/fa';

const TypewriterText = () => {
    const words = [
        "access control",
        "attendance tracking",
        "library management",
        "student records",
        "faculty management",
        "department control",
        "biometric security",
        "card management",
        "device tracking"
    ];

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const typingSpeed = 100;
        const deletingSpeed = 100;
        const wordPause = 1000;

        const handleTyping = () => {
            const currentWord = words[currentWordIndex];

            if (!isDeleting) {
                if (currentText !== currentWord) {
                    setCurrentText(currentWord.substring(0, currentText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), wordPause);
                    return;
                }
            } else {
                if (currentText === "") {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                    return;
                }
                setCurrentText(currentWord.substring(0, currentText.length - 1));
            }
        };

        const timer = setTimeout(
            handleTyping,
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timer);
    }, [currentText, currentWordIndex, isDeleting]);

    return (
        <span className="text-blue-600 inline-block min-w-[300px]">
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

// Scroll reveal component
const ScrollReveal = ({ children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${
                isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
            } ${className}`}
        >
            {children}
        </div>
    );
};

// Feature Card Component
const FeatureCard = ({ feature, index }) => (
    <ScrollReveal className="h-full" style={{ transitionDelay: `${index * 100}ms` }}>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
        </div>
    </ScrollReveal>
);

// Benefit Card Component
const BenefitCard = ({ benefit, index }) => (
    <ScrollReveal className="h-full" style={{ transitionDelay: `${index * 150}ms` }}>
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center h-full">
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
        </div>
    </ScrollReveal>
);

// Stats Card Component
const StatsCard = ({ stat, index }) => (
    <ScrollReveal style={{ transitionDelay: `${index * 200}ms` }}>
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
        </div>
    </ScrollReveal>
);

function Hero() {
    const navigate = useNavigate();

    const features = [
        {
            title: "Biometric Security",
            icon: <FaFingerprint className="text-pink-500" />,
            desc: "Advanced fingerprint verification integrated with NFC for dual-layer security"
        },
        {
            title: "Student Management",
            icon: <FaUserGraduate className="text-green-500" />,
            desc: "Complete student lifecycle management with digital profiles and history"
        },
        {
            title: "Access Control",
            icon: <FaLock className="text-blue-500" />,
            desc: "NFC-based entry management with real-time tracking and alerts"
        },
        {
            title: "Attendance System",
            icon: <FaChartLine className="text-purple-500" />,
            desc: "Automated attendance tracking with customizable settings"
        },
        {
            title: "Library Management",
            icon: <FaBook className="text-yellow-500" />,
            desc: "Digital book loans and returns with NFC cards"
        },
        {
            title: "Department Control",
            icon: <FaBuilding className="text-red-500" />,
            desc: "Manage multiple departments and their access rights"
        },
        {
            title: "Faculty Management",
            icon: <FaChalkboardTeacher className="text-teal-500" />,
            desc: "Complete faculty profile and attendance tracking"
        },
        {
            title: "Card System",
            icon: <FaIdCard className="text-indigo-500" />,
            desc: "Issue and manage NFC cards with custom permissions"
        },
        {
            title: "Analytics Dashboard",
            icon: <FaChartPie className="text-orange-500" />,
            desc: "Real-time insights with customizable metrics and KPIs"
        },
        {
            title: "Advanced Reports",
            icon: <FaFileAlt className="text-cyan-500" />,
            desc: "Generate detailed reports for attendance, access, and performance"
        },
        {
            title: "Device Management",
            icon: <FaMobileAlt className="text-lime-500" />,
            desc: "Control and monitor NFC reader devices"
        },
        {
            title: "Biometric Enrollment",
            icon: <FaSearch className="text-rose-500" />,
            desc: "Easy fingerprint enrollment and verification process"
        }
    ];

    const benefits = [
        {
            title: "Enhanced Security",
            description: "Dual authentication with biometric verification and NFC cards",
            icon: "🛡️"
        },
        {
            title: "Real-time Monitoring",
            description: "Instant access logs, attendance tracking, and alerts",
            icon: "⚡"
        },
        {
            title: "Comprehensive Analytics",
            description: "Detailed insights with customizable reports and dashboards",
            icon: "📊"
        },
        {
            title: "Student Success",
            description: "Track and improve student attendance and engagement",
            icon: "🎓"
        }
    ];

    const analyticsFeatures = [
        {
            title: "Attendance Analytics",
            description: "Track patterns and trends in student and faculty attendance",
            icon: ""
        },
        {
            title: "Access Reports",
            description: "Monitor and analyze building access patterns",
            icon: "📋"
        },
        {
            title: "Performance Metrics",
            description: "Measure and track key performance indicators",
            icon: "📈"
        },
        {
            title: "Custom Reports",
            description: "Generate tailored reports for different stakeholders",
            icon: "📑"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-2xl font-bold text-blue-600">NFC Access</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Main Hero Content */}
                <ScrollReveal>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-24">
                        <div className="flex-1 mb-8 md:mb-0 md:pr-12">
                            <h1 className="text-5xl font-bold mb-4">
                                Streamline Your{' '}
                                <TypewriterText />
                            </h1>
                            <p className="text-gray-600 text-xl mb-8">
                                Transform your institution with our comprehensive NFC-based management system.
                                From access control to library management, we've got everything covered in one
                                powerful platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => navigate('/signup')}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Get Started
                                </button>
                                <button 
                                    className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                                >
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            {features.slice(0, 4).map((feature, index) => (
                                <FeatureCard key={index} feature={feature} index={index} />
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* All Features Section */}
                <div className="mb-24">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold text-center mb-12">Complete Feature Set</h2>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} index={index} />
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mb-24">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <BenefitCard key={index} benefit={benefit} index={index} />
                        ))}
                    </div>
                </div>

                {/* Analytics & Reporting Section */}
                <div className="mb-24">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold text-center mb-12">Analytics & Reporting</h2>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {analyticsFeatures.map((feature, index) => (
                            <ScrollReveal key={index} className="h-full" style={{ transitionDelay: `${index * 100}ms` }}>
                                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                                    <div className="text-3xl mb-2">{feature.icon}</div>
                                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Biometric Security Section */}
                <div className="mb-24">
                    <ScrollReveal>
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl py-16 px-8 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl">
                                <h2 className="text-3xl font-bold text-center mb-12">Advanced Biometric Security</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-center">
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-semibold mb-4 text-blue-800">
                                                <FaShieldAlt className="mr-3 text-blue-500" />
                                                Dual Authentication System
                                            </h3>
                                            <p className="text-gray-700">
                                                Enhance security with our advanced biometric verification system integrated with NFC technology.
                                                Ensure foolproof identification and access control.
                                            </p>
                                            <ul className="space-y-4">
                                                <li className="flex items-center bg-white/50 p-3 rounded-xl hover:bg-white/80 transition-all duration-300">
                                                    <FaFingerprint className="mr-3 text-pink-500 text-xl" />
                                                    <span className="text-gray-700">Fingerprint Recognition</span>
                                                </li>
                                                <li className="flex items-center bg-white/50 p-3 rounded-xl hover:bg-white/80 transition-all duration-300">
                                                    <FaIdCard className="mr-3 text-indigo-500 text-xl" />
                                                    <span className="text-gray-700">NFC Card Verification</span>
                                                </li>
                                                <li className="flex items-center bg-white/50 p-3 rounded-xl hover:bg-white/80 transition-all duration-300">
                                                    <FaBolt className="mr-3 text-yellow-500 text-xl" />
                                                    <span className="text-gray-700">Real-time Authentication</span>
                                                </li>
                                            </ul>
                                            <button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl group">
                                                
                                                Learn More
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center relative">
                                        <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
                                        <div className="w-64 h-64 bg-white rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-500 relative z-10">
                                            <FaFingerprint className="text-6xl text-pink-500 animate-pulse" />
                                        </div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
                                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { value: "99.9%", label: "System Uptime" },
                        { value: "50+", label: "Institutions" },
                        { value: "24/7", label: "Technical Support" },
                        { value: "100%", label: "Data Security" }
                    ].map((stat, index) => (
                        <StatsCard key={index} stat={stat} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Hero;