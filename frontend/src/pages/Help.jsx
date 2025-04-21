import React from 'react';
import Navbar from '../components/Navbar';

const Help = () => {
  const faqs = [
    {
      question: "How do I book a ride?",
      answer: "Enter your pickup location and destination, choose your ride type, and confirm your booking. You'll be matched with a nearby driver."
    },
    {
      question: "How do I pay for my ride?",
      answer: "We accept various payment methods including credit/debit cards, digital wallets, and cash in some locations."
    },
    {
      question: "What if I left something in the car?",
      answer: "Contact our support team immediately, and we'll help you connect with your driver to retrieve your belongings."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8">Help Center</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQs Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="ri-phone-line mr-3 text-xl text-blue-500"></i>
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-gray-600">24/7 at 1-800-UBER</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="ri-mail-line mr-3 text-xl text-blue-500"></i>
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-gray-600">support@uber.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Emergency Support</h2>
              <p className="text-gray-600 mb-4">
                For immediate assistance in case of emergency during a ride, use the emergency button in your app or call:
              </p>
              <div className="flex items-center text-red-600 font-semibold">
                <i className="ri-emergency-line mr-2"></i>
                911
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
