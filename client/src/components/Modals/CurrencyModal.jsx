import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheck, FiX } from "react-icons/fi";
import { BsCurrencyExchange } from "react-icons/bs";
import { toast } from "react-toastify";
import { currencies } from "../../data/currencies";
import useSettingsStore from "../../stores/useSettingsStore";

const CurrencyModal = ({ show, setShow, onOpenLanguage }) => {
  const modalRef = useRef(null);
  const [search, setSearch] = useState("");
  const { currentCurrency, setCurrency, t } = useSettingsStore();

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

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (curr) => {
    setCurrency(curr);
    toast.success(`Currency set to ${curr.symbol} ${curr.code} (${curr.name})`, {
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
                <BsCurrencyExchange size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t("modals.selectCurrency")}
                </h3>
                <p className="text-xs text-gray-500">
                  Gig prices will dynamically convert to your selected currency
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
            {onOpenLanguage && (
              <button
                onClick={() => {
                  setShow(false);
                  onOpenLanguage();
                }}
                className="pb-3 px-4 font-medium text-sm text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-all"
              >
                Language
              </button>
            )}
            <button className="pb-3 px-4 font-semibold text-sm border-b-2 border-primary text-primary transition-all">
              Currency
            </button>
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
                placeholder={t("modals.searchCurrency")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Currencies Grid */}
          <div className="px-6 py-2 max-h-[340px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredCurrencies.map((curr) => {
              const isSelected = currentCurrency?.code === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => handleSelect(curr)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-emerald-50/60 shadow-sm"
                      : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">{curr.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900">
                        <span>{curr.code}</span>
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {curr.symbol}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">
                        {curr.name}
                      </div>
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
            {filteredCurrencies.length === 0 && (
              <div className="col-span-2 py-8 text-center text-sm text-gray-400">
                No matching currencies found
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 mt-2">
            <div className="text-xs text-gray-500">
              Active: <span className="font-semibold text-gray-800">{currentCurrency.symbol} {currentCurrency.code}</span>
              {currentCurrency.code !== "USD" && (
                <span className="ml-1 text-[11px] text-gray-400">
                  (1 USD ≈ {currentCurrency.rate} {currentCurrency.code})
                </span>
              )}
            </div>
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

export default CurrencyModal;
