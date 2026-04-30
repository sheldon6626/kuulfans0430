import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(data);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="py-20 bg-light-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Our Products</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our range of industrial cooling solutions.</p>
         </div>
         
         {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
         ) : products.length === 0 ? (
             <div className="text-center py-20 text-gray-500">No products available at the moment.</div>
         ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                      <div className="h-64 bg-gray-200">
                          <img src={product.imageUrl || 'https://images.unsplash.com/photo-1574360741544-307f59d57a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6">
                          <span className="text-xs font-bold text-secondary uppercase tracking-wider">{product.category}</span>
                          <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                          <button className="text-primary font-medium hover:text-secondary transition-colors inline-block mt-2">View Details &rarr;</button>
                      </div>
                  </div>
                ))}
             </div>
         )}
      </div>
    </div>
  );
}
