import React, { useEffect, useMemo, useRef, useState } from "react";
import { TfiWorld } from "react-icons/tfi";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiArrowRight } from "react-icons/fi";
import useSettingsStore from "../../../stores/useSettingsStore";

const mobileCategories = [
  "Graphics & Design",
  "Programming & Tech",
  "Digital Marketing",
  "Video & Animation",
  "Writing & Translation",
  "AI Services",
  "Music & Audio",
  "Business",
  "Lifestyle",
];

const MobileSidebar = ({
  show,
  setShow,
  setLoginModal,
  setShowLanguageModal,
  setShowCurrencyModal,
}) => {
  const variants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
  };
  const showRef = useRef(null);
  const navigate = useNavigate();
  const [exploreOpen, setExploreOpen] = useState(false);
  const { currentLanguage, currentCurrency, t } = useSettingsStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showRef.current && !showRef.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShow]);

  const body = document.querySelector("html");

  const overflowHidden = () => {
    if (show) {
      return (body.style.overflow = "hidden");
    } else {
      return {
        body: {
          one: (body.style.overflowY = "auto"),
          two: (body.style.overflowX = "hidden"),
        },
      };
    }
  };
  useMemo(() => overflowHidden(), [show]);

  const handleCategoryNav = (cat) => {
    setShow(false);
    navigate(`/gigs?cat=${encodeURIComponent(cat)}`);
  };

  return (
    <div
      className={`w-full h-full bg-black/40 fixed top-0 z-40 left-0 transition-all duration-500 ${
        show ? "flex" : "hidden"
      }`}
    >
      <motion.div
        animate={show ? "open" : "closed"}
        variants={variants}
        ref={showRef}
        className={`flex flex-col gap-4 justify-start items-start w-[280px] bg-white absolute top-0 z-20 h-screen p-6 overflow-y-auto ${
          show ? "left-0" : "-left-[100vw]"
        }`}
      >
        <div className="sticky top-0 z-10 bg-white w-full flex flex-col gap-4 items-start justify-start pb-2 border-b">
          <NavLink
            to="/join"
            onClick={() => setShow(false)}
            className={`w-full text-center border py-2.5 px-6 rounded bg-primary border-primary text-white transition-all duration-300 text-sm font-semibold`}
          >
            {t("navbar.join")} Trust+
          </NavLink>
          <div
            onClick={() => {
              navigate("/");
              setShow(false);
              setLoginModal(true);
            }}
            className="cursor-pointer text-gray-600 hover:text-primary text-sm font-medium"
          >
            {t("navbar.signIn")}
          </div>
        </div>

        {/* Explore Accordion */}
        <div className="w-full flex flex-col">
          <button
            onClick={() => setExploreOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-gray-700 hover:text-primary text-base font-semibold py-2 transition-colors"
          >
            <span>{t("navbar.explore")}</span>
            {exploreOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </button>

          <AnimatePresence>
            {exploreOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col gap-2 pl-3 py-2 border-l-2 border-primary/30 my-1"
              >
                {mobileCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCategoryNav(cat)}
                    className="text-xs font-medium text-gray-600 hover:text-primary cursor-pointer py-1 flex items-center justify-between group"
                  >
                    <span>{cat}</span>
                    <FiArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust+ Business */}
        <button
          onClick={() => {
            setShow(false);
            navigate("/");
            setTimeout(() => {
              const el = document.getElementById("business");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="text-base font-semibold text-gray-700 hover:text-primary transition-colors text-left"
        >
          {t("navbar.business")}
        </button>

        {/* Settings: Language & Currency */}
        <div className="mt-auto border-t w-full flex items-start justify-start flex-col gap-3 pt-4">
          <p
            onClick={() => {
              setShow(false);
              navigate("/");
            }}
            className="cursor-pointer text-gray-600 hover:text-primary text-sm font-medium"
          >
            Home
          </p>

          {/* Language Selector in Mobile */}
          <button
            onClick={() => {
              setShow(false);
              if (setShowLanguageModal) setShowLanguageModal(true);
            }}
            className="cursor-pointer text-gray-700 hover:text-primary text-sm font-medium flex items-center justify-between w-full py-1.5 px-2 rounded-lg bg-gray-50 border border-gray-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <TfiWorld className="text-primary" />
              <span>{currentLanguage?.nativeName || "English"}</span>
            </span>
            <span className="text-xs text-gray-400">Change</span>
          </button>

          {/* Currency Selector in Mobile */}
          <button
            onClick={() => {
              setShow(false);
              if (setShowCurrencyModal) setShowCurrencyModal(true);
            }}
            className="cursor-pointer text-gray-700 hover:text-primary text-sm font-medium flex items-center justify-between w-full py-1.5 px-2 rounded-lg bg-gray-50 border border-gray-100 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-primary">{currentCurrency?.symbol}</span>
              <span>{currentCurrency?.code}</span>
            </span>
            <span className="text-xs text-gray-400">Change</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileSidebar;
