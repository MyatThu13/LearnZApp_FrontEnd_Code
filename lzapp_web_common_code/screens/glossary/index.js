import React, { useContext, useEffect, useState } from "react";
import { LAText, LATextInput, LAView } from "../../components";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { useCollapse } from "react-collapsed";
import CollapseItem from "../../components/CollapseItem";
import GlossaryFilter from "../../components/popup/GlossaryFilter";
import { GET_GLOSSARY } from "../../api/content";
import { STRING } from "../../constant";
import { BundleContext } from "../../context/BundleProvider";
import { USER_DEAFULT_KEY } from "../../constant/event";
import BackArrowIcon from "../../components/BackArrowIcon";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeProvider";

const Glossary = () => {
  const { selectedCertificate } = useContext(BundleContext);
  const { theme, currentTheme } = useContext(ThemeContext);
  const [openItemId, setOpenItemId] = useState(null);
  const [glossaryState, setGlossaryState] = useState({ filterPopup: false });
  const [searchTxt, setSearchTxt] = useState("");
  const [glossaryData, setGlossaryData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("ALL");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFilterView, setFilterView] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    var validaddress = /^[0-9].*$/;
    const GLOSSARY = GET_GLOSSARY(selectedCertificate);
    if (searchTxt) {
      if (selectedValue == "#") {
        const filter = GLOSSARY.filter(
          (data) =>
            data.value.toLowerCase().includes(searchTxt.toLowerCase()) &&
            validaddress.test(data?.value ?? " ")
        );
        setGlossaryData(filter);
      } else if (selectedValue != "ALL") {
        const filter = GLOSSARY.filter(
          (data) =>
            data?.value?.toLowerCase()?.includes(searchTxt?.toLowerCase()) &&
            selectedValue?.toLocaleLowerCase() ==
              (data?.value ?? " ")[0]?.toLocaleLowerCase()
        );
        setGlossaryData(filter);
      } else {
        const filter = GLOSSARY.filter((data) =>
          data?.value?.toLowerCase().includes(searchTxt?.toLowerCase())
        );
        setGlossaryData(filter);
      }
    } else {
      if (selectedValue == "#") {
        const filter = GLOSSARY.filter((data) =>
          validaddress.test(data?.value ?? " ")
        );
        setGlossaryData(filter);
      } else if (selectedValue != "ALL") {
        const filter = GLOSSARY.filter(
          (data) =>
            selectedValue?.toLocaleLowerCase() ==
            (data?.value ?? " ")[0]?.toLocaleLowerCase()
        );
        setGlossaryData(filter);
      } else {
        const filter = GLOSSARY;
        setGlossaryData(filter);
      }
    }
  }, [searchTxt, selectedValue, glossaryState?.filterPopup]);

  return (
    <LAView className=" mx-4 sm:mx-4 md:mx-8 lg:mx-8 md-4 sm:mb-4 md:mb-8 lg:mb-8">
      <div className="page-heading flex items-center gap-2 mx-4 my-4">
        <button
          className="rounded-lg border-2 border-[#000] dark:border-[#fff] px-2 py-2"
          onClick={() => {
            navigation(-1);
          }}
        >
          <BackArrowIcon
            color={currentTheme === "light" ? "#101010" : "#fff"}
          />
        </button>

        <LAText
          className=" line-clamp-1 truncate "
          size="medium"
          font="600"
          color={"black"}
          title={"Glossary"}
        />
      </div>

      <div className="searchbar flex items-center gap-2 w-full relative h-full">
        <div className="w-full">
          <LATextInput
            left={SVG_IMAGES?.searchIcon}
            type={"text"}
            name={"last_name"}
            onChange={(e) =>
              e.target.value ? setSearchTxt(e.target.value) : setSearchTxt("")
            }
            placeholder={"Search by alphabets"}
          />
        </div>
        <div className="bg-slate=400 h-full">
          <button
            onClick={() => {
              setGlossaryState((prev) => ({
                ...prev,
                filterPopup: !glossaryState.filterPopup,
              }));
            }}
            className="p-2 rounded-[12px] bg-[#F6FAFF] dark:bg-[#222] h-full"
          >
            <img className="h-full w-full" src={SVG_IMAGES?.filterIcon} />
          </button>
        </div>
      </div>

      {glossaryData.length > 0 ? (
        <div className=" mt-2 card p-2 sm:p-2 md:p-4 lg:p-4 border rounded-lg w-full">
          {glossaryData?.map((ele, idx) => {
            return (
              <CollapseItem
                key={idx}
                id={idx}
                showImage={false}
                title={ele?.value}
                openItemId={openItemId}
                arrowRight={true}
                setOpenItemId={setOpenItemId}
                className={"w-full border-b pb-2"}
                isExpanded={idx == openItemId}
              >
                <p
                  className="text-gray-800 dark:text-gray-300 text-lg mx-6 mb-4"
                >
                  {ele?.description}
                </p>
              </CollapseItem>
            );
          })}
        </div>
      ) : (
        <div className="w-full h-full mt-4  flex items-center justify-center">
          <p>No Records Found</p>
        </div>
      )}

      {glossaryState?.filterPopup && (
        <GlossaryFilter
          selectedValue={selectedValue}
          onCancle={() => {
            setGlossaryState((prev) => ({
              ...prev,
              filterPopup: false,
            }));
            setFilterView(false);
          }}
          onSelectItem={(item) => {
            setSelectedValue(item);
            setSelectedIndex(-1);
            setFilterView(false);
            setGlossaryState((prev) => ({
              ...prev,
              filterPopup: false,
            }));
          }}
          // onCancle={() => {
          //   setGlossaryState((prev) => ({ ...prev, filterPopup: false }));
          // }}
          onPress={(e, index) => {
            setGlossaryState((prev) => ({
              ...prev,
              filterPopup: false,
            }));
          }}
          // onSelectItem={(item) => {
          //   setSelectedValue(item);
          //   setSelectedIndex(-1);
          //   setFilterView(false);
          // }}
        />
      )}
    </LAView>
  );
};

export default Glossary;
