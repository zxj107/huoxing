'use client'

import { useState, useTransition } from 'react'
import { Bookmark, X } from 'lucide-react'
import Link from 'next/link'
import { toggleFavorite } from '@/app/actions/favorites'

interface FavoriteButtonProps {
    articleId: string
    initialFavorited: boolean
}

export default function FavoriteButton({ articleId, initialFavorited }: FavoriteButtonProps) {
    const [favorited, setFavorited] = useState(initialFavorited)
    const [isPending, startTransition] = useTransition()
    const [toast, setToast] = useState<string | null>(null)
    const [showLoginModal, setShowLoginModal] = useState(false)

    const handleClick = () => {
        startTransition(async () => {
            const result = await toggleFavorite(articleId)
            if (result.error === 'NOT_AUTHENTICATED') {
                setShowLoginModal(true)
                return
            }
            if (result.success && result.favorited !== undefined) {
                setFavorited(result.favorited)
                setToast(result.favorited ? '去吃灰吧' : '放它自由')
                setTimeout(() => setToast(null), 1800)
            }
        })
    }

    return (
        <>
            <span className="relative inline-flex items-center gap-2 not-italic">
                <button
                    onClick={handleClick}
                    disabled={isPending}
                    aria-label={favorited ? '取消收藏' : '收藏'}
                    className="inline-flex items-center transition-colors duration-200"
                >
                    <Bookmark
                        className={`h-4 w-4 transition-all duration-200 ${favorited
                                ? 'fill-[#A1887F] text-[#A1887F]'
                                : 'opacity-60 hover:opacity-100 hover:text-[#A1887F]'
                            }`}
                        aria-hidden="true"
                    />
                </button>
                {toast && (
                    <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-[#5D5D5D] px-2 py-0.5 text-[11px] text-white shadow-sm animate-fade-out">
                        {toast}
                    </span>
                )}
            </span>

            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLoginModal(false)}>
                    <div className="relative w-80 rounded-2xl bg-white p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute right-4 top-4 text-[#9E9E9E] transition-colors hover:text-[#5D5D5D]"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="text-center">
                            <p className="mb-6 font-serif text-lg text-[#5D5D5D]">请先登录后再收藏</p>
                            <Link
                                href="/login"
                                onClick={() => setShowLoginModal(false)}
                                className="inline-flex items-center rounded-full bg-[#A1887F] px-8 py-2.5 text-sm text-white transition-colors hover:bg-[#8D6E63]"
                            >
                                去登录
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
