import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';

const initialForm = { name: '', email: '', message: '' };

const validate = (values) => {
  const errs = {};
  if (!values.name.trim()) errs.name = 'Full name is required.';
  else if (values.name.trim().length < 2) errs.name = 'Please enter your full name.';

  if (!values.email.trim()) errs.email = 'Email is required.';
  else {
    // simple email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(values.email.trim())) errs.email = 'Enter a valid email address.';
  }

  if (!values.message.trim()) errs.message = 'Message cannot be empty.';
  else if (values.message.trim().length < 10) errs.message = 'Message should be at least 10 characters.';
  return errs;
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setForm(initialForm);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 contact">
      <h2 className="w-50 text-4xl md:text-5xl font-extrabold text-black text-center bg-white px-4 py-2 mx-auto mb-7 uppercase big-shoulder">Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 items-start relative">
        <svg width="95" height="51" viewBox="0 0 95 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-[2px] -left-[1px]"><g clipPath="url(#clip0_556_5471)"><path fillRule="evenodd" clipRule="evenodd" d="M29.12 0.54308L33.2496 4.08275L33.3901 4.20312H33.575H73.47H73.661L73.8034 4.0758L77.753 0.54308H94.8L89.27 7.65308H14.615L3.555 19.1081V27.0081L1.58 32.1431V40.0431H0V15.1581L13.825 0.54308H29.12ZM30.6566 0.54308H29.12L27.7196 -0.657247L28.3704 -1.4165L30.6566 0.54308ZM30.6566 0.54308H76.253L73.2791 3.20312H33.76L30.6566 0.54308ZM76.253 0.54308L77.1667 -0.274172L77.8333 0.471173L77.753 0.54308H76.253Z" fill="grey"></path></g><defs><clipPath id="clip0_556_5471"><rect width="94.5322" height="49.8852" fill="white" transform="translate(0 0.583496)"></rect></clipPath></defs></svg>
        <svg width="95" height="51" viewBox="0 0 95 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-[2px] -left-[1px] -scale-y-100"><g clipPath="url(#clip0_556_5471)"><path fillRule="evenodd" clipRule="evenodd" d="M29.12 0.54308L33.2496 4.08275L33.3901 4.20312H33.575H73.47H73.661L73.8034 4.0758L77.753 0.54308H94.8L89.27 7.65308H14.615L3.555 19.1081V27.0081L1.58 32.1431V40.0431H0V15.1581L13.825 0.54308H29.12ZM30.6566 0.54308H29.12L27.7196 -0.657247L28.3704 -1.4165L30.6566 0.54308ZM30.6566 0.54308H76.253L73.2791 3.20312H33.76L30.6566 0.54308ZM76.253 0.54308L77.1667 -0.274172L77.8333 0.471173L77.753 0.54308H76.253Z" fill="grey"></path></g><defs><clipPath id="clip0_556_5471"><rect width="94.5322" height="49.8852" fill="white" transform="translate(0 0.583496)"></rect></clipPath></defs></svg>
        <svg width="95" height="51" viewBox="0 0 95 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-[2px] -right-[1px] scale-x-[-1]"><g clipPath="url(#clip0_556_5471)"><path fillRule="evenodd" clipRule="evenodd" d="M29.12 0.54308L33.2496 4.08275L33.3901 4.20312H33.575H73.47H73.661L73.8034 4.0758L77.753 0.54308H94.8L89.27 7.65308H14.615L3.555 19.1081V27.0081L1.58 32.1431V40.0431H0V15.1581L13.825 0.54308H29.12ZM30.6566 0.54308H29.12L27.7196 -0.657247L28.3704 -1.4165L30.6566 0.54308ZM30.6566 0.54308H76.253L73.2791 3.20312H33.76L30.6566 0.54308ZM76.253 0.54308L77.1667 -0.274172L77.8333 0.471173L77.753 0.54308H76.253Z" fill="grey"></path></g><defs><clipPath id="clip0_556_5471"><rect width="94.5322" height="49.8852" fill="white" transform="translate(0 0.583496)"></rect></clipPath></defs></svg>
        <svg width="95" height="51" viewBox="0 0 95 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-[2px] -right-[1px] -scale-y-100 scale-x-[-1]"><g clipPath="url(#clip0_556_5471)"><path fillRule="evenodd" clipRule="evenodd" d="M29.12 0.54308L33.2496 4.08275L33.3901 4.20312H33.575H73.47H73.661L73.8034 4.0758L77.753 0.54308H94.8L89.27 7.65308H14.615L3.555 19.1081V27.0081L1.58 32.1431V40.0431H0V15.1581L13.825 0.54308H29.12ZM30.6566 0.54308H29.12L27.7196 -0.657247L28.3704 -1.4165L30.6566 0.54308ZM30.6566 0.54308H76.253L73.2791 3.20312H33.76L30.6566 0.54308ZM76.253 0.54308L77.1667 -0.274172L77.8333 0.471173L77.753 0.54308H76.253Z" fill="grey"></path></g><defs><clipPath id="clip0_556_5471"><rect width="94.5322" height="49.8852" fill="white" transform="translate(0 0.583496)"></rect></clipPath></defs></svg>
        {/* LEFT: Form */}
        <div className="bg-white/20 shadow-lg sm:rounded-tl-3xl rounded-bl-3xl rounded-br-3xl sm:rounded-br-none p-8 order-2 md:order-1">
          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <label className="relative block mb-4">
              <span
                  className={`absolute left-3 text-base iceland font-medium transition-all duration-300 ease-in-out 
                    ${form.name || errors.name ? 'top-[-13px] bg-[#333333] px-2 rounded-sm text-md text-gray-100' : 'top-3.5 left-8 text-base text-gray-200'}`}
                >
                  Full Name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                autoComplete="name"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'error-name' : undefined}
                className={`mt-1 block w-full text-white iceland text-xl border focus:ring-2 focus:ring-white px-8 py-3
                  ${errors.name ? 'border-red-400' : 'border-gray-200'} bg-transparent`}
              />
              {errors.name && (
                <p id="error-name" className="mt-1 text-base iceland text-red-600">
                  {errors.name}
                </p>
              )}
            </label>

            {/* Email */}
            <label className="block mb-4 relative">
              <span
                  className={`absolute left-3 text-base iceland font-medium transition-all duration-300 ease-in-out 
                    ${form.email || errors.email ? 'top-[-13px] bg-[#333333] px-2 rounded-sm text-md text-gray-100' : 'top-3.5 left-8 text-base text-gray-200'}`}
                >
                  Email Address
              </span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'error-email' : undefined}
                className={`mt-1 block w-full text-white iceland text-xl border focus:ring-2 focus:ring-white px-8 py-3
                  ${errors.email ? 'border-red-400' : 'border-gray-200'} bg-transparent`}
                placeholder=""
              />
              {errors.email && (
                <p id="error-email" className="mt-1 text-base iceland text-red-600">
                  {errors.email}
                </p>
              )}
            </label>

            {/* Message */}
            <label className="block mb-4 relative">
              <span
                  className={`absolute left-3 text-base iceland font-medium transition-all duration-300 ease-in-out 
                    ${form.message || errors.message ? 'top-[-13px] px-2 rounded-sm bg-[#333333] text-md text-gray-100' : 'top-3.5 left-8 text-base text-gray-200'}`}
                >
                  Tell me about your project or question...
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="3"
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'error-message' : undefined}
                className={`mt-1 block w-full text-white iceland text-xl border focus:ring-2 focus:ring-white px-8 py-3
                  ${errors.message ? 'border-red-400' : 'border-gray-200'} bg-transparent`}
                placeholder=""
              />
              {errors.message && (
                <p id="error-message" className="mt-1 text-base iceland text-red-600">
                  {errors.message}
                </p>
              )}
            </label>

            {/* Status messages */}
            {status === 'success' && (
              <div className="mb-4 text-base iceland text-green-700 bg-green-50 p-3" role="status">
                Thank You for Contacting — your message was sent.
              </div>
            )}
            {status === 'error' && (
              <div className="mb-4 text-base iceland text-red-700 bg-red-50 p-3" role="alert">
                Oops — something went wrong. You can also email me directly at <strong>sanechacko555@gmail.com</strong>.
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <div className='w-full border-scan ring-1 ring-white ring-offset-4 ring-offset-[#333333]'>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex gap-3 items-center justify-center px-5 py-3 bg-white text-black iceland text-xl font-bold uppercase hover:bg-gray-200 hover:shadow-[0_0px_7px_black] transition-shadow disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      Sending...
                      <FontAwesomeIcon icon={faSpinner} spin />
                    </>
                  ) : (
                    <>
                      Send Message
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </>
                  )}
                </button>
              </div>

              {/* mailto fallback */}
              <a
                href="mailto:sanechacko555@gmail.com"
                className="text-base iceland text-white underline hover:text-orange-500"
              >
                Or email directly
              </a>
            </div>
          </form>
        </div>

        {/* RIGHT: Image / Illustration */}
        <div className="flex bg-white items-center justify-center w-full h-full rounded-tl-3xl sm:rounded-tl-none rounded-tr-3xl sm:rounded-br-3xl order-1 md:order-2">
          <div className="max-w-md rounded-xl overflow-hidden p-3 md:p-15">
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-4 iceland">
              Let’s Connect!
            </h3>
            <p className="text-2xl text-black mb-6 iceland">
              Got an idea, a question, or just want to say hi? Send me a message! I love connecting with curious minds—let’s make something amazing together!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
