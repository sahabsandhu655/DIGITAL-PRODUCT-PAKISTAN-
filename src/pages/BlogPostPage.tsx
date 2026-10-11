import React from 'react';
import { ArrowLeft, Calendar, User, Tag, Share2, ArrowRight } from 'lucide-react';
import { BlogPost, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface BlogPostPageProps {
  post: BlogPost;
  allPosts: BlogPost[];
  allProducts: Product[];
  onBack: () => void;
  onSelectBlog: (post: BlogPost) => void;
  onSelectProduct: (product: Product) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  post,
  allPosts,
  allProducts,
  onBack,
  onSelectBlog,
  onSelectProduct,
}) => {
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  const relatedProducts = allProducts.slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#B7F34A] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog Articles</span>
      </button>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-[#1A2924] border border-[#233730] text-[#B7F34A] text-xs font-bold px-3 py-1 rounded-lg">
            {post.category}
          </span>
          <span className="text-xs text-slate-400">
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-PK', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-[#233730]">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <User className="w-4 h-4 text-[#B7F34A]" /> By {post.author}
          </span>
          <span>•</span>
          <span>5 min read</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-3xl overflow-hidden border border-[#233730] shadow-2xl bg-black max-h-[480px]">
        <img
          src={post.coverImage}
          alt={post.imageAlt || post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Body (High readability on white/light container or high-contrast card) */}
      <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-8 sm:p-12 text-slate-200 text-base leading-relaxed space-y-6">
        <p className="text-lg text-slate-100 font-medium leading-relaxed border-l-4 border-[#B7F34A] pl-4 italic">
          {post.excerpt}
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-bold text-white pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-extrabold text-white pt-6">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            return (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 border-t border-[#233730] flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#1A2924] border border-[#233730] text-slate-300 text-xs px-2.5 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Callout */}
      {relatedProducts.length > 0 && (
        <div className="bg-[#111C18] border border-[#233730] rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recommended Products Mentioned</h3>
            <span className="text-xs text-[#B7F34A] font-semibold">Verified Instant Delivery</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      )}

      {/* More Articles */}
      {relatedPosts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#233730]">
          <h3 className="text-xl font-bold text-white">More Guides in {post.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map(p => (
              <div
                key={p.id}
                onClick={() => onSelectBlog(p)}
                className="bg-[#15231F] border border-[#233730] hover:border-[#B7F34A] rounded-2xl p-5 cursor-pointer transition-colors space-y-2"
              >
                <span className="text-xs text-[#B7F34A] font-semibold">{p.category}</span>
                <h4 className="font-bold text-white hover:text-[#B7F34A] transition-colors line-clamp-2">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">{p.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
