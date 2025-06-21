// Footer.jsx
import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Footer = ({ artist, link }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Optional: send data to FormSubmit (or any backend)
    await fetch("https://formsubmit.co/ajax/artfocus.app@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsSubmitted(true);
  };

  return (
    <footer className="footer sticky sm:footer-horizontal text-neutral-content items-center p-4 bottom-0 left-0 w-full z-[9999] backdrop-blur-sm bg-neutral/60">
      <aside className="grid-flow-col items-center">
        <img
          src="/icons/Artfocus_logo2.png"
          alt="ArtFocus Logo"
          className="h-10 ml-2 transition-transform hover:scale-105 hover:drop-shadow-lg"
        />
        <p>© {new Date().getFullYear()} Artfocus</p>

        <div className="divider divider-horizontal"></div>

        {/* About Button */}
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

        {/* Support Me Button */}
        <button
          className="btn btn-info btn-sm text-xs"
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

        {/* Contact Me Button */}
        <button
          className="btn btn-accent btn-sm text-xs"
          onClick={() => {
            setIsSubmitted(false);
            document.getElementById("contact_modal").showModal();
          }}
        >
          Contact me!
        </button>

        {/* Contact Modal */}
        <dialog
          id="contact_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            {!isSubmitted ? (
              <>
                <h3 className="font-bold text-lg text-center">Contact Me</h3>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 mt-4"
                >
                  <div>
                    <label htmlFor="name" className="sr-only">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your Name"
                      required
                      className="input input-bordered w-full"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Your Email"
                      required
                      className="input input-bordered w-full"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">Your Message</label>
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Your Message"
                      required
                      className="textarea textarea-bordered w-full"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-accent">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h3 className="font-bold text-lg mb-4">Thank You!</h3>
                <p className="mb-6">Your message has been sent successfully.</p>
                <DotLottieReact
                  src="https://lottie.host/a84b6f99-a311-4bde-acb4-12207a617a64/sx3H92ea39.lottie"
                  loop
                  autoplay
                  style={{ width: "300px", height: "300px", margin: "0 auto" }}
                />
              </div>
            )}

            <div className="modal-action mt-6">
              <form method="dialog">
                <button className="btn btn-outline btn-accent">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </aside>

      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
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
      </div>
    </footer>
  );
};

export default Footer;
