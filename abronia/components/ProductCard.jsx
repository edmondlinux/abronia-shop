import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext()

    return (
        <div
            onClick={() => { router.push('/product/' + (product.slug || product._id)); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-1 max-w-[200px] w-full cursor-pointer group/card hover:shadow-lg transition-all duration-300 p-2 rounded-xl hover:-translate-y-1"
        >
            <div className="cursor-pointer group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl w-full h-52 flex items-center justify-center overflow-hidden shadow-sm">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-110 transition-transform duration-500 object-cover w-4/5 h-4/5 md:w-full md:h-full rounded-lg"
                    width={800}
                    height={800}
                />
                <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <Image
                        className="h-3.5 w-3.5"
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-xl"></div>
            </div>

            <div className="w-full space-y-1 pt-1">
                <p className="md:text-base font-semibold text-gray-800 w-full truncate leading-tight">{product.name}</p>
                <p className="w-full text-xs text-gray-600 max-sm:hidden truncate leading-relaxed">{product.description}</p>

                <div className="flex items-center gap-2 py-0.5">
                    <p className="text-xs font-medium text-gray-700">{4.5}</p>
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Image
                                key={index}
                                className="h-3 w-3"
                                src={
                                    index < Math.floor(4)
                                        ? assets.star_icon
                                        : assets.star_dull_icon
                                }
                                alt="star_icon"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-end justify-between w-full mt-2">
                    <p className="text-base font-bold text-gray-900">{currency}{product.offerPrice}</p>
                    <button className="max-sm:hidden px-4 py-1.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-full text-xs hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 font-medium shadow-sm">
                        Buy now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard