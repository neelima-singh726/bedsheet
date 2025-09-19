"use client";
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Exclusively for you.</h1>
        <p className="mt-2 text-gray-600">Your thoughts matter. Send us a message - we're here for you!</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* --- Contact Form --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-3"/>
          <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-3"/>
          <input type="tel" placeholder="Phone number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-3"/>
          <textarea placeholder="Message" required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-3 resize-y"></textarea>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">Send</button>
          {status && <p className="text-center text-sm mt-2">{status}</p>}
        </form>

        {/* --- Map and Details --- */}
        <div className="space-y-6">
          <div className="w-full h-80 overflow-hidden rounded-lg border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923126445!2d77.06889754728583!3d28.52758200617636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1726665768393!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div>
            <h3 className="font-semibold">Manufactured/Packaged/Imported/Marketed by:</h3>
            <p className="text-sm text-gray-600">Premier Fine Linens Pvt Ltd</p>
            <p className="text-sm text-gray-600">91, R P Landmark, Avinashi Road, Delhi – 641028, India</p>
            <p className="mt-4 text-sm text-gray-600">+91 7015449574</p>
          </div>
        </div>
      </div>
    </main>
  );
}