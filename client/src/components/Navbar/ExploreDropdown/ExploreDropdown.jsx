import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCompass,
  FiBookOpen,
  FiCpu,
  FiUsers,
  FiArrowRight,
  FiLayers,
  FiFeather,
  FiMonitor,
  FiVideo,
  FiMusic,
  FiBriefcase,
  FiSmile,
} from "react-icons/fi";
import useSettingsStore from "../../../stores/useSettingsStore";

const categories = [
  {
    title: "Graphics & Design",
    desc: "Logo, brand identity, illustrations & web UI",
    icon: <FiFeather className="text-pink-500" size={18} />,
    cat: "Graphics & Design",
    search: "design",
  },
  {
    title: "Programming & Tech",
    desc: "Web development, WordPress, mobile apps & QA",
    icon: <FiMonitor className="text-blue-500" size={18} />,
    cat: "Programming & Tech",
    search: "web",
  },
  {
    title: "Digital Marketing",
    desc: "SEO, social media, ads & traffic growth",
    icon: <FiLayers className="text-emerald-500" size={18} />,
    cat: "Digital Marketing",
    search: "marketing",
  },
  {
    title: "Video & Animation",
    desc: "Video editing, explainer videos & 3D art",
    icon: <FiVideo className="text-purple-500" size={18} />,
    cat: "Video & Animation",
    search: "animation",
  },
  {
    title: "Writing & Translation",
    desc: "Articles, translations, resume & copywriting",
    icon: <FiBookOpen className="text-amber-500" size={18} />,
    cat: "Writing & Translation",
    search: "writing",
  },
  {
    title: "AI Services",
    desc: "AI artists, prompt engineering & automation",
    icon: <FiCpu className="text-teal-500" size={18} />,
    cat: "AI Services",
    search: "ai",
  },
  {
    title: "Music & Audio",
    desc: "Voice over, mixing, music production & beats",
    icon: <FiMusic className="text-red-500" size={18} />,
    cat: "Music & Audio",
    search: "music",
  },
  {
    title: "Business",
    desc: "Virtual assistants, business plans & legal",
    icon: <FiBriefcase className="text-indigo-500" size={18} />,
    cat: "Business",
    search: "business",
  },
  {
    title: "Lifestyle",
    desc: "Fitness, gaming, crafts & life coaching",
    icon: <FiSmile className="text-yellow-500" size={18} />,
    cat: "Lifestyle",
    search: "lifestyle",
  },
];

const ExploreDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useSettingsStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCategoryClick = (cat, search) => {
    onClose();
    navigate(`/gigs?cat=${encodeURIComponent(cat)}&search=${encodeURIComponent(search)}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[92vw] max-w-[940px] bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Columns: Category Grid */}
          <div className="md:col-span-2 border-r-0 md:border-r border-gray-100 md:pr-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <FiCompass className="text-primary" size={18} />
                  {t("exploreMenu.categories")}
                </h4>
                <p className="text-xs text-gray-500">
                  {t("exploreMenu.categoriesSub")}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate("/gigs");
                }}
                className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors"
              >
                <span>View all</span>
                <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.cat, cat.search)}
                  className="flex items-start gap-3 p-3 rounded-xl text-left hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all mt-0.5">
                    {cat.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {cat.title}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {cat.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Hubs & Guides */}
          <div className="flex flex-col justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-900 text-base mb-1">
                {t("exploreMenu.hubs")}
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                {t("exploreMenu.hubsSub")}
              </p>

              <div className="flex flex-col gap-3">
                <div
                  onClick={() => {
                    onClose();
                    navigate("/#projects");
                    const el = document.getElementById("projects");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <span>💡</span>
                    <span>{t("exploreMenu.discoverProjects")}</span>
                  </div>
                  <p className="text-xs text-emerald-700/80 mt-1">
                    {t("exploreMenu.discoverProjectsDesc")}
                  </p>
                </div>

                <div
                  onClick={() => {
                    onClose();
                    navigate("/gigs?search=guide");
                  }}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
                    <span>📚</span>
                    <span>{t("exploreMenu.guides")}</span>
                  </div>
                  <p className="text-xs text-blue-700/80 mt-1">
                    {t("exploreMenu.guidesDesc")}
                  </p>
                </div>

                <div
                  onClick={() => {
                    onClose();
                    navigate("/gigs?cat=AI%20Services");
                  }}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-purple-900">
                    <span>🤖</span>
                    <span>{t("exploreMenu.logoMaker")}</span>
                  </div>
                  <p className="text-xs text-purple-700/80 mt-1">
                    {t("exploreMenu.logoMakerDesc")}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate("/gigs");
              }}
              className="w-full py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t("exploreMenu.browseAll")}</span>
              <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExploreDropdown;
