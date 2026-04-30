import { Link } from 'react-router-dom';
import { ArrowRight, Wind, ShieldCheck, Zap, Factory, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6"
             >
                One-Stop Ventilation & Cooling Solutions
             </motion.h1>
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed"
              >
                Leading the industrial manufacturing sector with high-performance HVLS Fans, Evaporative Air Coolers, and advanced workplace cooling systems.
             </motion.p>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="flex flex-wrap gap-4"
             >
               <Link to="/products" className="bg-secondary hover:bg-opacity-90 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                 Explore Products <ArrowRight className="w-5 h-5" />
               </Link>
               <Link to="/contact" className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm border border-white border-opacity-20 text-white px-8 py-4 rounded-full font-semibold transition-all">
                 Request a Quote
               </Link>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Categories / Features */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-2">Our Solutions</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Premium Industrial Cooling</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "HVLS Fans", icon: <Wind className="w-8 h-8"/>, desc: "High Volume Low Speed fans for massive air movement in large spaces." },
              { title: "Evaporative Coolers", icon: <Zap className="w-8 h-8"/>, desc: "Energy-efficient cooling solutions providing fresh, filtered air." },
              { title: "Exhaust Systems", icon: <Factory className="w-8 h-8"/>, desc: "Industrial-grade ventilation for harsh working environments." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-blue-50 text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.desc}</p>
                <Link to="/products" className="text-primary font-medium flex items-center gap-1 group-hover:text-secondary">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div>
                 <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-2">Why Kuul Fans</h2>
                 <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Engineering Excellence for Global Industry</h3>
                 <p className="text-gray-600 mb-8 leading-relaxed">
                   With deep roots tracing back to koolairint.com, Kuul Fans combines years of engineering expertise with modern AI-driven innovation to deliver unmatched cooling performance.
                 </p>
                 <ul className="space-y-4">
                   {[
                     { icon: <ShieldCheck className="w-6 h-6 text-secondary" />, text: "ISO 9001 Certified Manufacturing" },
                     { icon: <Zap className="w-6 h-6 text-secondary" />, text: "Energy Savings up to 80%" },
                     { icon: <Globe className="w-6 h-6 text-secondary" />, text: "Global Shipping & Installation Support" }
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                       {item.icon}
                       {item.text}
                     </li>
                   ))}
                 </ul>
               </div>
               <div className="relative">
                 <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1542482329-1ee06ca508ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Industrial Facility" 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
                 <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0"></div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
