import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCreditCard,
  FiPlus,
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiX,
  FiSmartphone,
  FiShield,
} from "react-icons/fi";
import useSettingsStore from "../../../stores/useSettingsStore";

const quickAmounts = [100, 500, 1000, 2000, 5000];

const recentTransactions = [
  {
    id: 1,
    type: "credit",
    title: "Added via UPI",
    amount: "+₹500",
    time: "2 hours ago",
    icon: <FiArrowDownLeft className="text-emerald-500" />,
  },
  {
    id: 2,
    type: "debit",
    title: "Order #1234",
    amount: "-₹1,200",
    time: "Yesterday",
    icon: <FiArrowUpRight className="text-red-400" />,
  },
  {
    id: 3,
    type: "credit",
    title: "Added via Card",
    amount: "+₹2,000",
    time: "3 days ago",
    icon: <FiArrowDownLeft className="text-emerald-500" />,
  },
];

const WalletDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { currentCurrency } = useSettingsStore();
  const [view, setView] = useState("main"); // main | addMoney | upi | card
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    setView("main");
    setAmount("");
    setUpiId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");
    setProcessing(false);
    setSuccess(false);
    onClose();
  };

  const handlePay = (method) => {
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setView("main");
        setAmount("");
        setUpiId("");
        setCardNumber("");
        setCardExpiry("");
        setCardCvv("");
        setCardName("");
      }, 1800);
    }, 2000);
  };

  if (!isOpen) return null;

  const renderMain = () => (
    <motion.div
      key="main"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.15 }}
    >
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-5 text-white mb-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <p className="text-emerald-100 text-xs font-medium tracking-wide uppercase mb-1">
          Available Balance
        </p>
        <h3 className="text-2xl font-bold tracking-tight">
          {currentCurrency?.symbol || "₹"}3,250.00
        </h3>
        <div className="flex items-center gap-1 mt-2 text-emerald-200 text-[11px]">
          <FiShield size={12} />
          <span>Secure Wallet</span>
        </div>
      </div>

      {/* Add Money Button */}
      <button
        onClick={() => setView("addMoney")}
        className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-3 rounded-xl transition-all text-sm mb-4 border border-primary/20 hover:border-primary/30"
      >
        <FiPlus size={16} />
        <span>Add Money to Wallet</span>
      </button>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Recent Activity
          </h4>
          <button className="text-[11px] text-primary font-semibold hover:text-primary/80 transition-colors">
            View All
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {recentTransactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {txn.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {txn.title}
                  </p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <FiClock size={10} />
                    {txn.time}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${
                  txn.type === "credit" ? "text-emerald-500" : "text-red-400"
                }`}
              >
                {txn.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderAddMoney = () => (
    <motion.div
      key="addMoney"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
    >
      <button
        onClick={() => setView("main")}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm mb-4 font-medium"
      >
        <FiArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Amount Input */}
      <div className="mb-5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
          Enter Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
            {currentCurrency?.symbol || "₹"}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-3.5 text-xl font-bold text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Quick Amount Chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(String(amt))}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                amount === String(amt)
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {currentCurrency?.symbol || "₹"}{amt.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
          Choose Payment Method
        </label>
        <div className="flex flex-col gap-2.5">
          {/* UPI Option */}
          <button
            onClick={() => setView("upi")}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <FiSmartphone size={20} />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
                UPI Payment
              </p>
              <p className="text-[11px] text-gray-400">
                Google Pay, PhonePe, Paytm & more
              </p>
            </div>
            <FiArrowUpRight
              className="text-gray-300 group-hover:text-primary transition-colors"
              size={16}
            />
          </button>

          {/* Card Option */}
          <button
            onClick={() => setView("card")}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
              <FiCreditCard size={20} />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
                Debit / Credit Card
              </p>
              <p className="text-[11px] text-gray-400">
                Visa, Mastercard, RuPay
              </p>
            </div>
            <FiArrowUpRight
              className="text-gray-300 group-hover:text-primary transition-colors"
              size={16}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderUpi = () => (
    <motion.div
      key="upi"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <FiCheck className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Payment Successful!</h3>
          <p className="text-sm text-gray-500 mt-1">
            {currentCurrency?.symbol || "₹"}{parseFloat(amount).toLocaleString()} added to wallet
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setView("addMoney")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm mb-4 font-medium"
          >
            <FiArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3 mb-5 p-3 bg-purple-50 rounded-xl border border-purple-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <FiSmartphone size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">UPI Payment</p>
              <p className="text-xs text-gray-500">
                Adding {currentCurrency?.symbol || "₹"}
                {amount ? parseFloat(amount).toLocaleString() : "0"}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Enter UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="w-full px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
            <div className="flex items-center gap-4 mt-3">
              {["@ybl", "@paytm", "@okaxis"].map((suffix) => (
                <button
                  key={suffix}
                  onClick={() => setUpiId((prev) => {
                    const base = prev.split("@")[0];
                    return base + suffix;
                  })}
                  className="text-[11px] font-semibold text-primary/70 hover:text-primary bg-primary/5 px-2.5 py-1 rounded-md transition-colors"
                >
                  {suffix}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handlePay("upi")}
            disabled={!amount || !upiId || processing}
            className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              !amount || !upiId || processing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 shadow-sm"
            }`}
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiShield size={14} />
                <span>
                  Pay {currentCurrency?.symbol || "₹"}
                  {amount ? parseFloat(amount).toLocaleString() : "0"}
                </span>
              </>
            )}
          </button>
        </>
      )}
    </motion.div>
  );

  const renderCard = () => (
    <motion.div
      key="card"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <FiCheck className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Payment Successful!</h3>
          <p className="text-sm text-gray-500 mt-1">
            {currentCurrency?.symbol || "₹"}{parseFloat(amount).toLocaleString()} added to wallet
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setView("addMoney")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm mb-4 font-medium"
          >
            <FiArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3 mb-5 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
              <FiCreditCard size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Card Payment</p>
              <p className="text-xs text-gray-500">
                Adding {currentCurrency?.symbol || "₹"}
                {amount ? parseFloat(amount).toLocaleString() : "0"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 mb-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const formatted = val.replace(/(.{4})/g, "$1 ").trim();
                  setCardNumber(formatted);
                }}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all tracking-wider"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Expiry
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
                    setCardExpiry(val);
                  }}
                  placeholder="MM/YY"
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  CVV
                </label>
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) =>
                    setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  placeholder="•••"
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => handlePay("card")}
            disabled={
              !amount || !cardNumber || !cardExpiry || !cardCvv || !cardName || processing
            }
            className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              !amount || !cardNumber || !cardExpiry || !cardCvv || !cardName || processing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 shadow-sm"
            }`}
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiShield size={14} />
                <span>
                  Pay {currentCurrency?.symbol || "₹"}
                  {amount ? parseFloat(amount).toLocaleString() : "0"}
                </span>
              </>
            )}
          </button>
        </>
      )}
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute top-12 right-0 w-[360px] bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 p-5 z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <FiCreditCard className="text-primary" size={15} />
            </div>
            My Wallet
          </h3>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === "main" && renderMain()}
          {view === "addMoney" && renderAddMoney()}
          {view === "upi" && renderUpi()}
          {view === "card" && renderCard()}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletDropdown;
