import React, { useState } from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)

  return (
    <div className='pb-14 px-8 md:px-0 max-w-5xl mx-auto relative'>
      <h2 className='text-3xl font-medium text-gray-800 text-center'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3 text-center max-w-xl mx-auto'>
        Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.
      </p>

      {/* Testimonials Cards Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-14'>
        {dummyTestimonial.map((testimonial, index) => (
          <div 
            key={index} 
            className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between'
          >
            <div>
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                <img 
                  className='h-12 w-12 rounded-full object-cover' 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                />
                <div>
                  <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                  <p className='text-gray-800/80'>{testimonial.role}</p>
                </div>
              </div>

              <div className='p-5 pb-3'>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => (
                    <img 
                      className='h-5' 
                      key={i} 
                      src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} 
                      alt="star" 
                    />
                  ))}
                </div>
                <p className='text-gray-500 mt-5 line-clamp-3 leading-relaxed'>
                  {testimonial.feedback}
                </p>
              </div>
            </div>

            {/* Read More Button */}
            <div className='px-5'>
              <button 
                type="button"
                onClick={() => setSelectedTestimonial(testimonial)} 
                className='text-blue-500 underline text-sm cursor-pointer hover:text-blue-700 font-medium'
              >
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedTestimonial && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl relative'>
            <button 
              type="button"
              onClick={() => setSelectedTestimonial(null)} 
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer'
            >
              ✕
            </button>

            <div className='flex items-center gap-4 border-b pb-4 mb-4'>
              <img className='h-14 w-14 rounded-full object-cover' src={selectedTestimonial.image} alt={selectedTestimonial.name} />
              <div>
                <h3 className='text-xl font-semibold text-gray-800'>{selectedTestimonial.name}</h3>
                <p className='text-sm text-gray-600'>{selectedTestimonial.role}</p>
              </div>
            </div>

            <div className='flex gap-0.5 mb-4'>
              {[...Array(5)].map((_, i) => (
                <img 
                  key={i} 
                  src={i < Math.floor(selectedTestimonial.rating) ? assets.star : assets.star_blank} 
                  alt="star" 
                  className='h-5' 
                />
              ))}
            </div>

            <p className='text-gray-600 leading-relaxed text-base mb-6'>
              "{selectedTestimonial.feedback}"
            </p>

            <button 
              type="button"
              onClick={() => setSelectedTestimonial(null)} 
              className='w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestimonialsSection