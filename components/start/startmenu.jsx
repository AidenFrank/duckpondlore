'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGlassBox } from 'context/glassboxcontext';
import { getFirstGrapheme, isEmoji } from '../../lib/iconUtils';

export default function StartMenu({ isOpen, onClose, fetchUrl = '/.netlify/functions/boxes' }) {
    const { openBox } = useGlassBox();

    const [catalog, setCatalog] = useState([]);
    const [query, setQuery] = useState('');
    const [recents, setRecents] = useState([]);
    const [suggested, setSuggested] = useState([]);
    const [highlight, setHighlight] = useState(null);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    // Fetch catalog
    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const res = await fetch(fetchUrl);
                if (!res.ok) throw new Error(res.statusText || 'Failed to fetch boxes');
                const data = await res.json();
                const normalized = data.map((row) => {
                    const rawData = row.props ?? row.data ?? null;
                    let parsed = {};
                    if (rawData) {
                        try {
                            parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                        } catch (e) {
                            parsed = rawData;
                        }
                    }
                    return {
                        id: row.id,
                        template: row.template ?? parsed.template,
                        title: row.title ?? parsed.title ?? parsed.heading ?? row.id,
                        icon: row.icon ?? parsed.icon ?? parsed.iconUrl ?? null,
                        tags: (row.tags ?? parsed.tags ?? []) || [],
                        rawRow: row,
                        parsedProps: parsed
                    };
                });
                if (mounted) {
                    setCatalog(normalized);
                    const shuffled = [...normalized].sort(() => 0.5 - Math.random());
                    setSuggested(shuffled.slice(0, 5));
                }
            } catch (err) {
                console.error('[StartMenu] Failed to load catalog', err);
                if (mounted) setCatalog([]);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, [fetchUrl]);

    // Focus input
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setHighlight(null);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    // Click outside
    useEffect(() => {
        function onDocClick(e) {
            if (!isOpen) return;
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target) && !e.target.closest('[data-start-button]')) {
                onClose();
            }
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [isOpen, onClose]);

    function addRecent(row) {
        if (!row) return;
        if ((row.tags || []).includes('hidden')) return;
        setRecents((prev) => {
            const without = prev.filter((r) => r.id !== row.id);
            const next = [row, ...without];
            return next.slice(0, 5); // cap at 5
        });
    }

    // Results in search mode (must be defined BEFORE flatItems)
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return catalog
            .filter((row) => {
                const title = (row.title || '').toString().toLowerCase();
                const tags = (row.tags || []).map((t) => t.toLowerCase());
                const isHidden = (row.tags || []).includes('hidden');
                return !isHidden && (title.includes(q) || tags.some((t) => t.includes(q)));
            })
            .slice(0, 10);
    }, [query, catalog]);

    // Flat list builder for navigation
    const flatItems = useMemo(() => {
        if (query) {
            return results.map((row, i) => ({ key: `search-${i}`, row }));
        }
        let items = [];
        suggested.slice(0, 5).forEach((row, i) => {
            items.push({ key: `suggested-${i}`, row });
        });
        recents.slice(0, 5).forEach((row, i) => {
            items.push({ key: `recents-${i}`, row });
        });
        return items;
    }, [query, results, suggested, recents]);

    function spawnRow(row) {
        if (!row) return;
        openBox(row.id, { initialX: 20, initialY: 20 });
        addRecent(row);
        onClose();
    }

    function onKeyDown(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (flatItems.length === 0) return;
            setHighlight((prev) => {
                const idx = flatItems.findIndex((it) => it.key === prev);
                const nextIdx = idx === -1 ? 0 : Math.min(idx + 1, flatItems.length - 1);
                return flatItems[nextIdx].key;
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (flatItems.length === 0) return;
            setHighlight((prev) => {
                const idx = flatItems.findIndex((it) => it.key === prev);
                const nextIdx = idx === -1 ? flatItems.length - 1 : Math.max(idx - 1, 0);
                return flatItems[nextIdx].key;
            });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const match = flatItems.find((it) => it.key === highlight);
            if (match) {
                spawnRow(match.row);
                return;
            }
            const typed = query.trim();
            if (typed) {
                const hiddenMatch = catalog.find((r) => r.id === typed && (r.tags || []).includes('hidden'));
                if (hiddenMatch) {
                    spawnRow(hiddenMatch);
                }
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    }

    function renderIcon(row) {
        const icon = row.icon ?? row.parsedProps?.icon;
        const title = row.title ?? row.id;
        if (icon) {
            return <img src={icon} alt={title} className="w-6 h-6 object-contain rounded-sm" />;
        }
        const first = getFirstGrapheme(title);
        const emoji = isEmoji(first);
        return (
            <div className="w-6 h-6 flex items-center justify-center rounded-sm bg-gray-200">
                <span className={`select-none ${emoji ? 'text-2xl' : 'text-sm font-bold'}`}>{first}</span>
            </div>
        );
    }

    return (
        <div
            className={`fixed left-4 bottom-16 z-[99999] w-[380px] overflow-hidden
                origin-bottom transform transition-all duration-200 ease-out
                ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
        >
            <div className="p-[6px] rounded-t-2xl rounded-b-none bg-black/40 backdrop-blur-md border border-black/60 shadow-2xl">
                <div
                    ref={containerRef}
                    onKeyDown={onKeyDown}
                    className="w-full rounded-t-xl rounded-b-none bg-white/95 flex flex-col overflow-hidden"
                    role="menu"
                    aria-label="Start menu"
                >
                    <div className="flex-1 overflow-y-auto">
                        <ul className="flex flex-col">
                            {query ? (
                                results.length === 0 ? (
                                    <li className="px-3 py-2 text-sm text-gray-500">No results found</li>
                                ) : (
                                    results.map((row, i) => (
                                        <li key={`search-${row.id}`}>
                                            <button
                                                onClick={() => spawnRow(row)}
                                                onMouseEnter={() => setHighlight(`search-${i}`)}
                                                className={`w-full flex items-center gap-3 px-2 py-2 text-left transition
                                                    ${highlight === `search-${i}` ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                                            >
                                                {renderIcon(row)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="truncate text-sm text-gray-900">{row.title}</div>
                                                </div>
                                            </button>
                                        </li>
                                    ))
                                )
                            ) : (
                                <>
                                    <li className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                                        Suggested
                                    </li>
                                    {suggested.slice(0, 5).map((row, i) => (
                                        <li key={`suggested-${row.id}`}>
                                            <button
                                                onClick={() => spawnRow(row)}
                                                onMouseEnter={() => setHighlight(`suggested-${i}`)}
                                                className={`w-full flex items-center gap-3 px-2 py-2 text-left transition
                                                    ${highlight === `suggested-${i}` ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                                            >
                                                {renderIcon(row)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="truncate text-sm text-gray-900">{row.title}</div>
                                                </div>
                                            </button>
                                        </li>
                                    ))}

                                    {recents.length > 0 && (
                                        <>
                                            <li className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                                                Recent
                                            </li>
                                            {recents.slice(0, 5).map((row, i) => (
                                                <li key={`recents-${row.id}`}>
                                                    <button
                                                        onClick={() => spawnRow(row)}
                                                        onMouseEnter={() => setHighlight(`recents-${i}`)}
                                                        className={`w-full flex items-center gap-3 px-2 py-2 text-left transition
                                                            ${highlight === `recents-${i}` ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                                                    >
                                                        {renderIcon(row)}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="truncate text-sm text-gray-900">
                                                                {row.title}
                                                            </div>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                    <div className="border-t border-gray-300 p-2 bg-gray-50">
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setHighlight(null);
                            }}
                            placeholder="Search"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
