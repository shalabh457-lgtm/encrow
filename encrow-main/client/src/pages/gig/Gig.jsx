import React from "react";
import GigsDetails from "../../components/GigsContents/SingleGigContent/GigsDetails";
import GigsOrder from "../../components/GigsContents/SingleGigContent/GigsOrder";
import { useParams } from "react-router-dom";
import { gigCards } from "../../data/data";

const Gig = () => {
  const { id } = useParams();
  const data = gigCards.find((g) => g.id === id) || gigCards[0];
  const userId = data?.userId;

  return (
    <main className="py-40 pb-10">
      <div className="contain">
          <div className="w-full flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div className="w-full lg:w-[70%]">
              <GigsDetails data={data} id={id} userId={userId} />
            </div>
            <div className="w-full lg:w-[30%] sticky top-40">
              <GigsOrder data={data} id={id} />
            </div>
          </div>
      </div>
    </main>
  );
};

export default Gig;
