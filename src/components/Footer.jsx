import { Link } from "react-router-dom";
import {
  BookOpen,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 text-base-content">
      <div className="container mx-auto px-4 py-10">
        <div className="footer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">BookCourier</span>
            </div>
            <p className="text-base-content/70 mb-4 max-w-xs">
              Your trusted library-to-home book delivery service. Bringing
              knowledge to your doorstep.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <span className="footer-title text-lg font-semibold mb-4">
              Quick Links
            </span>
            <ul className="menu menu-compact gap-1">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className="hover:text-primary transition-colors"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/my-orders"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <span className="footer-title text-lg font-semibold mb-4">
              Contact Us
            </span>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-base-content/70">Email</p>
                  <a
                    href="mailto:support@bookcourier.com"
                    className="hover:text-primary transition-colors"
                  >
                    support@bookcourier.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-base-content/70">Phone</p>
                  <a
                    href="tel:+8801234567890"
                    className="hover:text-primary transition-colors"
                  >
                    +880 1234-567890
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-base-content/70">Address</p>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-base-content/10">
        <div className="container mx-auto px-4 py-6">
          <div className="footer-center text-center">
            <p className="text-base-content/70">
              © {currentYear} BookCourier. All rights reserved.
            </p>
            <p className="text-base-content/60 mt-2">
              Made with <span className="text-red-500">❤️</span> in Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
