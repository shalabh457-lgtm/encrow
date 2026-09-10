import React, { useEffect } from "react";
import { columns, gigCards } from "../../data/data";
import { Link } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import useAuthStore from "../../stores";
import useSettingsStore from "../../stores/useSettingsStore";

const MyGigs = () => {
  const { authUser } = useAuthStore();
  const { formatPrice } = useSettingsStore();
  const data = gigCards.map((g, idx) => ({
    _id: g.id || `gig_${idx}`,
    title: g.description,
    cover: g.img,
    price: 20 + (idx % 6) * 15,
    sales: 10 + idx * 3,
  }));

  const handleDelete = (id) => {
    // Delete logic removed for static mode
  };

  const tableActions = data?.map((item) => ({
    image: (
      <div className="w-14 h-14">
        <img
          src={item.cover}
          alt={item.title}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    ),
    title: (
      <p className="w-full flex items-center justify-start text-left">
        {item.title}
      </p>
    ),
    price: (
      <p className="w-full flex items-center justify-start font-medium">{formatPrice(item.price)}</p>
    ),
    orders: (
      <p className="w-full flex items-center justify-start">{item.sales}</p>
    ),
    actions: (
      <div
        className="w-full flex items-center justify-start text-red-500 cursor-pointer"
        onClick={() => handleDelete(item._id)}
      >
        <BsTrash size={16} />
      </div>
    ),
  }));

  return (
    <main className="py-40">
      <div className="contain">
        <div className="w-full flex flex-col items-start gap-5 justify-start">
          <div className="flex items-center justify-between w-full gap-2">
            <h2 className="text-2xl font-bold">Gigs</h2>
            <Link to="/add">
              <button className="bg-primary/80 py-3 px-2 text-white outline-none rounded-md text-sm hover:bg-primary w-fit transition-all duration-300">
                Add New Gig
              </button>
            </Link>
          </div>
            <>
              {data?.length === 0 ? (
                <div className="flex items-center justify-center mt-5 flex-col w-full">
                  <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png"
                    alt="/"
                    className="w-full md:w-[350px]"
                  />
                  <h2 className="text-4xl text-active font-medium">
                    No Orders!
                  </h2>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="h-[35px]">
                    <tr>
                      {columns &&
                        columns.map((head, i) => (
                          <th
                            key={i}
                            className="text-left text-gray-700 text-sm font-semibold leading-[18px] pb-2"
                          >
                            {head.header}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {tableActions &&
                      tableActions.map((row, i) => (
                        <tr
                          key={i}
                          className="text-sm leading-5 w-full even:bg-gray-200"
                        >
                          {columns?.map((col, i) => (
                            <td
                              key={i}
                              className="first:text-left text-sm text-darkColor font-medium text-center py-2"
                            >
                              {row[col.field]}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </>
        </div>
      </div>
    </main>
  );
};

export default MyGigs;
