'use client';

import { useState } from 'react';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="sticky top-0 backdrop-blur-md bg-secondary/80 border-b border-white/20 px-4 py-3 z-10">
        <h1 className="text-xl font-bold">Explore</h1>
      </div>
      
      <div className="p-4">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-white/5 rounded-full border border-white/20 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-white/50"
              placeholder="Search Babbly"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white/5 rounded-2xl p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Trending for you</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                <div className="text-sm text-white/70">Trending in Technology</div>
                <div className="font-bold">#ReactJS</div>
                <div className="text-sm text-white/70">12.5K posts</div>
              </div>
            ))}
          </div>
        </div>

        {/* Who to Follow */}
        <div className="bg-white/5 rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">Who to follow</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20"></div>
                  <div>
                    <div className="font-bold">User Name {i}</div>
                    <div className="text-white/70">@username{i}</div>
                  </div>
                </div>
                <button className="bg-primary px-4 py-1.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 