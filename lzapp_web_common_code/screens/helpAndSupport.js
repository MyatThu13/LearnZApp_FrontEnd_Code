//PACKAGES
import { Link, useNavigate } from "react-router-dom";

//CONSTANTS & ASSETS
import { APP_DATA, GET_APP_NAME } from "../../app_constant";
import { STRINGS } from "../constant";
import { IMAGES, SVG_IMAGES } from "../assets";

//COMPONENTS
import { Header, LAView, LAText, LATextInput, LAButton } from "../components";

//PACKAGES
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import IconTint from "react-icon-tint";
import { useContext, useEffect, useState } from "react";

//API
import { auth } from "../api/config";
import { GET_COMMON_FAQS, GET_FAQS } from "../api/firebase_user";
import CollapseItem from "../components/CollapseItem";
import { ThemeContext } from "../context/ThemeProvider";
import BackArrowIcon from "../components/BackArrowIcon";
import { BundleContext } from "../context/BundleProvider";
import HTMLContent from "../components/HTMLContent";

function HelpAndSupport() {
  const { theme, currentTheme } = useContext(ThemeContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchTxt, setSearchTxt] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [filterFaqList, setFilterFaqList] = useState([]);
  const [openItemId, setOpenItemId] = useState(null);
  const navigation = useNavigate();
  const { selectedCertificate } = useContext(BundleContext);
  const userID = auth().currentUser.email;
  const APP_NAME = APP_DATA?.DISPLAY_APP_NAME
    ? APP_DATA?.DISPLAY_APP_NAME
    : GET_APP_NAME(selectedCertificate);

  const subject = `${APP_NAME} Feedback`;
  const CERT_NAME = GET_APP_NAME(selectedCertificate);
  const body = `\n\n\n\n\n\n\n===================== \nThank you for taking time to provide us your feedback. Please give as much information as possible. \n\nBelow details are used by our support team to troubleshoot any issues. Please do not remove this information. Thanks! ....`;
  const deviceDetails = `\n\n---------------- \nWeb app \nCertification: ${CERT_NAME} \nID - ${userID}\n----------------`;
  const mail = "support@learnzapp.com";

  useEffect(() => {
    getFaqList();
  }, []);

  useEffect(() => {
    if (filterFaqList) {
      if (searchTxt) {
        const res = filterFaqList.filter((item) =>
          item.question.toLowerCase().includes(searchTxt.toLowerCase())
        );
        if (res.length == 0) {
          setError("No Faqs available yet");
          setFaqList(res);
        } else {
          setError("");
          setFaqList(res);
        }
      } else {
        setError("");
        setFaqList(filterFaqList);
      }
    }
  }, [searchTxt]);

  async function getFaqList() {
    const result = await GET_FAQS();
    const result_common = await GET_COMMON_FAQS();
    setLoading(false);
    if (result.status || result_common.status) {
      const array = result?.data ?? [];
      const sortFaqs = array.sort((a, b) => a.id - b.id);
      const array_common = result_common?.data ?? [];
      const sortFaqs_common = array_common.sort((a, b) => a.id - b.id);

      const faqs = sortFaqs.concat(sortFaqs_common);
      setFaqList(faqs);
      setFilterFaqList(faqs);
      setError("");
    } else {
      setError(result.error);
    }
  }

  return (
    <LAView>
      {/* <Header /> */}
      <LAView flex="row" className="mb-3 flex items-center px-[24px]">
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
        <LAView flex="col" className="flex-1 mx-6">
          <LAText
            className="flex line-clamp-1 truncate"
            size="medium"
            font="600"
            color={"black"}
            title={STRINGS.help_support}
          />
        </LAView>
      </LAView>
      {/* <LAView
        flex="col"
        className="flex md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.5)] md:rounded-[20px] md:border-[1px] md:p-[24px] m-[24px]"
      > */}
      <div className="mx-10">
        <div className="searchbar flex items-center gap-2 w-full relative h-full mb-4">
          <div className="w-full">
            <LATextInput
              style={{ backgroundColor: theme.THEME_SCREEN_BACKGROUND_COLOR }}
              left={SVG_IMAGES?.searchIcon}
              type={"text"}
              name={"last_name"}
              placeholder={"Search by alphabets"}
              onChange={(e) =>
                e.target.value ? setSearchTxt(e.target.value) : setSearchTxt("")
              }
            />
          </div>
          <div className="p-2 rounded-[12px] bg-[#F6FAFF] dark:bg-[#222] h-full flext items-center justify-center">
            <Link
              target="_blank"
              to={`mailto:mailto:${mail}?subject='${subject}'&body='${encodeURIComponent(
                body
              )}${encodeURIComponent(deviceDetails)}'`}
              className="flex items-center justify-center"
            >
              <IconTint
                src={IMAGES?.ic_email}
                className="h-8 w-8"
                color={currentTheme === "light" ? "#101010" : "#fff"}
              />
            </Link>
          </div>
        </div>

        <div className=" mt-2 card p-2 sm:p-2 md:p-4 lg:p-4 border rounded-lg w-full">
          {faqList?.map((e, index) => {
            return (
              <BoomarkItem
                data={e}
                openItemId={openItemId}
                setOpenItemId={setOpenItemId}
                // isSelected={selectedIndex == index}
                // onClick={() => setSelectedIndex(index)}
                key={index}
              />
            );
          })}
        </div>
      </div>
      {/* </LAView> */}
    </LAView>
  );
}

function BoomarkItem(props) {
  const { theme, currentTheme } = useContext(ThemeContext);
  return (
    <CollapseItem
      key={props?.data?.id}
      id={props?.data?.id}
      title={props?.data?.question}
      openItemId={props?.openItemId}
      arrowRight={true}
      setOpenItemId={props?.setOpenItemId}
      isExpanded={props?.data?.id == props?.openItemId}
      className={"w-full border-b pb-2"}
    >
      <p
        className={`text-sm font-normal text-[${theme?.THEME_TEXT_BLACK_LIGHT}]`}
        style={{ color: `${theme?.THEME_TEXT_BLACK}` }}
      >
        <HTMLContent htmlContent={props?.data?.desc} />
      </p>
    </CollapseItem>
  );
}

export default HelpAndSupport;
