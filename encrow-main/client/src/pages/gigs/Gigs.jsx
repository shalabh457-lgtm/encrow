import React, { useRef, useState, useEffect } from "react";
import { BiHomeAlt, BiChevronDown } from "react-icons/bi";
import GigsCards from "../../components/GigsContents/GigsCards/GigsCards";
import loader from "../../assets/icons/loader.svg";
import { useLocation } from "react-router-dom";
import useSettingsStore from "../../stores/useSettingsStore";
import { gigCards } from "../../data/data";

const Gigs = () => {
  const { search } = useLocation();
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("sales");
  const { currentCurrency } = useSettingsStore();
  const minRef = useRef();
  const maxRef = useRef();
  const reSort = (types) => {
    setSort(types);
    setOpen(false);
  };

  const searchParams = new URLSearchParams(search);
  const catParam = searchParams.get("cat") || "";
  const queryParam = searchParams.get("search") || "";
  const pageTitle = catParam || queryParam || "All Gigs & Services";
  const pageSubtitle = catParam
    ? `Find top freelance experts in ${catParam} to help scale your business`
    : queryParam
    ? `Explore top freelance services matching "${queryParam}"`
    : "Find high-quality freelance services and talent for your business";

  const isLoading = false;
  const data = null;

  useEffect(() => {
    // refetch logic removed
  }, [sort, search]);

  const apply = () => {
    // apply logic removed
  };

  // Prepare fallback data if API returns error or no items
  const fallbackGigs = gigCards.map((g, idx) => ({
    _id: g.id || `gig_${idx}`,
    title: g.description,
    desc: g.description,
    cover: g.img,
    price: 20 + (idx % 6) * 15,
    sales: 10 + idx * 3,
    totalStars: 5 * 20,
    starNumber: 20,
    username: g.username,
    cat: catParam || "General",
    userId: `user_${idx + 1}`,
  }));

  const displayGigs = (data && data.length > 0) ? data : fallbackGigs;

  return (
    <main className="py-40">
      <div className="contain">
        <div className="flex items-start justify-start flex-col gap-4">
          <div className="flex items-center justify-start gap-2 sm:gap-4 text-darkColor font-medium">
            <span>
              <BiHomeAlt size={12} />
            </span>
            <span>/</span>
            <span className="text-sm">Services</span>
            <span>/</span>
            <span className="text-sm font-bold text-primary">
              {pageTitle}
            </span>
          </div>
          <h2 className="text-3xl font-bold">{pageTitle}</h2>
          <p className="text-base font-medium text-gray-500">
            {pageSubtitle}
          </p>
          <div className="w-full flex md:items-center justify-between flex-col md:flex-row gap-4">
            <div className="flex md:items-center items-start justify-start gap-2 flex-col md:flex-row">
              <p className="text-base font-normal text-gray-500">Budget:</p>
              <div className="flex items-center justify-start gap-2 w-full">
                <input
                  type="text"
                  ref={minRef}
                  placeholder={`min (${currentCurrency?.symbol || "$"})`}
                  className="border w-[50%] md:w-[150px] outline-none px-2 h-[40px] rounded-md text-gray-500"
                />
                <input
                  type="text"
                  placeholder={`max (${currentCurrency?.symbol || "$"})`}
                  ref={maxRef}
                  className="border w-[50%] md:w-[150px] outline-none px-2 h-[40px] rounded-md text-gray-500"
                />
                <button
                  onClick={apply}
                  className="w-fit bg-primary text-white text-base font-medium py-2 px-7 outline-none rounded-md hover:bg-primary/95 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-2">
              <p className="text-base font-normal text-gray-500">Sort by:</p>
              <div className="flex items-center justify-start gap-2 cursor-pointer relative">
                <div
                  className="flex items-center justify-start gap-2 cursor-pointer relative px-2 h-[40px] rounded-md text-gray-500 border w-[45%] md:w-fit"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <p className="text-sm w-full">
                    {sort == "sales" ? "Best Selling" : "Newest"}
                  </p>
                  <span
                    className={`${
                      open ? "rotate-180" : "rotate-0"
                    } transition-all duration-300`}
                  >
                    <BiChevronDown size={20} />
                  </span>
                </div>
                <div
                  className={`${
                    open ? "flex" : "hidden"
                  } flex-col items-start justify-start bg-white shadow-box rounded-md absolute w-[140px] top-8 right-2 z-10`}
                >
                  {sort === "sales" ? (
                    <div
                      onClick={() => reSort("createdAt")}
                      className="px-4 py-2 w-full border-b text-gray-500 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      Newest
                    </div>
                  ) : (
                    <div
                      onClick={() => reSort("sales")}
                      className="px-4 py-2 w-full border-b text-gray-500 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      Best Selling
                    </div>
                  )}
                  <span
                    className="px-4 py-2 w-full border-b text-gray-500 text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => reSort("sales")}
                  >
                    Popular
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`w-full grid-cols-1 sm:grid-cols-2 tab:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-8 grid`}
          >
            {displayGigs.length === 0 ? (
              <div className="flex items-center justify-center mt-5 flex-col w-full col-span-4">
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png"
                  alt="/"
                  className="w-[350px]"
                />
                <h2 className="text-2xl md:text-4xl text-active font-medium text-center">
                  Oops!🤷‍♂️ No Result
                </h2>
              </div>
            ) : (
              displayGigs.map((item) => (
                <GigsCards key={item._id} item={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Gigs;
