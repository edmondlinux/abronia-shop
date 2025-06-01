import React from "react";

const NewsLetter = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-emerald-50 py-16 md:py-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-200/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200/20 rounded-full blur-xl"></div>

      <div className="relative flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto px-6">
        {/* Heading with gradient text */}
        <div className="space-y-4">
          <h1 className="md:text-5xl text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Subscribe now & get 20% off
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto"></div>
        </div>

        {/* Enhanced description */}
        <p className="md:text-lg text-base text-gray-600 max-w-2xl leading-relaxed">
          Join our community of <span className="font-semibold text-emerald-600">Abronía</span> enthusiasts and get exclusive care tips, 
          species updates, and special offers delivered straight to your inbox.
        </p>

        {/* Enhanced input section */}
        <div className="w-full max-w-2xl mt-8">
          <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative flex-1">
              <input
                className="w-full h-14 md:h-16 px-6 text-gray-700 placeholder-gray-400 bg-transparent outline-none focus:ring-0 border-none"
                type="email"
                placeholder="Enter your email address"
              />
              <div className="absolute inset-0 border-2 border-transparent rounded-l-xl focus-within:border-emerald-300 transition-colors duration-300 pointer-events-none"></div>
            </div>

            <button className="relative group h-14 md:h-16 px-8 md:px-12 text-white font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Subscribe
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No spam</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>5,000+ subscribers</span>
            </div>
          </div>
        </div>

        {/* Bonus features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg group">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">🦎</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Expert Care Tips</h3>
            <p className="text-sm text-gray-600">Weekly insights from Abronía specialists</p>
          </div>

          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg group">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">🎁</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Exclusive Offers</h3>
            <p className="text-sm text-gray-600">Member-only discounts and deals</p>
          </div>

          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg group">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">📚</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">New Species Updates</h3>
            <p className="text-sm text-gray-600">Be first to learn about new discoveries</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;