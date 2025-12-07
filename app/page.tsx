import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Logo placeholder */}
            <div className="mb-8">
              <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight mb-4">
                Hidden Treasures
              </h1>
              <h2 className="font-heading text-4xl md:text-6xl font-semibold text-primary-200">
                Network
              </h2>
            </div>

            {/* Mission Statement */}
            <p className="text-xl md:text-2xl font-medium text-primary-50 max-w-3xl mx-auto leading-relaxed">
              Connecting aviation and STEM education organizations worldwide to share resources,
              amplify impact, and empower underserved youth.
            </p>

            {/* Impact Goal */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
              <p className="text-lg text-primary-100 mb-2">Our Mission Goal</p>
              <p className="font-display text-7xl md:text-8xl font-bold text-accent-gold mb-2">
                1,000,000
              </p>
              <p className="text-2xl font-semibold">Lives Impacted by 2030</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/join"
                className="px-8 py-4 bg-accent-gold hover:bg-accent-gold/90 text-navy-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                Join the Network
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg transition-all border-2 border-white/30 text-lg"
              >
                Learn More
              </Link>
            </div>

            {/* Parent Organization */}
            <div className="pt-12 border-t border-white/20">
              <p className="text-sm text-primary-200 mb-2">Powered by</p>
              <p className="text-xl font-semibold">
                Infinity Aero Club Tampa Bay, Inc.
              </p>
              <p className="text-sm text-primary-200">501(c)(3) Nonprofit Organization</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-navy-900 mb-4">
            Building a Global Movement
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Connect with organizations, mentors, and students dedicated to aviation and STEM education
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { label: 'Organizations', value: '---', color: 'primary' },
              { label: 'Mentors', value: '---', color: 'navy' },
              { label: 'Students', value: '---', color: 'primary' },
              { label: 'Sponsors', value: '---', color: 'navy' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md hover:shadow-xl transition-shadow"
              >
                <p className={`font-display text-6xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.value}
                </p>
                <p className="text-gray-700 font-semibold text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8">
            Led by Experience
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-accent-gold mb-2">
              Ricardo &quot;Tattoo&quot; Foster
            </h3>
            <p className="text-lg text-primary-300 mb-4">
              LCDR USN (Ret.) - Founder & CEO
            </p>
            <p className="text-gray-300 leading-relaxed">
              Leading the mission to empower underserved youth through aviation, STEM, and
              entrepreneurship education. Building a global network of organizations committed
              to creating opportunities and changing lives.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-200">
            &copy; {new Date().getFullYear()} Hidden Treasures Network. All rights reserved.
          </p>
          <p className="text-sm text-primary-300 mt-2">
            A project of Infinity Aero Club Tampa Bay, Inc. - 501(c)(3) Nonprofit
          </p>
        </div>
      </footer>
    </main>
  )
}
