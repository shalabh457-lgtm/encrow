import React, { useState } from "react";
import Review from "./Review/Review";
import loader from "../../assets/icons/loader.svg";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import useAuthStore from "../../stores";

const Reviews = ({ gigId }) => {
  const { authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    {
      _id: "r1",
      userId: "u1",
      star: 5,
      desc: "Great service! Highly recommended.",
    },
    {
      _id: "r2",
      userId: "u2",
      star: 4,
      desc: "Good work, but could be faster.",
    }
  ]);

  const initialValues = {
    desc: "",
    star: "",
    gigId: gigId,
  };

  const validationSchema = yup.object({
    desc: yup.string().required("Required"),
    star: yup.string().required("Required"),
  });

  const onSubmit = async (payload, actions) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData([...data, {
        _id: Date.now().toString(),
        userId: authUser?._id,
        star: Number(payload.star),
        desc: payload.desc
      }]);
      toast.success("Thanks for your Review!😊", {
        position: "bottom-right",
        toastId: 1,
        autoClose: 1500,
      });
      setLoading(false);
      actions.resetForm();
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong", {
        position: "bottom-right",
        toastId: 1,
        autoClose: 1500,
      });
    }
  };

  const { handleChange, values, handleBlur, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });

  return (
    <div className="w-full flex items-start justify-start flex-col gap-4">
        <>
          {data?.length === 0 ? (
            <div className="flex items-center justify-center mt-5 flex-col w-full">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png"
                alt="/"
                className="w-[350px]"
              />
              <h2 className="text-xl md:text-4xl text-active font-medium">
                Ooops! No Reviews
              </h2>
            </div>
          ) : (
            data.map((item) => <Review key={item?._id} item={item} />)
          )}
        </>
      {authUser && (
        <div className="w-full flex flex-col items-start justify-start gap-4 mt-4 border-t pt-3">
          <h3 className="text-active text-xl font-semibold">Add a review</h3>
          <form
            action=""
            className="flex items-start flex-col gap-2 justify-start w-full"
            onSubmit={handleSubmit}
          >
            <div className="flex items-end w-full justify-between gap-4 md:flex-row flex-col">
              <textarea
                placeholder="Send your review"
                className={`w-full border px-4 py-2 outline-none rounded-md h-[120px] resize-none focus:border-primary ${
                  errors.desc && touched.desc ? "border-red-500" : ""
                }`}
                name="desc"
                value={values.desc}
                onChange={handleChange}
                onBlur={handleBlur}
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div className="flex items-start justify-start flex-col">
                <label
                  htmlFor="star"
                  className="text-sm font-medium cursor-pointer"
                >
                  Rate
                </label>
                <select
                  name="star"
                  id="star"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.star}
                  className={`border outline-none cursor-pointer px-4 rounded focus:border-primary text-gray-400  h-10 ${
                    errors.star && touched.star ? "border-red-500" : ""
                  }`}
                >
                  {["star", 1, 2, 3, 4, 5].map((item, i) => (
                    <option value={item} key={i}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="outline-none bg-primary/80 hover:bg-primary w-fit px-5 py-2 rounded cursor-pointer text-white transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <img src={loader} alt="/" className="w-[40px]" />
                </div>
              ) : (
                "Send"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reviews;
