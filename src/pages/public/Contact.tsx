import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type InquiryForm = z.infer<typeof inquirySchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema)
  });

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp()
      });
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-light-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid lg:grid-cols-2 gap-16">
            <div>
               <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Get in Touch</h1>
               <p className="text-gray-600 mb-10 leading-relaxed">
                 Whether you need a custom cooling solution for a massive warehouse, or you're interested in becoming a distributor, our team is ready to help.
               </p>
               
               <div className="space-y-6">
                 <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Headquarters</h3>
                    <p className="text-gray-600 text-sm">Global Industrial Park, Tech Avenue<br/>Los Angeles, CA 90001</p>
                 </div>
                 <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Contact Details</h3>
                    <p className="text-gray-600 text-sm">Email: info@kuulfans.com<br/>Phone: +1 (800) 555-0199</p>
                 </div>
               </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
               {submitSuccess ? (
                 <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-gray-600">We've received your inquiry and will contact you shortly.</p>
                    <button onClick={() => setSubmitSuccess(false)} className="mt-6 text-primary font-medium hover:underline">Send another message</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                         <input {...register('name')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" />
                         {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                         <input {...register('email')} type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" />
                         {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                         <input {...register('company')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                         <input {...register('phone')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                       <textarea {...register('message')} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"></textarea>
                       {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-secondary text-white font-medium py-4 rounded-xl transition-colors shadow-md disabled:opacity-70 flex justify-center items-center"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                 </form>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
