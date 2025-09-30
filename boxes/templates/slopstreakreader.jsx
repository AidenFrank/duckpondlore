// boxes/templates/slopstreakreader.jsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import { supabase } from '../../lib/supabaseClient';

const DEFAULT_PFP_URL = 'https://your-supabase-bucket-url.com/default-pfp.png';

// Spoiler preprocessing: ||spoiler|| → <span class="spoiler">spoiler</span>
function preprocessMarkdown(md) {
    return md.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
}

export default function SlopstreakReader({ initialArticleSlug = null }) {
    const [query, setQuery] = useState('');
    const [articles, setArticles] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState(initialArticleSlug);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const onResize = () => {
            setIsSmall(window.innerWidth < 768);
        };
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        async function loadList() {
            const { data, error } = await supabase
                .from('slopstreak_articles')
                .select('id,slug,title,author')
                .order('created_at', { ascending: false });
            if (error) {
                console.error(error);
                return;
            }
            setArticles(data || []);
        }
        loadList();
    }, []);

    useEffect(() => {
        if (!selectedSlug) {
            setArticle(null);
            return;
        }
        let cancelled = false;
        async function loadArticle() {
            setLoading(true);
            const { data, error } = await supabase
                .from('slopstreak_articles')
                .select('title,author,profile_picture,header_image,markdown')
                .eq('slug', selectedSlug)
                .single();
            setLoading(false);
            if (error) {
                console.error('Error loading article:', error);
                return;
            }
            if (!cancelled) setArticle(data);
        }
        loadArticle();
        return () => {
            cancelled = true;
        };
    }, [selectedSlug]);

    const filtered = useMemo(() => {
        if (!query) return articles;
        const q = query.toLowerCase();
        return articles.filter(
            (a) =>
                a.title.toLowerCase().includes(q) ||
                (a.author && a.author.toLowerCase().includes(q)) ||
                (a.slug && a.slug.toLowerCase().includes(q))
        );
    }, [articles, query]);

    // Custom renderers to mimic Discord-like style
    const components = {
        img: ({ node, ...props }) => <img {...props} loading="lazy" className="max-w-full h-auto rounded-md my-2" />,
        a: ({ node, ...props }) => (
            <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noreferrer" />
        ),
        blockquote: ({ node, ...props }) => (
            <blockquote {...props} className="border-l-4 border-gray-600 pl-3 text-gray-300 italic my-2" />
        ),
        code: ({ inline, className, children, ...props }) => {
            return inline ? (
                <code className="bg-[#1e1f22] px-1.5 py-0.5 rounded text-pink-300 text-sm">{children}</code>
            ) : (
                <pre className="bg-[#1e1f22] p-3 rounded overflow-x-auto text-sm text-gray-100">
                    <code>{children}</code>
                </pre>
            );
        },
        p: ({ node, ...props }) => <p {...props} className="my-2 leading-relaxed" />,
        span: ({ node, ...props }) => {
            if (props.className === 'spoiler') {
                return (
                    <span
                        {...props}
                        className="spoiler bg-[#1e1f22] text-transparent rounded px-1 hover:text-[#dcddde]"
                    />
                );
            }
            return <span {...props} />;
        },
        ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside my-2" />,
        ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside my-2" />
    };

    return (
        <div className="w-[900px] h-[600px] max-w-[95vw] max-h-[90vh] flex flex-col bg-[#2b2d31] text-[#dcddde] font-sans p-3">
            {/* Search */}
            <div className="flex items-center p-3 border-b border-[#1e1f22] bg-[#313338] rounded">
                <input
                    className="flex-1 px-3 py-2 rounded bg-[#1e1f22] text-[#dcddde] placeholder-gray-400 focus:outline-none"
                    placeholder="Search articles by title or author..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Layout */}
            <div className={`flex flex-1 overflow-hidden mt-3 ${isSmall ? 'flex-col' : 'flex-row'}`}>
                {/* Article list */}
                <div
                    className={`border-r border-[#1e1f22] bg-[#2f3136] ${isSmall ? 'w-full max-h-48' : 'w-64 max-h-full'} overflow-auto rounded`}
                >
                    {filtered.length === 0 && <div className="text-sm text-gray-400 p-2">No articles</div>}
                    {filtered.map((a) => (
                        <div
                            key={a.id}
                            className={`p-2 cursor-pointer ${a.slug === selectedSlug ? 'bg-[#40444b]' : 'hover:bg-[#36393f]'}`}
                            onClick={() => setSelectedSlug(a.slug)}
                        >
                            <div className="font-semibold">{a.title}</div>
                            {a.author && <div className="text-xs text-gray-400">By {a.author}</div>}
                        </div>
                    ))}
                </div>

                {/* Article view */}
                <div className="flex-1 overflow-auto bg-[#313338] p-4 ml-3 rounded">
                    {loading && <div>Loading…</div>}
                    {!article && !loading && <div className="text-sm text-gray-400">Select an article.</div>}
                    {article && (
                        <div className="flex flex-col gap-4">
                            {article.header_image && (
                                <div className="w-full h-48 overflow-hidden rounded-md">
                                    <img
                                        src={article.header_image}
                                        alt="Header"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <img
                                    src={article.profile_picture || DEFAULT_PFP_URL}
                                    alt="Author avatar"
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div>
                                    <h1 className="text-2xl font-bold">{article.title}</h1>
                                    {article.author && <div className="text-sm text-gray-400">By {article.author}</div>}
                                </div>
                            </div>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                components={components}
                            >
                                {preprocessMarkdown(article.markdown)}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
