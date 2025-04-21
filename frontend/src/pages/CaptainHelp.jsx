import React, { useState } from 'react';
import CaptainNavbar from '../components/CaptainNavbar';

const CaptainHelp = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const faqs = [
    {
      question: "How do I start accepting rides?",
      answer: "Once you're logged in, you'll automatically start receiving ride requests. Make sure your location services are enabled and you're online to receive requests."
    },
    {
      question: "How do I get paid?",
      answer: "Payments are processed automatically after each completed ride. The fare amount will be transferred to your linked bank account within 1-3 business days."
    },
    {
      question: "What should I do if there's an issue during a ride?",
      answer: "In case of any issues, you can contact our 24/7 support team through the app or call our emergency hotline at 1-800-CARPOOL."
    },
    {
      question: "How is the fare calculated?",
      answer: "Fares are calculated based on distance, time, and current demand. Base fare + (Distance × Rate) + (Time × Rate) + Service Fee = Total Fare"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <CaptainNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">Help Center</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <i className="ri-phone-line text-2xl text-blue-600 mr-4"></i>
              <div>
                <p className="font-medium">Emergency Support</p>
                <p className="text-gray-600">1-800-CARPOOL</p>
              </div>
            </div>
            <div className="flex items-center">
              <i className="ri-mail-line text-2xl text-blue-600 mr-4"></i>
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-gray-600">support@carpool.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg">
                <button
                  className="w-full text-left px-4 py-3 font-medium flex justify-between items-center"
                  onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                >
                  {faq.question}
                  <i className={`ri-arrow-down-s-line transition-transform ${activeAccordion === index ? 'rotate-180' : ''}`}></i>
                </button>
                {activeAccordion === index && (
                  <div className="px-4 py-3 text-gray-600 border-t">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainHelp;
