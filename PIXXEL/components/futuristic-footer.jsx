"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Send,
  Mail,
  MessageCircle,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Zap,
  Heart,
  Star,
  Code,
  Sparkles,
} from "lucide-react";

const FuturisticFooter = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const footerRef = useRef(null);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setFeedback("");
    }, 3000);
  };

  const socialLinks = [
    {
      icon: Twitter,
      label: "Twitter",
      color: "from-blue-400 to-blue-600",
      href: "#",
    },
    {
      icon: Github,
      label: "GitHub",
      color: "from-gray-400 to-gray-600",
      href: "#",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      color: "from-blue-500 to-blue-700",
      href: "#",
    },
    {
      icon: Instagram,
      label: "Instagram",
      color: "from-pink-400 to-purple-600",
      href: "#",
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-transparent text-white overflow-hidden"
      id="contact"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Let's Connect
            </span>
          </h2>

          <p className="text-[18px] text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ready to create something extraordinary? Drop me a message, share
            your feedback, or just say hi! I'd love to hear from you. 🚀
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-10">
          {/* Contact Form */}
          <div className="relative">
            <div
              className="backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30 relative overflow-hidden group"
              style={{
                transform: `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 3}deg) rotateY(${(mousePosition.x - 0.5) * 3}deg)`,
                boxShadow: "0 25px 50px rgba(34, 211, 238, 0.1)",
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <MessageCircle className="h-8 w-8 text-cyan-400 mr-3 animate-bounce" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Send Message
                  </h3>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 bg-black/50 border-cyan-400/50 text-white placeholder-gray-400 rounded-xl h-12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Feedback Textarea */}
                    <div className="relative group">
                      <Textarea
                        placeholder="Share your thoughts, feedback, or just say hello! ✨"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="bg-black/50 border-cyan-400/50 text-white placeholder-gray-400 rounded-xl min-h-32 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 relative overflow-hidden group"
                      style={{
                        boxShadow: "0 10px 30px rgba(34, 211, 238, 0.3)",
                      }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                          Sending Magic...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="h-5 w-5 mr-3" />
                          Launch Message
                        </div>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h4 className="text-2xl font-bold text-green-400 mb-2">
                      Message Sent!
                    </h4>
                    <p className="text-gray-300">
                      Thank you for reaching out. I'll get back to you soon!
                    </p>
                    <div className="flex justify-center mt-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 text-yellow-400 animate-pulse mx-1"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info & Social Section */}
          <div className="space-y-8">
            {/* Quick Contact Info */}
            <div className="backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 relative overflow-hidden group hover:border-purple-400/60 transition-all duration-300">
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <Zap className="h-8 w-8 text-purple-400 mr-3 animate-bounce" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Quick Connect
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-purple-400 mr-4" />
                    <span className="text-gray-300">
                      mohantyrakesh802@gmail.com
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-purple-400 mr-4" />
                    <span className="text-gray-300">
                      Let's chat about your next project
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Code className="h-5 w-5 text-purple-400 mr-4" />
                    <span className="text-gray-300">
                      Available for freelance work
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="backdrop-blur-xl rounded-3xl p-8 border border-pink-400/30 relative overflow-hidden">
              <div className="flex items-center mb-6">
                <Sparkles className="h-8 w-8 text-pink-400 mr-3 animate-bounce" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-500 bg-clip-text text-transparent">
                  Follow the Journey
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="group relative overflow-hidden rounded-xl bg-black/50 p-4 hover:bg-black/70 transition-all duration-300 border border-gray-700 hover:border-transparent"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />
                    <div className="relative z-10 flex items-center">
                      <social.icon className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
                      <span className="ml-3 text-gray-400 group-hover:text-white transition-colors duration-300 font-medium">
                        {social.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-12 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 flex items-center">
              Made with
              <Heart className="h-4 w-4 text-red-500 mx-2 animate-bounce" />
              by Rakesh Kumar Mohanty
              <span className="ml-2 text-xs bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold">
                © 2025
              </span>
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-cyan-400">
                Privacy
              </a>
              <a href="#" className="hover:text-cyan-400">
                Terms
              </a>
              <a href="#" className="hover:text-cyan-400">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FuturisticFooter;
