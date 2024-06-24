import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";
function Footerr() {
  return (
    <Footer container className="border-t-4 mt-10">
      <div className="w-full p-3">
        <div className="flex justify-between">
          <Link
            to="/"
            className="self-center text-sm hidden sm:inline font-bold "
          >
            <span className="px-2 py-1 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              BaoTN's
            </span>
            Blog
          </Link>
          <div>
            <Footer.Title title="about" />
            <div className="hidden sm:inline">
              <Footer.LinkGroup col>
                <Footer.Link href="#">My profile</Footer.Link>
                <Footer.Link href="#">BaoTN's Blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
          <div>
            <Footer.Title title="Follow us" />
            <div className="hidden sm:inline">
              <Footer.LinkGroup col>
                <Footer.Link
                  target="_blank"
                  href="https://github.com/ThaiNguyenGiaBao"
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  target="_blank"
                  href="https://www.facebook.com/bao.thainguyengia/"
                >
                  Facebook
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
          <div>
            <Footer.Title title="Legal" />
            <div className="hidden sm:inline">
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Thái Nguyễn Gia Bảo" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon
              target="_blank"
              href="https://www.facebook.com/bao.thainguyengia/"
              icon={BsFacebook}
            />
            <Footer.Icon
              target="_blank"
              href="https://www.instagram.com/tngiabaoo/"
              icon={BsInstagram}
            />
            <Footer.Icon
              target="_blank"
              href="https://github.com/ThaiNguyenGiaBao"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default Footerr;
