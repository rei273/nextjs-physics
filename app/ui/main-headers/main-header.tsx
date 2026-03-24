'use client';

import NavLinksMainHeader from "../nav-links/nav-links-mainheader";
import Link from "next/link";
//import styles from '@/app/ui/home.module.css';
//import logo from "@/app/ui/logo.png"
import PhysTLogo from "@/app/ui/phys-logo";
import Image from "next/image";
import HambugerIcon from "@/app/assets/hamburgerIcon.svg";
import {useState } from 'react';

export default function MainHeader() {
  
  const [isMenuOpen, setIsMenuOopen] = useState<boolean>(false);
  const toggleMenu = () => {
    setIsMenuOopen(!isMenuOpen);
  };

  return (
    <header className="w-full mx-auto lg:p-8 lg:px-6">
      <div className="lg:mb-5 mb-20">
        <div className="justify-between full fixed z-40 w-full left-0 top-0 bg-white">
          <div className="flex flex-auto items-center mx-auto px-6 xl:container pt-3 pb-2">
            <div className="flex mx-auto flex-auto justify-between items-center relative">
              <div className="flex mx-auto gap-4 md:gap-10 items-center">
                <div className="flex items-center w-44 h-44">
                  <Link href="/">
                    <PhysTLogo />
                  </Link>
                </div>

                <div className="lg:hidden">
                  {/* Hamburger Icon */}
                  <button
                    className="focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                  >
                    <Image
                      src={HambugerIcon}
                      alt="Hamburger Menu"
                      className="w-[30px] h-[30px]"
                      width="25"
                      height="25"
                    />
                  </button>
                </div>

                <div
                  className={`${
                    isMenuOpen ? "block" : "hidden"
                  } absolute top-full mt-2 right-0 left-0 bg-[#] lg:flex lg:relative lg:flex-row lg:items-center lg:gap-10 z-50 px-2 py-2`}
                >
                  <nav>
                    <ul className="flex flex-row gap-3">
                      <li>
                        <NavLinksMainHeader href="/tutorials">
                          Brows Topics
                        </NavLinksMainHeader>
                      </li>
                      <li>
                        <NavLinksMainHeader href="/homework">
                          Homework
                        </NavLinksMainHeader>
                      </li>
                      <li>
                        <NavLinksMainHeader href="/chat">
                          Discussions
                        </NavLinksMainHeader>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="flex flex-auto items-center justify-end h-[40px] w-[100px]">
                <ul className="flex flex-row">
                  <li>
                    <NavLinksMainHeader href="/login">Login</NavLinksMainHeader>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
