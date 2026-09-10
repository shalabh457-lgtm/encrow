import React from "react";
import { MdMail } from "react-icons/md";
import { ordersColumns, tableData } from "../../data/data";
import useAuthStore from "../../stores";
import useSettingsStore from "../../stores/useSettingsStore";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { authUser } = useAuthStore();
  const { formatPrice } = useSettingsStore();
  const navigate = useNavigate();

  const data = tableData;

  const handleContact = async (order) => {
    navigate(`/messages/123`);
  };

  const tableActions = data?.map((item) => ({
    image: (
      <div className="w-14 h-14">
        <img
          src={item.img}
          alt={item.username}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    ),
    title: (
      <p className="w-full flex items-center justify-start">{item.title}</p>
    ),
    price: (
      <p className="w-full flex items-center justify-start font-medium">{formatPrice(item.price)}</p>
    ),
    actions: (
      <div
        className="w-8 h-8 cursor-pointer bg-blue-600 rounded-full flex items-center justify-center text-white"
        onClick={() => handleContact(item)}
      >
        <MdMail size={18} />
      </div>
    ),
  }));

  return (
    <main className="py-40">
      <div className="contain">
        <div className="w-full flex flex-col items-start gap-5 justify-start">
          <div className="flex items-center justify-between w-full gap-2">
            <h2 className="text-2xl font-bold">Orders</h2>
          </div>
            <>
              {data?.length === 0 ? (
                <div className="flex items-center justify-center mt-5 flex-col w-full">
                  <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png"
                    alt="/"
                    className="w-[350px]"
                  />
                  <h2 className="text-4xl text-active font-medium">
                    No Order Data
                  </h2>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="h-[35px]">
                    <tr>
                      {ordersColumns &&
                        ordersColumns.map((head, i) => (
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
                          {ordersColumns?.map((col, i) => (
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

export default Orders;
