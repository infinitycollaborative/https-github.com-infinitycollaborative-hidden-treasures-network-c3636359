import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Aviation background pattern"
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 to-gray-900/98" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          {/* About */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-4 text-aviation-gold">Hidden Treasures Network</h3>
            <p className="text-lg text-gray-200 leading-relaxed mb-4">
              Aviation & STEM Education
            </p>
            <p className="text-base text-gray-300 leading-relaxed mb-6">
              A global platform connecting aviation and STEM education organizations, mentors,
              students, and sponsors under a unified mission to impact one million lives by 2030.
            </p>
            <p className="text-base text-gray-300 leading-relaxed">
              <span className="font-semibold text-white">Infinity Aero Club Tampa Bay, Inc.</span> (501(c)(3))
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-xl font-semibold mb-5 text-white">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/events/tour" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  Hidden Treasures Tour
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  Impact
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved Links */}
          <div>
            <h4 className="text-xl font-semibold mb-5 text-white">Get Involved</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/get-involved/students" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="/get-involved/mentors" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  For Mentors
                </Link>
              </li>
              <li>
                <Link href="/get-involved/organizations" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  For Organizations
                </Link>
              </li>
              <li>
                <Link href="/get-involved/sponsors" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  For Sponsors
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  Media & Press
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-300 hover:text-aviation-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Partnership Info */}
        <div className="py-8 border-t border-gray-700 mb-8">
          <div className="text-center">
            <p className="text-lg text-gray-200 leading-relaxed max-w-4xl mx-auto">
              Founded in partnership with executive leadership at{' '}
              <span className="text-aviation-gold font-semibold">Infinity Aero Club Tampa Bay</span>{' '}
              and proudly sponsored by{' '}
              <span className="text-aviation-gold font-semibold">Gleim Aviation</span>.
              Together, we are committed to empowering underserved youth through aviation and STEM education.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-base mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Hidden Treasures Network. All rights reserved.
            </p>
            <div className="flex space-x-8 text-base">
              <Link href="/privacy" className="text-gray-400 hover:text-aviation-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-aviation-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
