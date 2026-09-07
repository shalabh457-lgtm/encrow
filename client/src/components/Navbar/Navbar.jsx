import React, { useState, useEffect, useRef } from "react";
import { TfiWorld } from "react-icons/tfi";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Login from "../../pages/login/Login";
import useAuthStore from "../../stores";
import useSettingsStore from "../../stores/useSettingsStore";
import Avatar from "../../assets/icons/avatar.jpg";
import { toast } from "react-toastify";
import { Axios } from "../../config";
import requests from "../../libs/request";
import { FiChevronRight } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import MobileSidebar from "./MobileSidebar/MobileSidebar";
import ExploreDropdown from "./ExploreDropdown/ExploreDropdown";
import LanguageModal from "../Modals/LanguageModal";
import CurrencyModal from "../Modals/CurrencyModal";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, removeAuthUser } = useAuthStore();
  const { currentLanguage, currentCurrency, t } = useSettingsStore();
  const [active, setActive] = useState(false);
  const [openDrop, setOpenDrop] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const { pathname } = useLocation();
  const [loginModal, setLoginModal] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenDrop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const backgroundChange = () => {
      window.scrollY > 0 ? setActive(true) : setActive(false);
    };
    window.addEventListener("scroll", backgroundChange);
    return () => {
      window.removeEventListener("scroll", backgroundChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await Axios.post(requests.logout);
      removeAuthUser();
      toast.success("Logout Successfully", {
        position: "bottom-right",
        toastId: 1,
        autoClose: 1000,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const links = [
    "Graphics & Design",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Business",
    "Lifestyle",
    "AI Services",
  ];

  const slideRight = () => {
    let slider = document.getElementById("navSlider");
    let maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    if (slider.scrollLeft < maxScrollLeft) {
      slider.scrollLeft = slider.scrollLeft + 400;
    } else {
      slider.scrollLeft = 0;
    }
  };

  return (
    <header
      className={`flex items-center justify-center w-full flex-col text-white fixed top-0 transition-all ease-in-out z-20 ${
        active || pathname !== "/" ? "bg-white !text-darkColor shadow-sm" : ""
      }`}
    >
      <div className="contain">
        <div className="w-full flex items-center justify-between py-4 relative">
          <MobileSidebar
            show={showLink}
            setShow={setShowLink}
            setLoginModal={setLoginModal}
            setShowLanguageModal={setShowLanguageModal}
            setShowCurrencyModal={setShowCurrencyModal}
          />
          <div className="flex items-center gap-2 h-full justify-between w-[50%] sm:w-fit">
            <span onClick={() => setShowLink(true)} className="lg:hidden mt-1 cursor-pointer">
              <FaBars size={25} />
            </span>
            <Link
              to="/"
              className="text-4xl select-none font-black tracking-tighter"
            >
              <span>Trust+</span>
              <span className="text-primary">.</span>
            </Link>
          </div>
          <nav className="flex items-center justify-end gap-7 font-medium text-base">
            <button
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const el = document.getElementById("business");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="cursor-pointer hidden lg:flex hover:text-primary transition-colors bg-transparent border-0 font-medium text-base p-0"
            >
              {t("navbar.business")}
            </button>

            {/* Explore Dropdown Button */}
            <div className="relative">
              <div
                onClick={() => setShowExplore((prev) => !prev)}
                className={`cursor-pointer hidden lg:flex items-center gap-1 hover:text-primary transition-colors py-1 select-none font-medium ${
                  showExplore ? "text-primary" : ""
                }`}
              >
                <span>{t("navbar.explore")}</span>
              </div>
              <ExploreDropdown
                isOpen={showExplore}
                onClose={() => setShowExplore(false)}
              />
            </div>

            {/* Language Selector Button */}
            <div
              onClick={() => setShowLanguageModal(true)}
              className="items-center gap-2 cursor-pointer hidden lg:flex hover:text-primary transition-colors py-1 select-none"
              title="Change Language"
            >
              <span>
                <TfiWorld />
              </span>
              <span>{currentLanguage?.nativeName || "English"}</span>
            </div>

            {/* Currency Selector Button */}
            <span
              onClick={() => setShowCurrencyModal(true)}
              className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-primary transition-colors py-1 select-none"
              title="Change Currency"
            >
              <span className="font-bold">{currentCurrency?.symbol}</span>
              <span>{currentCurrency?.code}</span>
            </span>

            {!authUser?.isSeller && (
              <NavLink
                to="/join"
                className="cursor-pointer hidden lg:flex hover:text-primary transition-colors"
              >
                {t("navbar.becomeSeller")}
              </NavLink>
            )}

            {authUser ? (
              <>
                <div
                  className="relative flex flex-col sm:flex-row items-center sm:gap-4 cursor-pointer"
                  onClick={() => setOpenDrop((prev) => !prev)}
                >
                  <img
                    src={authUser.img || Avatar}
                    alt="user_image"
                    className="w-[32px] h-[32px] rounded-[50%] object-cover"
                  />
                  <span>{authUser?.username}</span>
                  <div
                    ref={modalRef}
                    className={`absolute top-12 right-0 p-3 z-10 bg-white border rounded-md text-black flex-col items-start gap-3 w-[200px] font-medium transition-transform duration-300 ${
                      openDrop ? "flex" : "hidden"
                    }`}
                  >
                    {authUser?.isSeller && (
                      <>
                        <NavLink
                          to="/myGigs"
                          className="cursor-pointer w-full text-sm text-darkColor"
                        >
                          {t("navbar.myGigs")}
                        </NavLink>
                        <NavLink
                          to="/add"
                          className="cursor-pointer w-full text-sm text-darkColor"
                        >
                          {t("navbar.addGig")}
                        </NavLink>
                      </>
                    )}
                    <NavLink
                      to="/orders"
                      className="cursor-pointer w-full text-sm text-darkColor"
                    >
                      {t("navbar.orders")}
                    </NavLink>
                    <NavLink
                      to="/messages"
                      className="cursor-pointer w-full text-sm text-darkColor"
                    >
                      {t("navbar.messages")}
                    </NavLink>
                    <div
                      onClick={handleLogout}
                      className="cursor-pointer w-full text-sm text-darkColor"
                    >
                      {t("navbar.logout")}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={() => {
                    navigate("/");
                    setLoginModal(true);
                  }}
                  className="cursor-pointer hidden sm:flex hover:text-primary transition-colors"
                >
                  {t("navbar.signIn")}
                </div>
                <NavLink
                  to="/join"
                  className={`border py-2 px-5 rounded hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 text-sm font-semibold ${
                    active ? "text-primary border-primary" : ""
                  }`}
                >
                  {t("navbar.join")}
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>

      <div
        className={`w-full transition-all duration-300 border-b ${
          active || pathname !== "/" ? "flex" : "hidden"
        }`}
      >
        <hr className="border-black" />
        <div className="contain relative">
          <div
            id={"navSlider"}
            className={`w-full inline-block h-full whitespace-nowrap scroll-smooth lg:flex items-center lg:justify-between py-3 overflow-x-auto gap-5 font-medium scrollbar-hide text-sm relative ${
              active || pathname !== "/" ? "!text-gray-500" : "text-gray-200"
            }`}
          >
            {links.map((item, i) => (
              <span
                key={i}
                onClick={() => navigate(`/gigs?cat=${encodeURIComponent(item)}`)}
                className="hover:border-b-2 cursor-pointer transition-[border] h-8 scrollbar-hide border-primary mx-4 first:ml-0 lg:mx-0"
              >
                {item}
              </span>
            ))}
          </div>
          <span
            onClick={slideRight}
            className="absolute z-10 top-3 -right-8 cursor-pointer laptop:hidden"
          >
            <FiChevronRight size={20} />
          </span>
        </div>
      </div>

      <Login show={loginModal} setShow={setLoginModal} />
      <LanguageModal
        show={showLanguageModal}
        setShow={setShowLanguageModal}
        onOpenCurrency={() => setShowCurrencyModal(true)}
      />
      <CurrencyModal
        show={showCurrencyModal}
        setShow={setShowCurrencyModal}
        onOpenLanguage={() => setShowLanguageModal(true)}
      />
    </header>
  );
};

export default Navbar;
