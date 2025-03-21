import React, { useState } from 'react';
import Navbar from './shared/navbar';
import Footer from './shared/footer';

const Help = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'How does the disease prediction work?',
      answer: 'The system uses a dataset of symptoms and diseases, applying a machine learning model or a rule-based approach to analyze symptoms and provide the most probable disease predictions.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use encryption and secure authentication methods to protect user data. Your medical information is not shared with third parties.'
    },
    {
      question: 'How do I add my symptoms?',
      answer: 'Simply enter or select symptoms from the provided list, and the system will analyze and predict possible diseases.'

    },
    {
      question: 'How does the Health Risk Prediction work?',
      answer: 'Our ML models analyze various health indicators to predict potential risks, offering preventive recommendations tailored to you.'
    },
    {
      question: "Can this app replace a doctor's consultation?",
      answer: 'No, this app is only for informational purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.'
    },
    {
      question: 'Can I suggest improvements or report issues?',
      answer: 'Of course! You can contact the development team or submit feedback at support@healthbuddy.com for suggestions'
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <section className="h-screen pt-[100px] bg-[#E6FAFA]">
        <div className="p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#0CAAAB]">FAQs</h2>
          <div className="faq-section">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md transition duration-300">
                  <button
                    className="w-full text-left font-medium flex justify-between items-center text-[#3A5A75] transition-all duration-300 hover:text-[#0CAAAB]"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                    <span className={`transform transition-transform duration-300 text-[#5BC7C8] ${activeIndex === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {activeIndex === index && (
                    <p className="mt-2 text-[#404040]">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Help;