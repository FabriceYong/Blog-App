import { Footer } from 'flowbite-react'
import React from 'react'
import { FaDribbble, FaFacebook, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const FooterCom = () => {
  return (
    <Footer container className="border-t-8 border-orange-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mb-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-2xl sm:text-3xl font-medium dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 rounded-lg text-slate-100">
                Fabrice's{' '}
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt4 sm:grid-cols-4 sm:gap-6">
            <div className="">
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com/FabriceYong"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Projects
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fabrice's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="">
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com/FabriceYong"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="">
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms and Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Fabrices's Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={FaFacebook} />
            <Footer.Icon href="#" icon={FaInstagram} />
            <Footer.Icon href="#" icon={FaTwitter} />
            <Footer.Icon href="https//:www.github.com/FabriceYong" icon={FaGithub} />
            <Footer.Icon href="#" icon={FaDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterCom
