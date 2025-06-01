      import React from "react";
      import { assets } from "@/assets/assets";
      import Image from "next/image";

      const Footer = () => {
        return (
          <footer className="bg-gradient-to-br from-slate-50 to-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-12 py-12 lg:py-16">

                {/* Logo & Description */}
                <div className="md:col-span-2 lg:col-span-5">
                  <div className="mb-6">
                    <Image 
                      className="w-32 md:w-36 lg:w-40 hover:scale-105 transition-transform duration-300" 
                      src={assets.logo} 
                      alt="Abronía Lizards Logo" 
                    />
                  </div>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                    Abronia Lizards is your one-stop resource and shop for all things related to
                    the fascinating world of <em className="text-emerald-600 font-medium">Abronía</em> species — from care guides and species
                    profiles to ethically sourced gear and supplies.
                  </p>

                  {/* Social Media Icons Placeholder */}
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <span className="text-white text-xs font-bold">t</span>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                  </div>
                </div>

                {/* Explore Links */}
                <div className="lg:col-span-3">
                  <h3 className="font-semibold text-gray-900 text-lg mb-6 relative">
                    Explore
                    <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"></span>
                  </h3>
                  <nav>
                    <ul className="space-y-3">
                      {[
                        { name: "Home", href: "/" },
                        { name: "Species Info", href: "/abronia-species-info" },
                        { name: "Care Guides", href: "/abronia-care-sheet" },
                        { name: "Shop", href: "/shop" },
                        { name: "Shipping & Returns", href: "/shipping-and-returns" },
                        { name: "Contact Us", href: "#" }
                      ].map((link) => (
                        <li key={link.name}>
                          <a 
                            className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 text-sm md:text-base hover:translate-x-1 transform inline-block" 
                            href={link.href}
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Contact Info */}
                <div className="lg:col-span-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-6 relative">
                    Get in Touch
                    <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"></span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 text-xs">📞</span>
                      </div>
                      <span className="text-gray-600 text-sm md:text-base">+1 (800) 555-ABRO</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 text-xs">✉️</span>
                      </div>
                      <a 
                        href="mailto:support@abronializards.com" 
                        className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 text-sm md:text-base"
                      >
                        support@abronializards.com
                      </a>
                    </div>
                    <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-600 italic">
                        🦎 Follow us on social media for the latest updates on Abronía species and care tips!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="border-t border-gray-200 py-8">
                <div className="text-center max-w-md mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">Stay Updated</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get the latest care guides and species updates delivered to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                    <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="bg-gray-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
                  <p>
                    © {new Date().getFullYear()} Abronía Lizards. All rights reserved.
                  </p>
                  <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a href="#" className="hover:text-emerald-400 transition-colors duration-300">Privacy Policy</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors duration-300">Terms of Service</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors duration-300">Cookies</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        );
      };

      export default Footer;