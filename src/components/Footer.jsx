import React from "react";

const Footer = ({ artist, link }) => {
  return (
    <footer className="footer sticky sm:footer-horizontal text-neutral-content items-center p-4 bottom-0 left-0 w-full z-9999 backdrop-blur-sm bg-neutral/60">
      <aside className="grid-flow-col items-center">
        <img
          src="/icons/Artfocus_logo2.png"
          alt="ArtFocus Logo"
          className="h-10 ml-2 transition-transform hover:scale-105 hover:drop-shadow-lg"
        />
        <p>© {new Date().getFullYear()} Artfocus</p>

        <div className="divider divider-horizontal"></div>

        {/* About Modal Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          About
        </button>

        {/* About Modal */}
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">About</h3>
            <p className="py-4">
              ArtFocus is a powerful web app built to help creatives stay
              inspired, organized, and in control of their projects—from concept
              to completion.
            </p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-secondary btn-outline">Close</button>
              </form>
            </div>
          </div>
        </dialog>

        {/* Support Me Modal Button */}
        <button
          className="btn btn-info btn-sm text-sm"
          onClick={() => document.getElementById("my_modal_6").showModal()}
        >
          Support me!
        </button>

        {/* Support Me Modal */}
        <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box text-center">
            <h3 className="font-bold text-lg mb-4">Support My Work</h3>
            <p className="mb-4">
              If you find ArtFocus helpful, consider supporting me through a
              small donation 💙
            </p>
            <a
              href="https://paypal.me/MalgorzataMika?country.x=AU&locale.x=en_AU"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-info"
            >
              Donate via PayPal
            </a>
            <div className="modal-action mt-6">
              <form method="dialog">
                <button className="btn btn-outline btn-info">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </aside>

      {/* Right Section */}
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <div
          className="tooltip tooltip-primary tooltip-top"
          data-tip="Github Repository"
        >
          <a
            href="https://github.com/Maggie-creator/Artfocus"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icons/github-mark-white.svg"
              alt="GitHub"
              className="w-6 h-6 hover:scale-110 transition-transform"
            />
          </a>
        </div>

        <span className="badge badge-soft badge-lg text-sm">
          Background image by:
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary ml-1"
          >
            {artist}
          </a>
        </span>
      </nav>
    </footer>
  );
};

export default Footer;
