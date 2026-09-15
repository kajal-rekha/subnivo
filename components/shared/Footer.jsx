import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-light/10">
      <div className="wrapper">
        {/*============= Main Footer ================*/}
        <div className="flex flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-0">
          {/*============= Brand ================*/}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-light">
              Subnivo
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-light/45">
              Simple subscription management for modern businesses.
            </p>
          </div>

          {/*============= Links ================*/}
          <div>
            <h3 className="text-sm font-semibold text-light">Quick Links</h3>

            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-light/50">
              <li>
                <Link
                  href="/plans"
                  className="transition-colors hover:text-light"
                >
                  Plans
                </Link>
              </li>

              <li>
                <a
                  href="/dashboard"
                  className="transition-colors hover:text-light"
                >
                  Dashboard
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="transition-colors hover:text-light"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/*============= Bottom ================*/}
        <div className="flex flex-col gap-2 border-t border-light/10 px-6 py-5 text-xs text-light/40 md:flex-row md:items-center md:justify-between md:px-0">
          <p>&copy; {new Date().getFullYear()} Subnivo. All rights reserved.</p>

          <p>Built with care for modern businesses.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
