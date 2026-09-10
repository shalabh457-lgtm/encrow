import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheck, FiX } from "react-icons/fi";
import { TfiWorld } from "react-icons/tfi";
import { toast } from "react-toastify";
import { languages } from "../../data/translations";
import useSettingsStore from "../../stores/useSettingsStore";

const LanguageModal = ({ show, setShow, onOpenCurrency }) => {
  const modalRef = useRef(null);
  const [search, setSearch] = useState("");
  const { currentLanguage, setLanguage, t } = useSettingsStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShow(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShow(false);
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [show, setShow]);

  if (!show) return null;

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (lang) => {
    setLanguage(lang);
    toast.success(`Language changed to ${lang.nativeName} (${lang.name})`, {
      position: "bottom-right",
      autoClose: 1500,
    });
    setShow(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2 }}
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden text-gray-800 border border-gray-100"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-primary">
                <TfiWorld size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t("modals.selectLanguage")}
                </h3>
                <p className="text-xs text-gray-500">
                  Choose your preferred language for Trust+
                </p>
              </div>
            </div>
            <button
              onClick={() => setShow(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Tab Switcher: Language vs Currency */}
          <div className="flex items-center px-6 pt-4 border-b border-gray-100 bg-gray-50/50">
            <button className="pb-3 px-4 font-semibold text-sm border-b-2 border-primary text-primary transition-all">
              Language
            </button>
            {onOpenCurrency && (
              <button
                onClick={() => {
                  setShow(false);
                  onOpenCurrency();
                }}
                className="pb-3 px-4 font-medium text-sm text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-all"
              >
                Currency
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="p-6 pb-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <FiSearch size={18} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("modals.searchLanguage")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Languages Grid */}
          <div className="px-6 py-2 max-h-[340px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage?.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-emerald-50/60 shadow-sm"
                      : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">{lang.flag}</span>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">
                        {lang.nativeName}
                      </div>
                      <div className="text-xs text-gray-500">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      <FiCheck size={14} />
                    </div>
                  )}
                </button>
              );
            })}
            {filteredLanguages.length === 0 && (
              <div className="col-span-2 py-8 text-center text-sm text-gray-400">
                No matching languages found
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 mt-2">
            <button
              onClick={() => setShow(false)}
              className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-200/60 transition-colors"
            >
              {t("modals.cancel")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LanguageModal;
