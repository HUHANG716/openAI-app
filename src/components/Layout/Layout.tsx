import React, { ReactNode, useEffect, useState } from "react";
import styles from "./index.module.scss";
import "../../styles/global.scss";
import SideBar from "../SideBar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import NavBarHome from "../NavBarHome/NavBarHome";
import { CpntsState, setIsSideBarOpen } from "../../store/cpntsSlice";

type Props = {};

const Layout = ({}: Props) => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const { isSideBarOpen } = useSelector((state: CpntsState) => state.cpnts);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      window.innerWidth < 768 && dispatch(setIsSideBarOpen(false));
    };
    handleResize();

    window.onresize = handleResize;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <NavBarHome />
      <div className={`${styles.container} `}>
        <SideBar />
        <div className={`${styles.main} ${isSideBarOpen ? "" : styles.noMarginLeft}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
