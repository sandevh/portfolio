"use client";

import { useEffect, useState, useCallback } from "react";
import { Typewriter } from 'react-simple-typewriter';
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Projects from "./data/projects.json";
import GitHubIcon from "./icons/GitHubIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import LeetCodeIcon from "./icons/LeetCodeIcon";
import ScrollToTopIcon from "./icons/ScrollToTopIcon";
import BackgroundPattern from "./components/BackgroundPattern";
// Interfaces 
interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface NavLink {
  name: string;
  href: string;
}

interface Project {
  title: string;
  description: string;
  techStack: string;
  link: string;
}

export default function Portfolio() {
  // State Management
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const [isScrolling, setIsScrolling] = useState(false);

  // Scroll To Top Logic 
  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Active Section Detection on Scroll 
  const handleScroll = useCallback(() => {
    if (isScrolling) return;
    
    const sections = ["home", "about", "projects", "contact"];
    const scrollPosition = window.scrollY + 150;

    for (let i = 0; i < sections.length; i++) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        const bottom = top + section.clientHeight;
        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveLink(`#${sections[i]}`);
          break;
        }
      }
    }
  }, [isScrolling]);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [toggleVisibility, handleScroll]);

  // Data 
  const socialLinks: SocialLink[] = [
    { name: 'GitHub', url: 'https://github.com/sandevh', icon: <GitHubIcon /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/sandev-hettiarachchi-3637972b3/', icon: <LinkedinIcon /> },
    { name: 'LeetCode', url: 'https://leetcode.com/u/Y3HJQknF6q/', icon: <LeetCodeIcon /> },
  ];

  const navLinks: NavLink[] = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const projects: Project[] = (Projects?.projects as Project[]) || [];

  // Smooth Scroll to Section 
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsScrolling(true);
    
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Set active link immediately to prevent flicker
      setActiveLink(href);
      
      // Close mobile menu if open
      setMenuOpen(false);
      
      // Scroll to the element
      targetElement.scrollIntoView({ behavior: "smooth" });
      
      // Reset isScrolling after animation completes (typical smooth scroll takes ~1s)
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  // IntersectionObserver for Section Animations 
  const [homeRef, homeInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [aboutRef, aboutInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [projectsRef, projectsInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [contactRef, contactInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // Component for Navbar 
  const Navbar = () => {
    return (
      <nav>
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 dark:text-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover:cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`relative font-bold transition-colors duration-300 text-md group ${
                activeLink === link.href
                  ? "text-blue-600 dark:text-blue-600 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-1 after:h-1 after:bg-blue-600 dark:after:bg-blue-600 after:rounded-full"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-white dark:bg-black shadow-lg rounded-b-lg py-4 px-6 md:hidden z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`relative font-bold transition-colors duration-300 text-md group ${
                      activeLink === link.href
                        ? "text-blue-600 dark:text-blue-600 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  };

  // Content Section Component 
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100 relative">
      {children}
    </h2>
  );

  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen dark:bg-black text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300 dark:bg-black">
        <BackgroundPattern />
        <header className="sticky top-0 z-50 shadow-md bg-white/90 dark:bg-black/90 backdrop-blur-md transition-all duration-300">
          <div className="flex justify-between items-center py-4 px-4 md:px-8 max-w-7xl mx-auto">
            <a 
              href="#home"
              onClick={(e) => scrollToSection(e, "#home")}
              className="text-xl sm:text-2xl font-bold tracking-tight hover:scale-105 transition-transform duration-300"
            >
              <span className="text-gray-800 dark:text-blue-100">SAN</span>
              <span className="text-blue-600 dark:text-blue-500">DEV</span>
            </a>
            <Navbar />
          </div>
        </header>

        {/* Main Sections */}
        <main>
          {/* Hero Section */}
          <motion.section
            id="home"
            ref={homeRef}
            initial={{ opacity: 1 }}
            animate={homeInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 scroll-mt-20 dark:bg-black dark:text-white gap-8 lg:gap-12"
          >
            <motion.div 
              className="max-w-4xl w-full mx-auto z-1"
              initial={{ y: 30, opacity: 0 }} 
              animate={homeInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }} 
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center lg:text-left leading-tight">
                Hi, I&apos;m{' '}
                <span className="block text-blue-600 dark:text-blue-400 text-5xl sm:text-6xl md:text-7xl mt-3">
                  Sandev Hettiarachchi
                </span>
              </h1>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-center lg:text-left">
                <span className="text-blue-600 dark:text-blue-400">
                  <Typewriter
                    words={['Full Stack Developer', 'Software Developer', 'Mobile Developer[React Native]']}
                    loop={0}
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                I&apos;m a passionate Software Developer and Full Stack Developer with experience in building scalable, responsive web apps and software solutions. I love clean interfaces, performance optimization, and solving real-world problems through code.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/SandevHettiarachchi.pdf"
                  download
                  className="bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center w-full sm:w-auto"
                >
                  Download CV
                </a>
                <a
                  href="#projects"
                  onClick={(e) => scrollToSection(e, "#projects")}
                  className="border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center w-full sm:w-auto"
                >
                  View Projects
                </a>
              </div>
            </motion.div>
          </motion.section>

          {/* About Section */}
          <motion.section
            id="about"
            ref={aboutRef}
            initial={{ opacity: 0 }}
            animate={aboutInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 scroll-mt-20 dark:bg-black dark:text-white"
          >
            <div className="max-w-5xl w-full relative z-10">
              <SectionTitle>About Me</SectionTitle>

              <motion.p
                className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={aboutInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                I&apos;m a second-year Computer Science student at the Informatics Institute of Technology, affiliated with the University of Westminster, passionate about building innovative solutions and exploring new technologies.
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Education Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={aboutInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-md border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-blue-300/40 dark:hover:border-blue-500/40 hover:shadow-blue-200/20 dark:hover:shadow-blue-400/10 flex flex-col h-full"
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Current Education</h3>
                  <div className="h-px bg-gradient-to-r from-blue-300/30 via-gray-300/50 to-transparent dark:from-blue-500/30 dark:via-gray-700/50 dark:to-transparent my-3"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">2024 - Present</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Informatics Institute of Technology (University of Westminster)<br />
                    BSc (Hons) Computer Science
                  </p>
                </motion.div>

                {/* Previous Education Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={aboutInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-md border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-blue-300/40 dark:hover:border-blue-500/40 hover:shadow-blue-200/20 dark:hover:shadow-blue-400/10 flex flex-col h-full"
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Previous Education</h3>
                  <div className="h-px bg-gradient-to-r from-blue-300/30 via-gray-300/50 to-transparent dark:from-blue-500/30 dark:via-gray-700/50 dark:to-transparent my-3"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">2009 - 2023</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Mahanama College, Colombo 3<br />
                    GCE A/L Physical Science: 3C Passes<br />
                    GCE O/L: 8A, 1B Passes
                  </p>
                </motion.div>

                {/* Skills & Tools Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={aboutInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-md border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-blue-300/40 dark:hover:border-blue-500/40 hover:shadow-blue-200/20 dark:hover:shadow-blue-400/10 flex flex-col h-full"
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Skills & Tools</h3>
                  <div className="h-px bg-gradient-to-r from-blue-300/30 via-gray-300/50 to-transparent dark:from-blue-500/30 dark:via-gray-700/50 dark:to-transparent my-3"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      'Java',
                      'Python',
                      'JavaScript',
                      'TypeScript',
                      'React',
                      'Next.js',
                      'Node.js',
                      'Express.js',
                      'React Native',
                      'Spring Boot',
                      'Git',
                      'Figma',
                      'Postman',
                      'MySQL',
                      'MongoDB'
                    ].map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-blue-700 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full transition-all duration-300 hover:bg-blue-200 hover:text-blue-900 hover:scale-105 cursor-default dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Projects Section */}
          <motion.section
            id="projects"
            ref={projectsRef}
            initial={{ opacity: 0 }}
            animate={projectsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 scroll-mt-20 dark:bg-black dark:text-white"
          >
            
            <div className="max-w-5xl w-full relative z-10">
              <SectionTitle>Projects</SectionTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={projectsInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                    className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-md border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-blue-300/40 dark:hover:border-blue-500/40 hover:shadow-blue-200/20 dark:hover:shadow-blue-400/10 flex flex-col justify-between h-full group"
                  >
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {project.title}
                      </h3>

                      <div className="h-px bg-gradient-to-r from-blue-300/30 via-gray-300/50 to-transparent dark:from-blue-500/30 dark:via-gray-700/50 dark:to-transparent my-3 group-hover:from-blue-400/50 dark:group-hover:from-blue-400/50 transition-all duration-300"></div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.split(", ").map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-gray-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full transition-all duration-300 hover:bg-blue-200 hover:text-blue-900 hover:scale-105 cursor-default dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-black transition-all duration-300 w-full group-hover:shadow-md"
                    >
                      View Project
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section
            id="contact"
            ref={contactRef}
            initial={{ opacity: 0 }}
            animate={contactInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 scroll-mt-20 dark:bg-black dark:text-white"
          >
            
            <div className="text-center max-w-2xl w-full relative z-10">
              <SectionTitle>Let&apos;s Connect</SectionTitle>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={contactInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 dark:text-gray-100 mb-8"
              >
                I&apos;m open to work and collaboration. Feel free to reach out via email, phone, or drop me a message below.
              </motion.p>

              {/* Contact details */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={contactInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8 space-y-2"
              >
                <p className="text-base md:text-lg text-gray-800 dark:text-gray-200">
                  email:{" "}
                  <a href="mailto:sandevhettiarachchi@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                    sandevhettiarachchi@gmail.com
                  </a>
                </p>
                <p className="text-base md:text-lg text-gray-800 dark:text-gray-200">
                  mobile: 0717739972
                </p>
              </motion.div>

              {/* Message form */}
              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={contactInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                action={`mailto:sandevhettiarachchi@gmail.com`}
                method="POST"
                encType="text/plain"
                className="space-y-4"
              >
                <textarea
                  name="message"
                  placeholder="Type your message..."
                  className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm"
                  required
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-300 hover:cursor-pointer hover:shadow-[0_0_12px_2px_rgba(59,130,246,0.7)] hover:shadow-"
                >
                  Send Message
                </button>
              </motion.form>
              
              {/* Social links */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={contactInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12 flex justify-center gap-4"
              >
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/70 dark:bg-gray-800/70 rounded-full hover:scale-110 hover:bg-blue-500 hover:text-white dark:hover:text-white hover:shadow-[0_0_6px_2px_rgba(59,130,246,0.7)] hover:shadow-blue-500/50 transition-all duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="mt-12 md:mt-24 py-8 md:py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-md border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 md:p-8 shadow-lg transition-all duration-300 hover:border-blue-300/20 dark:hover:border-blue-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Quick Links */}
                <div className="text-center md:text-left">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Quick Links
                  </h3>
                  <ul className="space-y-2">
                    {navLinks.map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.href} 
                          className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-300 group flex items-center"
                        >
                          <span className="w-0 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Social Links */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Follow Me
                  </h3>

                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 md:p-3 bg-white/20 dark:bg-gray-800/30 rounded-full hover:scale-110 hover:bg-blue-500 hover:text-white dark:hover:text-white hover:shadow-[0_0_6px_2px_rgba(59,130,246,0.7)] hover:shadow-blue-500/50 transition-all duration-300"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Name and Copyright */}
                <div className="text-center md:text-right">
                  <h3 className="text-lg md:text-xl font-bold mb-2 hover:scale-105 transition-transform duration-300">
                    <span className="text-gray-800 dark:text-gray-100">SAN</span>
                    <span className="text-blue-600 dark:text-blue-400">DEV</span>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    © {new Date().getFullYear()} Sandev Hettiarachchi. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 0.8 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 hover:shadow-[0_0_12px_2px_rgba(59,130,246,0.7)] hover:shadow-blue-500/50 transition-all duration-300 hover:cursor-pointer z-50"
            aria-label="Scroll to top"
          >
            <ScrollToTopIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}