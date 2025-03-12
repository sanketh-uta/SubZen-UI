import { useState } from "react";
import Auth from "./Auth";

export default () => {
  const [learnMore, SetLearnMore] = useState(false);
  const [getStarted, SetGetStarted] = useState(false);
  return (
    <main id="aboutus" className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Left half - Content */}
          <div className="md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
              SubZen
            </h1>
            <p className="text-lg text-purple-800 mb-6 leading-relaxed">
              Simplify your subscription management in one seamless platform.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <span className="text-pink-600 mr-3 mt-1">📅</span>
                <div>
                  <h3 className="font-semibold text-purple-900">
                    Never Miss a Renewal
                  </h3>
                  <p className="text-purple-800">
                    Get timely email 1 day before your billing cycles.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-pink-600 mr-3 mt-1">💰</span>
                <div>
                  <h3 className="font-semibold text-purple-900">
                    Track Your Spending
                  </h3>
                  <p className="text-purple-800">
                    Monitor all subscription costs in a unified dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-pink-600 mr-3 mt-1">🔒</span>
                <div>
                  <h3 className="font-semibold text-purple-900">
                    Secure & Intuitive
                  </h3>
                  <p className="text-purple-800">
                    Your data remains protected while management stays
                    effortless.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => SetGetStarted(true)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started Free
              </button>
              <button
                onClick={() => SetLearnMore(true)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Learn More
              </button>
            </div>
          </div>
          {/* Right half - Image */}
          <div className="md:w-1/2">
            <div className="overflow-hidden">
              <img
                src="/company-logo.jpeg"
                alt="Description of your image"
                className="w-full h-auto object-cover mix-blend-multiply shadow-none border-0"
              />
            </div>
          </div>
        </div>
      </div>
      {learnMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-900">
                  About SubZen
                </h2>
                <button
                  onClick={() => SetLearnMore(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="prose prose-purple max-w-none">
                <p>
                  Managing multiple subscriptions can be overwhelming—forgotten
                  renewals, unexpected charges, and scattered billing cycles can
                  strain both your budget and peace of mind. That's where SubZen
                  comes in!
                </p>

                <p>
                  We provide a smart, seamless, and hassle-free way to track all
                  your subscriptions in one place. Whether it's monthly
                  streaming services, annual software renewals, or quarterly
                  memberships, our platform helps you stay in control. Simply
                  add your subscription details, set your billing frequency, and
                  let our system handle the rest.
                </p>

                <h3>Key Features</h3>
                <ul>
                  <li>
                    <strong>Never Miss a Renewal</strong> – Get timely email
                    reminders before your next billing cycle.
                  </li>
                  <li>
                    <strong>Stay on Top of Your Spending</strong> – Keep track
                    of all your subscriptions and costs in one dashboard.
                  </li>
                  <li>
                    <strong>Secure & Easy to Use</strong> – Your subscription
                    data is safe with us, and managing it is effortless.
                  </li>
                </ul>

                <p>
                  With SubZen, you'll always be prepared—no more surprise
                  charges, no more forgotten renewals, just smarter financial
                  management. Start organizing your subscriptions today and take
                  control of your expenses effortlessly!
                </p>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => SetLearnMore(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {getStarted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-900">
                  Getting Started with SubZen
                </h2>
                <button
                  onClick={() => SetGetStarted(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-purple-800 mb-6">
                Getting started is quick and effortless! Follow these simple
                steps to take control of your subscriptions:
              </p>

              <div className="space-y-6 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-1">
                      Sign Up / Log In
                    </h3>
                    <p className="text-purple-800">
                      Securely access your account using your{" "}
                      <span className="font-medium">Google credentials</span>{" "}
                      (Powered by Firebase).
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-1">
                      Manage Your Subscriptions
                    </h3>
                    <p className="text-purple-800">
                      Navigate to the{" "}
                      <span className="font-medium">"Manage Subscription"</span>{" "}
                      page and add your subscription details, including name,
                      start date, billing cycle (monthly, quarterly, annual),
                      and price.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-1">
                      Relax, We've Got You Covered!
                    </h3>
                    <p className="text-purple-800">
                      Our system will handle the rest, sending you timely{" "}
                      <span className="font-medium">reminder emails</span>{" "}
                      before your next billing cycle so you never miss a
                      renewal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-md border border-purple-100 mb-6">
                <p className="text-purple-900 font-medium text-center">
                  No more surprises, no more missed renewals—just seamless
                  subscription management. 🚀
                </p>
              </div>

              <div className="flex justify-center">
                <button>
                  <Auth />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
