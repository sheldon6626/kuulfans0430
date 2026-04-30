export default function About() {
  return (
    <div className="py-20 bg-white min-h-screen">
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">About Kuul Fans</h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Formerly known as koolairint.com, Kuul Fans is a premier designer and manufacturer of superior industrial ventilation and evaporative cooling systems. Our commitment to innovation, energy efficiency, and unrivaled performance has made us a trusted partner for commercial and industrial facilities worldwide.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-gray-100">
             <div>
                <div className="text-4xl font-bold text-primary mb-2">20+</div>
                <div className="text-gray-500 text-sm font-medium">Years Experience</div>
             </div>
             <div>
                <div className="text-4xl font-bold text-primary mb-2">50k+</div>
                <div className="text-gray-500 text-sm font-medium">Installations</div>
             </div>
             <div>
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-gray-500 text-sm font-medium">Countries Served</div>
             </div>
             <div>
                <div className="text-4xl font-bold text-primary mb-2">ISO</div>
                <div className="text-gray-500 text-sm font-medium">9001 Certified</div>
             </div>
          </div>
       </div>
    </div>
  );
}
