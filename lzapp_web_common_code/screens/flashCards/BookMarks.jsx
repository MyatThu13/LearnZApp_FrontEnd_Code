import React from "react";
import { LAText, LAView } from "../../components";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { STRINGS } from "../../constant";
import { useNavigate } from "react-router-dom";

const Bookmarks = () => {
  const navigation = useNavigate();
  return (
    <LAView className="relative w-full" type="">
      <div className="page-heading mx-4 my-4">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigation(-1)}
            className="h-10 w-10 flex items-center justify-center border-2 rounded-lg"
          >
            <img className=""
              src={IMAGES?.ic_back}
              alt="backarrow"
              width={20}
              height={20} />
          </button>

          <LAText
            className="flex line-clamp-1 truncate "
            size="medium"
            font="600"
            color={"black"}
            title={"Bookmarks"}
          />
        </div>

        <div className="my-2 flex items-center justify-between border-b border-dashed pb-2">
          <h4 className="text-base font-semibold ">
            Questions 2/<span className="text-sm font-normal ">30</span>
          </h4>
          <img src={SVG_IMAGES?.BookMarkSave} alt="bookmark save" />
        </div>

        <div className="relative w-full bg-[#007054]  h-60 rounded-2xl mt-4">
          <div>
            <p className="text-center text-base font-semibold text-white pt-8">
              Understand the CIA Triad elements of confidentiality, integrity,
              and availability.
            </p>
            <img className="absolute top-0 left-0" src={SVG_IMAGES?.Circle1} />
            <img className="absolute top-0 left-0" src={SVG_IMAGES?.Circle2} />
            <img className="absolute top-0 right-0" src={SVG_IMAGES?.Circle3} />
          </div>
          <div className="w-full flex items-center justify-center absolute bottom-[-25px]">
            <button className="bg-white dask:bg-black dark:text-white px-20 py-3 shadow-lg w-fit rounded-lg">
              <LAText
                className="flex text-sm sm:text-sm md:text-base lg:text-base  line-clamp-1 text-[#007054] truncate "
                size="medium"
                font="600"
                color={"black"}
                title={"Show Answer"}
              />
            </button>
          </div>
        </div>
      </div>

    </LAView>
  );
};

export default Bookmarks;
