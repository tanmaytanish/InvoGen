import React,{ useState} from 'react'
import { FAQS } from '../../utils/data'
import { ChevronDown } from 'lucide-react'

const FaqItem = ({faq, isOpen, onClick}) => {
    return (
        <div className='border border-gray-200 rounded-xl overflow-hidden'>
            <button onClick={onClick} className='w-full flex justify-between items-center py-4 px-6 bg-white hover:bg-gray-100 cursor-pointer transition-colors duration-200'>
                <span className='text-lg font-medium text-gray-900 pr-4 text-left'>{faq.question}</span>
                <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className='px-6 pt-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100'>
                    {faq.answer}
                </div>
            )}
        </div>
    );
}


const Faqs = () => {

    const [openIndex, setOpenIndex] = useState(null);

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }


  return (
    <section id='faq' className='py-20 lg:py-28 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4'>Frequently Asked Questions !</h2>
                <p className='text-xl text-gray-600 max-w-3xl mx-auto'>Everything you need to know about the product and billing.</p>
            </div>

            <div className='space-y-4'>
                {
                    FAQS.map((faq,index) => (
                        <FaqItem
                            key={index}
                            faq={faq}
                            isOpen={openIndex === index}
                            onClick={()=> handleClick(index)}
                        />
                    ))
                }
            </div>
        </div>
        
    </section>
  )
}

export default Faqs