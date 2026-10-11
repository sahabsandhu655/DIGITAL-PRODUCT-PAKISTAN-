import React, { useState, useMemo } from 'react';
import { Search, Newspaper, ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogIndexPageProps {
  posts: BlogPost[];
  onSelectBlog: (post: BlogPost) => void;
}

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ posts, onSelectBlog }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'AI Tools',
    'Software Guides',
    'E-book Recommendations',
    'Online Courses',
    'Business and Entrepreneurship',
    'Tutorials and How-to Guides',
    'Product Comparisons',
    'Digital Productivity',
  ];

  const filtered = useMemo(() => {
    return posts.filter(post => {
      const matchCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-[#233730] pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B7F34A] uppercase tracking-wider mb-2">
          <Newspaper className="w-4 h-4" />
          <span>Knowledge Base & Tutorials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Digital Products & Skills Blog
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
          In-depth guides on digital tools, AI voice synthesizers, high-income freelancing skills, and verified e-commerce execution in Pakistan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#B7F34A] text-[#111C18]'
                  : 'bg-[#1A2924] text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-[#233730] flex items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by topic, skill, or keyword..."
              className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <p className="font-bold text-white">No articles found in this category.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs text-[#B7F34A] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectBlog(post)}
              className="group bg-[#15231F] border border-[#233730] hover:border-[#B7F34A]/50 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#B7F34A]/5"
            >
              <div className="h-48 overflow-hidden bg-black">
                <img
                  src={post.coverImage}
                  alt={post.imageAlt || post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B7F34A] font-bold">{post.category}</span>
                    <span className="text-slate-500">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="font-bold text-lg text-white group-hover:text-[#B7F34A] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#233730] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" /> {post.author}
                  </span>
                  <span className="text-[#B7F34A] font-bold flex items-center gap-1">
                    Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
