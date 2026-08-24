import React from 'react'

const AboutSection = () => {
  return (
    <section id="about-us" className="py-16 md:px-36 px-8 bg-white text-left">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">About FastSol</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Empowering learners worldwide with practical skills, expert guidance, and accessible education for a brighter career.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Quality Courses</h3>
            <p className="text-sm text-gray-600">
              Handcrafted content designed by industry professionals to bridge the gap between learning and real-world implementation.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Learn Anywhere</h3>
            <p className="text-sm text-gray-600">
              Flexible learning experience with lifetime access to resources, enabling students to study at their own pace.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Career Focused</h3>
            <p className="text-sm text-gray-600">
              Practical projects and skills tailored to meet modern industry demands and elevate your career trajectory.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection